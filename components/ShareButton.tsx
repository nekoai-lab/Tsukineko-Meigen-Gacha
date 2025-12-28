"use client";

import { QuoteResponse } from "@/types/quote";
import { Download, Share2, RefreshCw } from "lucide-react";

interface ShareButtonProps {
    data: QuoteResponse;
    onReset: () => void;
}

export default function ShareButton({ data, onReset }: ShareButtonProps) {
    const handleDownload = async () => {
        try {
            // Build OG URL
            const params = new URLSearchParams({
                quote: data.selected_quote,
                character: data.character_name,
                work: data.work_title,
                color: data.mood_color,
                font: data.design_font_style
            });

            const url = `/api/og?${params.toString()}`;

            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `mooncat-quote-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

        } catch (e) {
            console.error("Download failed", e);
            alert("画像のダウンロードに失敗しました");
        }
    };

    const shareText = `「${data.selected_quote}」\n#月ねこ名言 #TsukinekoAI`;
    const shareUrl = "https://anime-quote-app.vercel.app"; // Placeholder until deployed

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-2xl mx-auto px-4">
            <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[var(--color-indigo-deep)] hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap border border-white/10"
            >
                <Download className="w-5 h-5" />
                画像を保存
            </button>

            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a91da] text-white rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
                <Share2 className="w-5 h-5" />
                Xでシェア
            </a>

            <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-white border border-[var(--color-gold)] text-[var(--color-indigo-deep)] hover:bg-[var(--color-gold-light)]/20 rounded-xl font-bold transition-all active:scale-95 shadow-sm whitespace-nowrap"
            >
                <RefreshCw className="w-5 h-5" />
                もう一度
            </button>
        </div>
    );
}
