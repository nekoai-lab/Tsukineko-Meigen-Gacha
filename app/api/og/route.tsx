import { ImageResponse } from 'next/og';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        await writeFile(join(process.cwd(), 'debug_minimal_start.txt'), 'Start Minimal');

        return new ImageResponse(
            (
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'red',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}>
                    Test
                </div>
            ),
            {
                width: 100,
                height: 100,
            }
        );
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        await writeFile(join(process.cwd(), 'debug_minimal_error.txt'), `Error: ${errorMessage}`);
        return new Response(`Error: ${errorMessage}`, { status: 500 });
    }
}
