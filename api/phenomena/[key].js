const prisma = require('../../lib/db');

module.exports = async (req, res) => {
  const phenomenon = await prisma.phenomenon.findUnique({
    where: { key: req.query.key },
    include: {
      categories: true,
      recordings: { include: { postal: true, category: true } },
    },
  });

  if (!phenomenon) {
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

  res.status(200).json({
    key: phenomenon.key,
    label: phenomenon.label,
    categories: phenomenon.categories.map((c) => ({ type: c.type, color: c.color })),
    type: 'FeatureCollection',
    features,
  });
};
