const prisma = require('../../lib/db');

module.exports = async (req, res) => {
  const phenomena = await prisma.phenomenon.findMany({
    where: { published: true, recordings: { some: {} } },
    select: { id: true, key: true, label: true },
    orderBy: { label: 'asc' },
  });
  res.status(200).json(phenomena);
};
