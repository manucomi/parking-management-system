import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
});

console.log('=== DATABASE CONFIG ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log(
    'DATABASE_URL (first 50 chars):',
    process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NOT SET',
);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SSL enabled:', process.env.NODE_ENV === 'production');
console.log('=======================');

pool.on('connect', () => {
    console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err.message);
    console.error('❌ Error code:', err.code);
    console.error('❌ Error stack:', err.stack);
});

export default pool;
