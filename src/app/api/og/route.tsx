import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'JobNachbar'
    const subtitle = searchParams.get('subtitle') || 'Jobs in deiner Nähe'

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
            backgroundColor: '#1D1D1F',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              opacity: 0.05,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 20% 50%, #E63946 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E63946 0%, transparent 50%)',
              }}
            />
          </div>

          {/* Red accent bar - top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #E63946 0%, #FF4D5A 100%)',
            }}
          />

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '48px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #E63946 0%, #C62E3A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '24px',
                  boxShadow: '0 20px 40px rgba(230, 57, 70, 0.3)',
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 7H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H4C2.9 7 2 7.9 2 9V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5ZM20 20H4V9H20V20Z"
                    fill="white"
                  />
                  <circle cx="17" cy="14" r="2.5" fill="white" />
                </svg>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span
                  style={{
                    fontSize: '72px',
                    fontWeight: 800,
                    color: '#F8F8F8',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  JobNachbar
                </span>
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '52px',
                fontWeight: 700,
                color: '#F8F8F8',
                textAlign: 'center',
                maxWidth: '900px',
                lineHeight: 1.2,
                marginBottom: '24px',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '32px',
                fontWeight: 400,
                color: '#AEAEB2',
                textAlign: 'center',
                maxWidth: '800px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>

            {/* Location badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '48px',
                padding: '16px 32px',
                borderRadius: '12px',
                background: 'rgba(230, 57, 70, 0.15)',
                border: '2px solid rgba(230, 57, 70, 0.3)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: '12px' }}
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                  fill="#E63946"
                />
              </svg>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#E63946',
                }}
              >
                Zeven & Landkreis Rotenburg
              </span>
            </div>
          </div>

          {/* Red accent bar - bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #E63946 0%, #FF4D5A 100%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
