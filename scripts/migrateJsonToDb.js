// One-off migration: reads the legacy static JSON files from src/data and
// loads them into Postgres via Prisma. Run once against a fresh DB
// (`npm run migrate:json` from server/), then retire src/data/*.json.
//
// Known data-quality issues handled defensively rather than crashing (see
// migration plan section 6): ~100/129 words and ~107/355 phenomena have no
// `distribution` array at all (just a bare IPA transcription list) — these
// are still imported as bare Word/Phenomenon rows with zero recordings, so
// they remain searchable but simply render "no data" instead of the blank
// crash the old static-JSON frontend produced for them.
//
// No real audio files exist anywhere in the repo today, so `audioUrl` is
// left NULL for every recording in this pass — it gets populated later via
// the admin audio-upload UI (migration plan Phase 3).

const path = require('path');
const prisma = require('../lib/db');

const postalCodesJson = require(path.join(__dirname, '../src/data/postal_codes.json'));
const wordsJson = require(path.join(__dirname, '../src/data/words.json'));
const phenomenaJson = require(path.join(__dirname, '../src/data/phenomenoms.json'));

function normalizeAudioUrl() {
  // Phase 1: none of the legacy audioURL values resolve to a real file
  // anywhere (verified: zero .wav/.mp3 assets in the repo). Always null;
  // real CDN URLs get backfilled in Phase 3.
  return null;
}

async function migratePostalCodes() {
  const codes = new Set();
  let created = 0;
  for (const feature of postalCodesJson.features) {
    const { name, lugar, comunidad, provincia } = feature.properties;
    await prisma.postalCode.upsert({
      where: { code: name },
      update: {},
      create: {
        code: name,
        placeName: lugar,
        comunidad: comunidad ?? null,
        provincia: provincia ?? null,
        geometry: feature.geometry,
      },
    });
    codes.add(name);
    created++;
  }
  console.log(`postal codes: ${created} upserted`);
  return codes;
}

async function migrateWords(knownPostalCodes) {
  let wordsCreated = 0;
  let recordingsCreated = 0;
  const skippedRecordings = [];

  for (const entry of wordsJson) {
    const word = await prisma.word.upsert({
      where: { word: entry.word },
      update: {},
      create: { word: entry.word },
    });
    wordsCreated++;

    if (!Array.isArray(entry.distribution)) continue;

    for (const dist of entry.distribution) {
      if (!knownPostalCodes.has(dist.postalcode)) {
        skippedRecordings.push({ word: entry.word, postalcode: dist.postalcode, reason: 'unknown postal code' });
        continue;
      }
      await prisma.wordRecording.upsert({
        where: { wordId_postalCode: { wordId: word.id, postalCode: dist.postalcode } },
        update: {},
        create: {
          wordId: word.id,
          postalCode: dist.postalcode,
          variation: dist.variation ?? null,
          audioUrl: normalizeAudioUrl(dist.audioURL),
          comment: dist.comment || null,
        },
      });
      recordingsCreated++;
    }
  }

  console.log(`words: ${wordsCreated} upserted, ${recordingsCreated} recordings created`);
  if (skippedRecordings.length) {
    console.log(`  skipped ${skippedRecordings.length} word recordings (unknown postal code) — sample:`, skippedRecordings.slice(0, 5));
  }
}

async function migratePhenomena(knownPostalCodes) {
  let phenomenaCreated = 0;
  let recordingsCreated = 0;
  const skippedRecordings = [];
  const skippedCategories = [];

  for (const entry of phenomenaJson) {
    const phenomenon = await prisma.phenomenon.upsert({
      where: { key: entry.key },
      update: {},
      create: { key: entry.key, label: entry.word },
    });
    phenomenaCreated++;

    const categoryIdByType = new Map();
    for (const variation of entry.variations || []) {
      if (!variation || typeof variation !== 'object' || !variation.type || !variation.color) {
        skippedCategories.push({ phenomenon: entry.key, variation });
        continue;
      }
      const category = await prisma.phenomenonCategory.upsert({
        where: { phenomenonId_type: { phenomenonId: phenomenon.id, type: variation.type } },
        update: { color: variation.color },
        create: { phenomenonId: phenomenon.id, type: variation.type, color: variation.color },
      });
      categoryIdByType.set(variation.type, category.id);
    }

    if (!Array.isArray(entry.distribution)) continue;

    for (const dist of entry.distribution) {
      if (!knownPostalCodes.has(dist.postalcode)) {
        skippedRecordings.push({ phenomenon: entry.key, postalcode: dist.postalcode, reason: 'unknown postal code' });
        continue;
      }
      const categoryId = categoryIdByType.get(dist.category) ?? null;
      if (dist.category && categoryId === null) {
        skippedRecordings.push({ phenomenon: entry.key, postalcode: dist.postalcode, reason: `unresolvable category "${dist.category}"` });
      }
      await prisma.phenomenonRecording.upsert({
        where: { phenomenonId_postalCode: { phenomenonId: phenomenon.id, postalCode: dist.postalcode } },
        update: {},
        create: {
          phenomenonId: phenomenon.id,
          postalCode: dist.postalcode,
          categoryId,
          audioUrl: normalizeAudioUrl(dist.audioURL),
          comment: dist.comment || null,
        },
      });
      recordingsCreated++;
    }
  }

  console.log(`phenomena: ${phenomenaCreated} upserted, ${recordingsCreated} recordings created`);
  if (skippedCategories.length) {
    console.log(`  skipped ${skippedCategories.length} malformed category/legend entries (not {type,color} objects) — sample:`, skippedCategories.slice(0, 5));
  }
  if (skippedRecordings.length) {
    console.log(`  skipped/flagged ${skippedRecordings.length} phenomenon recordings — sample:`, skippedRecordings.slice(0, 5));
  }
}

async function main() {
  const knownPostalCodes = await migratePostalCodes();
  await migrateWords(knownPostalCodes);
  await migratePhenomena(knownPostalCodes);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
