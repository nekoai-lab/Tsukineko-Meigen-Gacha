"use client";

import { QuoteResponse } from "@/types/quote";
import { Download, Share2, RefreshCw } from "lucide-react";

interface ShareButtonProps {
    data: QuoteResponse;
    onReset: () => void;
}

export default function ShareButton({ data, onReset }: ShareButtonProps) {
    const handleDownload = async () => {
        // Drawing logic extracted to a helper function to allow retries
        const generateCanvas = async (skipExternalImages: boolean): Promise<string> => {
            return new Promise(async (resolve, reject) => {
                try {
                    const canvas = document.createElement('canvas');
                    const width = 1200;
                    const height = 1200; // Changed to square for more vertical space
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        reject(new Error('Canvas context not supported'));
                        return;
                    }

                    // --- DRAWING START ---

                    // 2. Draw Background (Gradient)
                    const gradient = ctx.createLinearGradient(0, 0, width, height);
                    gradient.addColorStop(0, data.mood_color);
                    gradient.addColorStop(1, '#000000');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, width, height);

                    // 3. Draw White Card
                    const cardMargin = 80; // More ample margin for elegance
                    const cardX = cardMargin;
                    const cardY = cardMargin;
                    const cardWidth = width - cardMargin * 2;
                    const cardHeight = height - cardMargin * 2;
                    const cardRadius = 30; // Softer corners

                    ctx.save();
                    ctx.fillStyle = '#fcfaf2';
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                    ctx.shadowBlur = 20;
                    ctx.shadowOffsetY = 10;

                    ctx.beginPath();
                    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
                    ctx.fill();
                    ctx.restore();

                    // Inner Border
                    ctx.save();
                    ctx.strokeStyle = '#d4af37';
                    ctx.lineWidth = 3;
                    const borderMargin = 20;
                    ctx.beginPath();
                    ctx.roundRect(cardX + borderMargin, cardY + borderMargin, cardWidth - borderMargin * 2, cardHeight - borderMargin * 2, cardRadius - 10);
                    ctx.stroke();
                    ctx.restore();

                    // 4. Setup Font - Prioritize safe, beautiful serif
                    // "Zen Kurenaido" might be too thin or casual. Let's try Noto Serif JP Bold for impact.
                    const mainFont = `bold 72px "Noto Serif JP", "Zen Kurenaido", serif`;
                    const titleFont = `bold 32px "Noto Serif JP", serif`;
                    const metaFont = `32px "Noto Sans JP", sans-serif`;

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // 5. Mascot & Branding (Header)
                    const headerY = cardY + 100; // More top space
                    const mascotSize = 100; // Larger mascot
                    ctx.font = titleFont;
                    const titleText = "月ねこ名言帖";
                    const titleMetrics = ctx.measureText(titleText);
                    const titleWidth = titleMetrics.width;
                    const headerGap = 25;

                    // Total width center alignment
                    const totalHeaderWidth = titleWidth + headerGap + mascotSize;
                    const headerStartX = (width - totalHeaderWidth) / 2;

                    // Draw Title
                    ctx.fillStyle = '#8e7f70';
                    ctx.textAlign = 'left';
                    ctx.fillText(titleText, headerStartX, headerY);

                    // Draw Mascot
                    // Local image from public folder - no crossOrigin needed usually,
                    // but if it fails, try-catch handles it.
                    try {
                        const mascotImg = new Image();
                        // We'll try loading it.
                        await new Promise<void>((res) => {
                            mascotImg.onload = () => res();
                            mascotImg.onerror = () => res();
                            mascotImg.src = '/mascot.jpg';
                        });

                        if (mascotImg.complete && mascotImg.naturalWidth !== 0) {
                            const mascotX = headerStartX + titleWidth + headerGap;
                            const mascotY = headerY - mascotSize / 2;

                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(mascotX + mascotSize / 2, mascotY + mascotSize / 2, mascotSize / 2, 0, Math.PI * 2);
                            ctx.closePath();
                            ctx.clip();
                            ctx.drawImage(mascotImg, mascotX, mascotY, mascotSize, mascotSize);
                            ctx.restore();

                            // Gold Ring
                            ctx.save();
                            ctx.strokeStyle = '#d4af37';
                            ctx.lineWidth = 4;
                            ctx.beginPath();
                            ctx.arc(mascotX + mascotSize / 2, mascotY + mascotSize / 2, mascotSize / 2, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.restore();
                        }
                    } catch (e) { console.warn("Mascot draw error", e); }

                    // Reset text align
                    ctx.textAlign = 'center';

                    // 6. Layout Content Calculation
                    let currentY = headerY + 180;

                    // Quote
                    ctx.fillStyle = '#374151';
                    ctx.font = mainFont;

                    // Fix double quotes: trim existing ones before adding
                    let rawQuote = data.selected_quote || '';
                    rawQuote = rawQuote.replace(/^「/, '').replace(/」$/, ''); // Remove outer brackets if present
                    rawQuote = rawQuote.replace(/^『/, '').replace(/』$/, ''); // Also remove fancy brackets if outer
                    const quoteText = `「${rawQuote}」`;

                    const maxQuoteWidth = 900; // Ensure padding

                    // Measure words
                    const quoteWords = quoteText ? quoteText.split('') : [];
                    let quoteLine = '';
                    let quoteLines = [];
                    for (let i = 0; i < quoteWords.length; i++) {
                        const testLine = quoteLine + quoteWords[i];
                        if (ctx.measureText(testLine).width > maxQuoteWidth && i > 0) {
                            quoteLines.push(quoteLine);
                            quoteLine = quoteWords[i];
                        } else {
                            quoteLine = testLine;
                        }
                    }
                    quoteLines.push(quoteLine);

                    const quoteLineHeight = 100; // More breathing room
                    quoteLines.forEach((l, i) => {
                        ctx.fillText(l, width / 2, currentY + (i * quoteLineHeight));
                    });
                    currentY += (quoteLines.length * quoteLineHeight) + 60;

                    // Character / Work
                    ctx.fillStyle = '#1F2937';
                    ctx.font = `bold 40px "Noto Serif JP", serif`;
                    ctx.fillText(data.character_name || '', width / 2, currentY);
                    currentY += 55;

                    ctx.fillStyle = '#6B7280';
                    ctx.font = metaFont;
                    ctx.fillText(`${data.work_title || ''} / ${data.author || '不明'}`, width / 2, currentY);
                    currentY += 80;

                    // Details Section (Context & Trivia)
                    const detailLabelFont = `bold 24px "Noto Sans JP", sans-serif`;
                    const detailBodyFont = `24px "Noto Sans JP", sans-serif`;
                    const detailLineHeight = 40;
                    const maxDetailWidth = 850;

                    const drawDetailBlock = (label: string, content: string) => {
                        if (!content) return;

                        // Divider
                        ctx.beginPath();
                        ctx.moveTo(width / 2 - 150, currentY);
                        ctx.lineTo(width / 2 + 150, currentY);
                        ctx.strokeStyle = '#e5e7eb';
                        ctx.stroke();
                        currentY += 40;

                        // Label
                        ctx.fillStyle = '#d4af37';
                        ctx.font = detailLabelFont;
                        ctx.fillText(`◆ ${label}`, width / 2, currentY);
                        currentY += 40;

                        // Content
                        ctx.fillStyle = '#4b5563';
                        ctx.font = detailBodyFont;

                        const words = content.split('');
                        let line = '';
                        // Since text align is center, we draw line by line
                        for (let i = 0; i < words.length; i++) {
                            const testLine = line + words[i];
                            if (ctx.measureText(testLine).width > maxDetailWidth && i > 0) {
                                ctx.fillText(line, width / 2, currentY);
                                line = words[i];
                                currentY += detailLineHeight;
                            } else {
                                line = testLine;
                            }
                        }
                        ctx.fillText(line, width / 2, currentY);
                        currentY += detailLineHeight + 20;
                    };

                    if (data.context && typeof data.context === 'string') drawDetailBlock("このシーンについて", data.context);
                    if (data.trivia && typeof data.trivia === 'string') drawDetailBlock("オタクのトリビア", data.trivia);

                    // --- DRAWING END ---

                    // Try to export immediately to catch Tainted Canvas errors
                    try {
                        const dataUrl = canvas.toDataURL('image/png');
                        resolve(dataUrl);
                    } catch (e) {
                        reject(e); // Pass error up to handle retry
                    }

                } catch (e) {
                    reject(e);
                }
            });
        };

        // Execution Logic
        try {
            console.log("Attempting to generate canvas (Standard Mode)...");
            const dataUrl = await generateCanvas(false); // Try with everything

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `mooncat-quote-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (e: any) {
            console.warn("Standard generation failed, retrying in Safe Mode (skipping external images)...", e);

            // Check if it's likely a security/taint error
            const isSecurityError = e.name === 'SecurityError' || e.message?.includes('tainted') || e.message?.includes('insecure');

            if (isSecurityError || true) { // Always retry for now if first fail
                try {
                    const safeDataUrl = await generateCanvas(true); // Retry skipping external images

                    const link = document.createElement('a');
                    link.href = safeDataUrl;
                    link.download = `mooncat-quote-semioffline-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    alert("一部の画像（書影など）がセキュリティ制限により保存できなかったため、簡易版を保存しました。");
                } catch (retryError) {
                    console.error("Safe Mode generation also failed:", retryError);
                    alert("画像の保存に完全に失敗しました。ブラウザの設定やネットワーク環境をご確認ください。");
                }
            } else {
                alert("予期せぬエラーで画像を保存できませんでした。");
            }
        }
    };

    // Updated Share Text
    const shareText = `月ねこ名言帖に聞いてみました🐱\n受け取った言葉はこちら✨\n💎「${data.selected_quote}」\n── ${data.character_name} / ${data.work_title}\n\nあなたもやってみる？\nnoteリンクはこちら`;
    const shareUrl = "https://note.com/nekoai_lab";

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
