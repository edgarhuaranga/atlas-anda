const prisma = require('../../lib/db');

module.exports = async (req, res) => {
  const words = await prisma.word.findMany({
    select: { id: true, word: true },
    orderBy: { word: 'asc' },
  });
  res.status(200).json(words);
};
