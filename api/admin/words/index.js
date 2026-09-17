const { requireAdmin } = require('../../../lib/auth');
const prisma = require('../../../lib/db');

module.exports = requireAdmin(async (req, res) => {
  if (req.method === 'GET') {
    const words = await prisma.word.findMany({
      select: { id: true, word: true, _count: { select: { recordings: true } } },
      orderBy: { word: 'asc' },
    });
    res.status(200).json(words.map((w) => ({ id: w.id, word: w.word, recordingsCount: w._count.recordings })));
    return;
  }

  if (req.method === 'POST') {
    const { word } = req.body || {};
    if (!word) {
      res.status(400).json({ error: 'word is required' });
      return;
    }
    const created = await prisma.word.create({ data: { word } });
    res.status(201).json(created);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
});
