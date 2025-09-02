import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#152E92',
          backgroundImage: 'radial-gradient(94.6% 54.54% at 50% 50%, #35A5F7 0%, #152E92 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 48,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎯</div>
          <div>Bubble Shooter</div>
          <div style={{ fontSize: 24, marginTop: 10, opacity: 0.8 }}>
            Play & Earn Creator Coins
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
