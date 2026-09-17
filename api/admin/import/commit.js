const { requireAdmin } = require('../../../lib/auth');
const { validateRows, commitRows } = require('../../../lib/bulkImport');

module.exports = requireAdmin(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { type, rows } = req.body || {};
  if (!type || !Array.isArray(rows)) {
    res.status(400).json({ error: '"type" and "rows" (array) are required' });
    return;
  }

  const { validRows, errors: skipped } = await validateRows(type, rows);
  const results = await commitRows(type, validRows);

  res.status(200).json({
    committed: results.filter((r) => r.status === 'ok').length,
    failed: results.filter((r) => r.status === 'error'),
    skippedInvalid: skipped,
  });
});
