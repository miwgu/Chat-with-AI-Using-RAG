import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'ai_chat_db2025',
  port: Number(process.env.DB_PORT) || 3306,
  max: 10,                      // max number of clients in the pool
  idleTimeoutMillis: 30000,    // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000 // return an error after 2 seconds if connection could not be established
});


// Retry logic for the connection
async function connectWithRetry(attemptsRemaining: number) {
  if (attemptsRemaining === 0) {
    console.error('❌ Max attempts reached. Could not connect to the database.');
    return;
  }

  try {
    const client = await db.connect();
    await client.query('SELECT 1'); // Simple test query
    console.log('✅ Connected to the database.');
    client.release();
  } catch (err: any) {
    console.error('⚠️ Error connecting to the database:', err.message);
    console.log(`🔁 Retrying... Attempts remaining: ${attemptsRemaining - 1}`);
    setTimeout(() => connectWithRetry(attemptsRemaining - 1), 2000); // Retry after 2 seconds
  }
}

// Start connection attempts
connectWithRetry(5);