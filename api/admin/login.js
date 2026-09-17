const { login } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  const token = await login(email, password);
  if (!token) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  res.status(200).json({ token });
};
