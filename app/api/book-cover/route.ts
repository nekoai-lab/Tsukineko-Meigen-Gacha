import { NextRequest, NextResponse } from "next/server";
import { getBookCover } from "@/lib/rakuten";

export const revalidate = 86400; // 24 hours (Next.js Cache)

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
        return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const { imageUrl, productUrl } = await getBookCover(keyword);
    console.log(`[Rakuten API] Keyword: "${keyword}" -> URL: ${imageUrl || "Not Found"}, Product: ${productUrl || "Not Found"}`);

    // Return default if not found (client side can also handle this, but API ensures URL)
    // For now return null or the default path if we had one relative.
    // The client expects a URL.

    return NextResponse.json({
        url: imageUrl || '/default-cover.png',
        productUrl: productUrl || null
    });
}
