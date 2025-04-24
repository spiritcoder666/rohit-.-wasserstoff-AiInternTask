import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create a connection pool
let pool;

export async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL || 
    'postgresql://postgres:postgres@localhost:5432/whatsbeatsrock';
  
  pool = new Pool({ connectionString });
  
  try {
    // Test connection
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Initialize tables if they don't exist
    await initTables(client);
    
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

async function initTables(client) {
  try {
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        score INTEGER DEFAULT 0
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS guess_history (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        guess_word VARCHAR(255) NOT NULL,
        target_word VARCHAR(255) NOT NULL,
        success BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS global_guesses (
        id SERIAL PRIMARY KEY,
        guess_word VARCHAR(255) UNIQUE NOT NULL,
        count INTEGER DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
}

export async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Game sessions
export async function createGameSession(sessionId) {
  const result = await query(
    'INSERT INTO game_sessions (session_id) VALUES ($1) RETURNING *',
    [sessionId]
  );
  return result.rows[0];
}

export async function updateGameScore(sessionId, score) {
  const result = await query(
    'UPDATE game_sessions SET score = $1 WHERE session_id = $2 RETURNING *',
    [score, sessionId]
  );
  return result.rows[0];
}

export async function endGameSession(sessionId) {
  const result = await query(
    'UPDATE game_sessions SET ended_at = CURRENT_TIMESTAMP WHERE session_id = $1 RETURNING *',
    [sessionId]
  );
  return result.rows[0];
}

// Guess history
export async function addGuessToHistory(sessionId, guessWord, targetWord, success) {
  const result = await query(
    'INSERT INTO guess_history (session_id, guess_word, target_word, success) VALUES ($1, $2, $3, $4) RETURNING *',
    [sessionId, guessWord, targetWord, success]
  );
  return result.rows[0];
}

export async function getSessionGuessHistory(sessionId) {
  const result = await query(
    'SELECT * FROM guess_history WHERE session_id = $1 ORDER BY created_at DESC',
    [sessionId]
  );
  return result.rows;
}

// Global guess counter
export async function incrementGlobalGuessCount(guessWord) {
  // Use upsert pattern to increment count or insert if not exists
  const result = await query(
    `
    INSERT INTO global_guesses (guess_word, count) 
    VALUES ($1, 1)
    ON CONFLICT (guess_word) 
    DO UPDATE SET count = global_guesses.count + 1, updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    [guessWord]
  );
  return result.rows[0];
}

export async function getGlobalGuessCount(guessWord) {
  const result = await query(
    'SELECT count FROM global_guesses WHERE guess_word = $1',
    [guessWord]
  );
  return result.rows.length > 0 ? result.rows[0].count : 0;
}