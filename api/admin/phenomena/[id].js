const { requireAdmin } = require('../../../lib/auth');
const prisma = require('../../../lib/db');

module.exports = requireAdmin(async (req, res) => {
  const id = Number(req.query.id);

  if (req.method === 'DELETE') {
    await prisma.phenomenon.delete({ where: { id } });
    res.status(204).end();
    return;
  }

  if (req.method === 'PUT') {
    const { key, label } = req.body || {};
    const updated = await prisma.phenomenon.update({ where: { id }, data: { key, label } });
    res.status(200).json(updated);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
});
