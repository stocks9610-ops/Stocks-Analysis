
import { db } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  const { method } = req;
  
  // Initialize Database Connection
  const client = await db.connect();

  // Neural Firewall & Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  try {
    // 1. AUTO-SCHEMA PROTOCOL
    // This ensures your database always has the correct "Users" structure.
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50),
        password VARCHAR(255),
        balance DECIMAL(15, 2) DEFAULT 1000.00,
        has_deposited BOOLEAN DEFAULT FALSE,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        total_invested DECIMAL(15, 2) DEFAULT 0.00,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (method === 'POST') {
      const { action, payload } = req.body;

      // REGISTRATION LOGIC
      if (action === 'register') {
        const { username, email, phone, password } = payload;
        try {
          const result = await client.sql`
            INSERT INTO users (username, email, phone, password)
            VALUES (${username}, ${email.toLowerCase()}, ${phone}, ${password})
            RETURNING *;
          `;
          const user = result.rows[0];
          return res.status(200).json({ 
            success: true, 
            user: formatUser(user) 
          });
        } catch (e: any) {
          if (e.code === '23505') return res.status(400).json({ success: false, error: "Identity already indexed." });
          throw e;
        }
      }

      // LOGIN LOGIC
      if (action === 'login') {
        const { email, password } = payload;
        const result = await client.sql`
          SELECT * FROM users WHERE email = ${email.toLowerCase()} AND password = ${password};
        `;
        if (result.rows.length > 0) {
          return res.status(200).json({ success: true, user: formatUser(result.rows[0]) });
        }
        return res.status(401).json({ success: false, error: "Access Denied." });
      }

      // SYNC LOGIC (SAVE BALANCE & PROGRESS)
      if (action === 'sync') {
        const { email, updates } = payload;
        if (!email) return res.status(400).json({ error: "Missing identity" });

        // Update the database with the latest frontend state
        await client.sql`
          UPDATE users 
          SET 
            balance = COALESCE(${updates.balance}, balance),
            has_deposited = COALESCE(${updates.hasDeposited}, has_deposited),
            wins = COALESCE(${updates.wins}, wins),
            losses = COALESCE(${updates.losses}, losses),
            total_invested = COALESCE(${updates.totalInvested}, total_invested)
          WHERE email = ${email.toLowerCase()};
        `;
        
        return res.status(200).json({ success: true, message: "Cloud Node Synchronized" });
      }
    }

    return res.status(405).json({ error: 'Protocol not supported' });
  } catch (error: any) {
    console.error("Critical Backend Failure:", error);
    return res.status(500).json({ error: 'Neural Backend Exception', details: error.message });
  }
}

// Helper to format DB response for the Frontend
function formatUser(user: any) {
  return {
    username: user.username,
    email: user.email,
    phone: user.phone,
    balance: Number(user.balance),
    hasDeposited: user.has_deposited,
    wins: user.wins,
    losses: user.losses,
    totalInvested: Number(user.total_invested),
    joinDate: user.join_date
  };
}
