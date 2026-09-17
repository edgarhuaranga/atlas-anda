const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('./db');

const TOKEN_TTL = '7d';

async function login(email, password) {
  let admin = await prisma.adminUser.findFirst();

  if (!admin) {
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return null;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await prisma.adminUser.create({ data: { email, passwordHash } });
  } else {
    if (email !== admin.email) return null;
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return null;
  }

  return jwt.sign({ sub: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function requireAdmin(handler) {
  return async (req, res) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      res.status(401).json({ error: 'Missing token' });
      return;
    }

    try {
      req.admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    return handler(req, res);
  };
}

module.exports = { login, requireAdmin };
