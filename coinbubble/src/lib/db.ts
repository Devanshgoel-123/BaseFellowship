import { Pool } from 'pg';

// Create a new pool of connections
export const pool = new Pool({
  user: 'dtechguest',
  host: 'postgres.dtechvision.xyz',
  database: 'farcaster',
  password: '947241342ASSDSASDNNNK-DDAKSKa',
  port: 5432,
  ssl: {
    rejectUnauthorized: false // For development only, use proper SSL in production
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
  }
});

export default pool;
