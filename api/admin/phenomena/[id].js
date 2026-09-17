const { requireAdmin } = require('../../../lib/auth');
const prisma = require('../../../lib/db');

module.exports = requireAdmin(async (req, res) => {
  const id = Number(req.query.id);

  if (req.method === 'GET') {
    const phenomenon = await prisma.phenomenon.findUnique({ where: { id } });
    if (!phenomenon) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(200).json(phenomenon);
    return;
  }

  if (req.method === 'DELETE') {
    await prisma.phenomenon.delete({ where: { id } });
    res.status(204).end();
    return;
  }

  if (req.method === 'PUT') {
    const { key, label, comment } = req.body || {};
    const data = {};
    if (key !== undefined) data.key = key;
    if (label !== undefined) data.label = label;
    if (comment !== undefined) data.comment = comment;
    const updated = await prisma.phenomenon.update({ where: { id }, data });
    res.status(200).json(updated);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
});
