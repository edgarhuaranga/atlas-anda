const prisma = require('./db');

async function validateRows(type, rows) {
  const postalCodes = new Set((await prisma.postalCode.findMany({ select: { code: true } })).map((p) => p.code));
  const errors = [];
  const validRows = [];

  if (type === 'wordRecordings') {
    rows.forEach((row, i) => {
      const rowNum = i + 1;
      if (!row.word) return errors.push({ row: rowNum, message: 'missing "word"' });
      if (!row.postalcode) return errors.push({ row: rowNum, message: 'missing "postalcode"' });
      if (!postalCodes.has(row.postalcode)) return errors.push({ row: rowNum, message: `unknown postal code "${row.postalcode}"` });
      validRows.push(row);
    });
  } else if (type === 'phenomenonRecordings') {
    rows.forEach((row, i) => {
      const rowNum = i + 1;
      if (!row.key) return errors.push({ row: rowNum, message: 'missing "key"' });
      if (!row.postalcode) return errors.push({ row: rowNum, message: 'missing "postalcode"' });
      if (!postalCodes.has(row.postalcode)) return errors.push({ row: rowNum, message: `unknown postal code "${row.postalcode}"` });
      if (row.category && !row.color) return errors.push({ row: rowNum, message: `category "${row.category}" has no "color" (required the first time a category is used)` });
      validRows.push(row);
    });
  } else {
    throw new Error(`Unknown import type "${type}"`);
  }

  return { validRows, errors };
}

async function commitRows(type, rows) {
  const results = [];

  if (type === 'wordRecordings') {
    for (const row of rows) {
      try {
        const word = await prisma.word.upsert({ where: { word: row.word }, update: {}, create: { word: row.word } });
        await prisma.wordRecording.upsert({
          where: { wordId_postalCode: { wordId: word.id, postalCode: row.postalcode } },
          update: { variation: row.variation || null, audioUrl: row.audioUrl || null, comment: row.comment || null },
          create: { wordId: word.id, postalCode: row.postalcode, variation: row.variation || null, audioUrl: row.audioUrl || null, comment: row.comment || null },
        });
        results.push({ row, status: 'ok' });
      } catch (err) {
        results.push({ row, status: 'error', message: err.message });
      }
    }
  } else if (type === 'phenomenonRecordings') {
    for (const row of rows) {
      try {
        const phenomenon = await prisma.phenomenon.upsert({
          where: { key: row.key },
          update: row.label ? { label: row.label } : {},
          create: { key: row.key, label: row.label || row.key },
        });
        let categoryId = null;
        if (row.category) {
          const category = await prisma.phenomenonCategory.upsert({
            where: { phenomenonId_type: { phenomenonId: phenomenon.id, type: row.category } },
            update: row.color ? { color: row.color } : {},
            create: { phenomenonId: phenomenon.id, type: row.category, color: row.color },
          });
          categoryId = category.id;
        }
        await prisma.phenomenonRecording.upsert({
          where: { phenomenonId_postalCode: { phenomenonId: phenomenon.id, postalCode: row.postalcode } },
          update: { categoryId, audioUrl: row.audioUrl || null, comment: row.comment || null },
          create: { phenomenonId: phenomenon.id, postalCode: row.postalcode, categoryId, audioUrl: row.audioUrl || null, comment: row.comment || null },
        });
        results.push({ row, status: 'ok' });
      } catch (err) {
        results.push({ row, status: 'error', message: err.message });
      }
    }
  }

  return results;
}

module.exports = { validateRows, commitRows };
