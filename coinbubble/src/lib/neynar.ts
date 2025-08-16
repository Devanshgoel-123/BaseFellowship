// This file contains server-side only code and should not be imported in client components
'use server';

import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

let neynarClient: NeynarAPIClient | null = null;

// Server-side only function to get Neynar client
export function getNeynarClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Neynar client can only be used server-side');
  }
  
  if (!neynarClient) {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      throw new Error('NEYNAR_API_KEY environment variable is not set');
    }
    const config = new Configuration({ apiKey });
    neynarClient = new NeynarAPIClient(config);
  }
  return neynarClient;
}

// Define a simple user type that can be used on the client
export interface NeynarUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  signerUuid: string;
}

export async function getNeynarUser(fid: number): Promise<NeynarUser | null> {
  const client = getNeynarClient();
  try {
    const result = await client.fetchBulkUsers({ fids: [fid] });
    const user = result.users[0];
    if (!user) return null;
    
    return {
      fid: user.fid,
      username: user.username || '',
      displayName: user.display_name || '',
      pfpUrl: user.pfp_url || '',
      signerUuid: process.env.NEYNAR_SIGNER_UUID || ''
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

type SendMiniAppNotificationResult =
  | { state: 'error', error: unknown }
  | { state: 'no_token' }
  | { state: 'rate_limit' }
  | { state: 'success' };

export async function sendNeynarMiniAppNotification({
  fid,
  title,
  body,
}: {
  fid: number;
  title: string;
  body: string;
}): Promise<SendMiniAppNotificationResult> {
  const client = getNeynarClient();
  try {
    const result = await client.fetchBulkUsers({ fids: [fid] });
    const user = result.users[0];
    if (!user?.verified_addresses?.eth_addresses?.[0]) {
      return { state: 'no_token' };
    }

    await client.publishCast({
      signerUuid: process.env.NEYNAR_SIGNER_UUID!,
      text: `${title}: ${body}`,
      embeds: [
        {
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://bubble-shooter.vercel.app',
        },
      ],
    });

    return { state: 'success' };
  } catch (error: any) {
    if (error?.response?.status === 429) {
      return { state: 'rate_limit' };
    }
    console.error('Error sending notification:', error);
    return { state: 'error', error };
  }
}

export async function publishCast(signerUuid: string, text: string) {
  const client = getNeynarClient();
  return client.publishCast({ signerUuid, text });
}