"use client";

import { useState } from "react";
import { AlternativeQuote } from "@/types/quote";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface AlternativeQuotesProps {
    quotes: AlternativeQuote[];
}

export default function AlternativeQuotes({ quotes }: AlternativeQuotesProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!quotes || quotes.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
            >
                <div className="flex items-center gap-2 text-gray-600 font-bold">
                    <AlertCircle className="w-5 h-5" />
                    <span>AIが検討した他の名言（没案）</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {isOpen && (
                <div className="mt-2 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    {quotes.map((item, index) => (
                        <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <p className="font-bold text-gray-800 text-lg mb-1">
                                        「{item.quote}」
                                    </p>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {item.character} / {item.work}
                                    </p>
                                    <div className="flex items-start gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">
                                        <span className="font-bold whitespace-nowrap">🚫 没理由:</span>
                                        <span>{item.rejection_reason}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
