import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    // Fallback for local development to prevent Satori/WASM crashes on Windows
    if (process.env.NODE_ENV === 'development') {
        return new Response(
            // We can return a redirect or fetch the default image. 
            // Since we are in edge/node, redirect is easiest if client follows it, 
            // but fetch blob might need direct bytes.
            // Let's plain redirect.
            null,
            {
                status: 307,
                headers: { Location: 'http://localhost:3000/default-cover.png' }
            }
        );
    }

    try {
        const { searchParams } = new URL(request.url);

        // Params
        const quote = searchParams.get('quote') || '名言がここに入ります';
        const character = searchParams.get('character') || 'キャラ名';
        const work = searchParams.get('work') || '作品名';
        const color = searchParams.get('color') || '#818CF8'; // Default indigo
        const font = searchParams.get('font') || 'mincho';

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
                        background: `linear-gradient(to bottom right, ${color}, #000000)`,
                        color: 'white',
                        fontFamily: font === 'mincho' ? 'serif' : 'sans-serif',
                        padding: '40px',
                        textAlign: 'center',
                    }}
                >
                    <div style={{
                        fontSize: 60,
                        fontWeight: 'bold',
                        marginBottom: 40,
                        textShadow: '0 4px 8px rgba(0,0,0,0.5)'
                    }}>
                        「{quote}」
                    </div>
                    <div style={{ fontSize: 30, opacity: 0.9 }}>
                        ── {character} / {work} ──
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.log(errorMessage);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
