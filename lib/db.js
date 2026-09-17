const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);

module.exports = globalForPrisma.prisma ?? (globalForPrisma.prisma = new PrismaClient({ adapter }));
