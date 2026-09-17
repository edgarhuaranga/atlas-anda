const { requireAdmin } = require('../../../lib/auth');
const { validateRows } = require('../../../lib/bulkImport');

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

  const { validRows, errors } = await validateRows(type, rows);
  res.status(200).json({
    summary: { total: rows.length, valid: validRows.length, invalid: errors.length },
    errors,
  });
});
