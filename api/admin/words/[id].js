const { requireAdmin } = require('../../../lib/auth');
const prisma = require('../../../lib/db');

module.exports = requireAdmin(async (req, res) => {
  const id = Number(req.query.id);

  if (req.method === 'DELETE') {
    await prisma.word.delete({ where: { id } });
    res.status(204).end();
    return;
  }

  if (req.method === 'PUT') {
    const { word, published } = req.body || {};
    const data = {};
    if (word !== undefined) data.word = word;
    if (published !== undefined) data.published = published;
    const updated = await prisma.word.update({ where: { id }, data });
    res.status(200).json(updated);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
});
