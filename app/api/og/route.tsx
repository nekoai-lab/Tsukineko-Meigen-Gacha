import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Params
        const quote = searchParams.get('quote') || '名言がここに入ります';
        const character = searchParams.get('character') || 'キャラ名';
        const work = searchParams.get('work') || '作品名';
        const color = searchParams.get('color') || '#818CF8'; // Default indigo
        const font = searchParams.get('font') || 'mincho';

        // Load Font (Zen Kurenaido)
        // Using GitHub raw URL for the font file. 
        // Note: Using a specific Google Fonts API URL is also common, but raw file is more direct for arrayBuffer.
        const fontData = await fetch(
            new URL('https://github.com/googlefonts/zen-kurenaido/raw/main/fonts/ttf/ZenKurenaido-Regular.ttf', import.meta.url)
        ).then((res) => res.arrayBuffer());

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
                        // fontFamily: '"Zen Kurenaido"', // Satori uses the name provided in fonts config
                        padding: '40px',
                        textAlign: 'center',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                    }}>
                        <div style={{
                            fontSize: 60,
                            marginBottom: 40,
                            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                            padding: '0 40px',
                            lineHeight: 1.4,
                        }}>
                            「{quote}」
                        </div>
                        <div style={{ fontSize: 30, opacity: 0.9 }}>
                            ── {character} / {work} ──
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Zen Kurenaido',
                        data: fontData,
                        style: 'normal',
                    },
                ],
            },
        );
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("OG Image Generation Error:", errorMessage);
        return new Response(`Failed to generate the image: ${errorMessage}`, {
            status: 500,
        });
    }
}
