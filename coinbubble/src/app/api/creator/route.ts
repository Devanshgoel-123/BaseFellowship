import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { creatorAddress, tokenAddress } = await request.json();
    
    // Validate input
    if (!creatorAddress || !tokenAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert creator into database
    const query = `
      INSERT INTO creators (address, token_address, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (address) 
      DO UPDATE SET token_address = EXCLUDED.token_address
      RETURNING *;
    `;

    const result = await pool.query(query, [creatorAddress, tokenAddress]);
    
    // Redirect to Zora with the creator's token address
    const zoraUrl = `https://zora.co/collect/zora:${tokenAddress}`;
    
    return NextResponse.json({ 
      success: true, 
      redirectUrl: zoraUrl 
    });

  } catch (error) {
    console.error('Error in creator registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
