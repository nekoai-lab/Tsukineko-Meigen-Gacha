"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface EmotionFormProps {
    onSubmit: (emotion: string) => void;
    isLoading: boolean;
}

const PLACEHOLDERS = [
    "明日が月曜日だという事実を、まだ受け入れられない...",
    "推しのガチャが爆死して、世界を呪いたい...",
    "誰かに「よくやった」って頭を撫でてほしい...",
    "異世界転生して、スローライフを送りたい..."
];

export default function EmotionForm({ onSubmit, isLoading }: EmotionFormProps) {
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);

    useEffect(() => {
        // Randomly select a placeholder on client mount to avoid hydration mismatch
        const random = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
        setPlaceholder(random);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.length < 10) {
            setError("10文字以上入力してください");
            return;
        }
        if (text.length > 200) {
            setError("200文字以下にしてください");
            return;
        }
        setError("");
        onSubmit(text);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <textarea
                        className="w-full h-32 p-4 rounded-xl border-2 border-indigo-100 focus:border-indigo-400 focus:ring-0 resize-none transition-all shadow-sm text-gray-800 placeholder-gray-400 bg-white/80 backdrop-blur"
                        placeholder={placeholder}
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            if (error) setError("");
                        }}
                        disabled={isLoading}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {text.length}/200
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm animate-pulse">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading || text.length < 10}
                    className={`
            w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-95
            flex items-center justify-center gap-2
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-indigo-500/25'}
          `}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            名言を探しています...
                        </>
                    ) : (
                        <>
                            ✨ 言葉を受け取る
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
