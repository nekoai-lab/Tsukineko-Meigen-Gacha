import { QuoteResponse } from "@/types/quote";
import { BookOpen, Sparkles } from "lucide-react";

interface QuoteCardProps {
    data: QuoteResponse;
}

export default function QuoteCard({ data }: QuoteCardProps) {
    const {
        selected_quote,
        character_name,
        work_title,
        author,
        context,
        trivia,
        mood_color,
        design_font_style,
        book_cover_url,
        book_product_url
    } = data;

    // Font class mapping (assuming Next.js fonts or standard fonts are set up globally or mapped here)
    // For simplicity, using standard font families or Tailwind classes if we had them.
    // We will map 'mincho' to serif, etc.
    const fontClass = design_font_style === 'mincho' ? 'font-serif' :
        design_font_style === 'handwriting' ? 'font-mono' : 'font-sans';
    // Note: 'handwriting' usually needs a specific font import. 
    // Assuming global css handles specific font classes or we use generic for now.

    // Helper to ensure color contrast (darken if too light)
    const ensureReadableColor = (hex: string) => {
        // Remove hash if present
        hex = hex.replace('#', '');

        // Parse RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Calculate functionality luminance (simple perceptional brightness)
        // (R * 299 + G * 587 + B * 114) / 1000
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Threshold: 180 is roughly where white text becomes unreadable on background, 
        // but here we have colored text on white background.
        // We want text to be DARK. So if brightness > 150 (light), we darken it.
        const THRESHOLD = 130;

        if (brightness > THRESHOLD) {
            // Darken the color by reducing RGB values proportionally
            const factor = THRESHOLD / brightness;
            r = Math.floor(r * factor);
            g = Math.floor(g * factor);
            b = Math.floor(b * factor);

            // Reconstruct Hex
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        }
        return `#${hex}`;
    };

    const readableColor = ensureReadableColor(mood_color);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Main Quote Card */}
            <div
                className="relative overflow-hidden rounded-3xl shadow-xl bg-white text-gray-800"
                style={{ borderTop: `4px solid ${mood_color}` }}
            >
                <div className="p-8 md:p-10 text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        {book_cover_url ? (
                            book_product_url ? (
                                <a
                                    href={book_product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer transition-transform duration-300 hover:scale-105"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={book_cover_url}
                                        alt={work_title}
                                        className="w-32 h-auto shadow-md rounded-md transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                                    />
                                </a>
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={book_cover_url}
                                    alt={work_title}
                                    className="w-32 h-auto shadow-md rounded-md transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                                />
                            )
                        ) : (
                            <div className="w-24 h-32 bg-gray-200 rounded-md animate-pulse" />
                        )}
                    </div>

                    <h2
                        className={`text-2xl md:text-4xl font-bold leading-relaxed tracking-wide ${fontClass}`}
                        style={{ color: readableColor }}
                    >
                        「{selected_quote}」
                    </h2>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-lg font-bold text-gray-700">
                            {character_name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {work_title} / {author}
                        </p>
                    </div>
                </div>
            </div>

            {/* Context & Trivia */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg border border-indigo-50">
                    <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold">
                        <BookOpen className="w-5 h-5" />
                        <h3>このシーンについて</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {context}
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg border border-purple-50">
                    <div className="flex items-center gap-2 mb-3 text-purple-600 font-bold">
                        <Sparkles className="w-5 h-5" />
                        <h3>オタクのトリビア</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {trivia}
                    </p>
                </div>
            </div>

        </div>
    );
}
