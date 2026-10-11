const prisma = require('../../lib/db');

module.exports = async (req, res) => {
  const word = await prisma.word.findUnique({
    where: { word: req.query.word },
    include: { recordings: { include: { postal: true }, orderBy: { postalCode: 'asc' } } },
  });

  // Unpublished entries are withheld from the public API entirely, not just
  // hidden from the menu — otherwise unfinished data is still downloadable.
  if (!word || !word.published) {
    res.status(404).json({ error: 'Word not found' });
    return;
  }

  const features = word.recordings.map((recording) => ({
    type: 'Feature',
    geometry: recording.postal.geometry,
    properties: {
      name: recording.postal.code,
      lugar: recording.postal.placeName,
      comunidad: recording.postal.comunidad,
      provincia: recording.postal.provincia,
      variation: recording.variation,
      audioUrl: recording.audioUrl,
      comment: recording.comment,
    },
  }));

  res.status(200).json({
    word: word.word,
    type: 'FeatureCollection',
    features,
  });
};
