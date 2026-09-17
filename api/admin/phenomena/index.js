const { requireAdmin } = require('../../../lib/auth');
const prisma = require('../../../lib/db');

module.exports = requireAdmin(async (req, res) => {
  if (req.method === 'GET') {
    const phenomena = await prisma.phenomenon.findMany({
      select: { id: true, key: true, label: true, _count: { select: { recordings: true } } },
      orderBy: { label: 'asc' },
    });
    res.status(200).json(phenomena.map((p) => ({ id: p.id, key: p.key, label: p.label, recordingsCount: p._count.recordings })));
    return;
  }

  if (req.method === 'POST') {
    const { key, label } = req.body || {};
    if (!key || !label) {
      res.status(400).json({ error: 'key and label are required' });
      return;
    }
    const created = await prisma.phenomenon.create({ data: { key, label } });
    res.status(201).json(created);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
});
