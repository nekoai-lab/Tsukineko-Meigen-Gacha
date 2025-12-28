interface RakutenBookItem {
    Item: {
        largeImageUrl: string;
        title: string;
        author: string;
        itemUrl: string; // Add itemUrl
    };
}

interface RakutenResponse {
    Items: RakutenBookItem[];
}

const RAKUTEN_API_URL = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';

export async function getBookCover(keyword: string): Promise<{ imageUrl: string | null, productUrl: string | null }> {
    const applicationId = process.env.RAKUTEN_APPLICATION_ID;

    if (!applicationId) {
        console.warn("RAKUTEN_APPLICATION_ID is not set");
        return { imageUrl: null, productUrl: null };
    }

    try {
        const params = new URLSearchParams({
            applicationId,
            title: keyword,
            hits: '1',
            outOfStockFlag: '1'
        });

        const response = await fetch(`${RAKUTEN_API_URL}?${params}`);

        if (!response.ok) {
            console.error("Rakuten API Error:", response.statusText);
            return { imageUrl: null, productUrl: null };
        }

        const data: RakutenResponse = await response.json();
        const item = data.Items?.[0]?.Item;

        return {
            imageUrl: item?.largeImageUrl || null,
            productUrl: item?.itemUrl || null
        };

    } catch (error) {
        console.error("Failed to fetch book cover:", error);
        return { imageUrl: null, productUrl: null };
    }
}
