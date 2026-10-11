const prisma = require('../../lib/db');

module.exports = async (req, res) => {
  const phenomenon = await prisma.phenomenon.findUnique({
    where: { key: req.query.key },
    include: {
      categories: { orderBy: { id: 'asc' } },
      recordings: { include: { postal: true, category: true }, orderBy: { postalCode: 'asc' } },
    },
  });

  // Unpublished entries are withheld from the public API entirely, not just
  // hidden from the menu — otherwise unfinished data is still downloadable.
  if (!phenomenon || !phenomenon.published) {
    res.status(404).json({ error: 'Phenomenon not found' });
    return;
  }

  const features = phenomenon.recordings.map((recording) => ({
    type: 'Feature',
    geometry: recording.postal.geometry,
    properties: {
      name: recording.postal.code,
      lugar: recording.postal.placeName,
      comunidad: recording.postal.comunidad,
      provincia: recording.postal.provincia,
      category: recording.category?.type ?? null,
      color: recording.category?.color ?? null,
      audioUrl: recording.audioUrl,
      comment: recording.comment,
    },
  }));

  // The legend only lists categories that actually have data at some point,
  // so pre-defined categories can sit unused without cluttering the map.
  const usedCategoryIds = new Set(phenomenon.recordings.map((r) => r.categoryId).filter(Boolean));

  res.status(200).json({
    key: phenomenon.key,
    label: phenomenon.label,
    comment: phenomenon.comment,
    categories: phenomenon.categories
      .filter((c) => usedCategoryIds.has(c.id))
      .map((c) => ({ type: c.type, color: c.color })),
    type: 'FeatureCollection',
    features,
  });
};
