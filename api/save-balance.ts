
import { db } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, updates } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Identity required for cloud sync' });
  }

  const client = await db.connect();

  try {
    // Perform an Atomic Update on the user's financial state
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

    return res.status(200).json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      node: "ZA-CLUSTER-SYNC-01" 
    });
  } catch (error: any) {
    console.error("Cloud Sync Error:", error);
    return res.status(500).json({ error: 'Sync Failed', details: error.message });
  }
}
