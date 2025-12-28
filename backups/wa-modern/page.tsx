"use client";

import { useState } from "react";
import { QuoteResponse } from "@/types/quote";
import EmotionForm from "@/components/EmotionForm";
import QuoteCard from "@/components/QuoteCard";
import EmotionAnalysisComponent from "@/components/EmotionAnalysis";
import AlternativeQuotes from "@/components/AlternativeQuotes";
import ShareButton from "@/components/ShareButton";
import { Moon } from "lucide-react";

export default function Home() {
  const [quoteData, setQuoteData] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async (emotion: string) => {
    setLoading(true);
    setQuoteData(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) throw new Error(errorJson.error);
        } catch {
          throw new Error(`API Error (${res.status}): ${res.statusText}`);
        }
      }

      const data = await res.json();

      if (data.error) {
        alert(data.error); // Simple error handling for now
      } else {
        // Fetch book cover if needed, handled by QuoteCard via proxy or direct?
        // Actually the API returns search_keyword, logic says we fetch book cover.
        // Wait, the PLAN said "3. Book Cover API... Flow: ... 2B. Client uses /api/book-cover".
        // BUT `QuoteResponse` has `book_cover_url`.
        // If the AI didn't provide it (it doesn't scrape), we need to fetch it.
        // I'll fetch it here and update the data.

        let coverUrl = null;
        if (data.search_keyword) {
          try {
            const coverRes = await fetch(`/api/book-cover?keyword=${encodeURIComponent(data.search_keyword)}`);
            const coverJson = await coverRes.json();
            coverUrl = coverJson.url;
          } catch (e) {
            console.error("Cover fetch failed", e);
          }
        }

        setQuoteData({
          ...data,
          book_cover_url: coverUrl || data.book_cover_url // prioritize fetched cover
        });
      }
    } catch (e) {
      console.error(e);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuoteData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden font-sans pb-20">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 -z-10 rounded-b-[3rem]" />

      {/* Header */}
      {/* Header with Mascot */}
      <header className="pt-8 pb-6 text-center px-4 relative z-10">
        <div className="flex flex-col items-center justify-center gap-4 mb-4 animate-in fade-in slide-in-from-top duration-700">
          {/* Mascot Image */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
            <img
              src="/mascot.jpg"
              alt="Moon Cat Mascot"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-moon fill-moon" />
            <span className="text-3xl font-extrabold tracking-widest text-[#1a202c] drop-shadow-sm font-serif">
              月ねこアニメ名言
            </span>
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium tracking-wide">
          気の利いたことは言えませんが、最高のアニメなら知っています。
        </p>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 z-10 relative max-w-lg">
        {!quoteData ? (
          <div className="animate-in fade-in zoom-in duration-500">
            {/* Speech Bubble Context */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-t border-l border-slate-100 transform rotate-45"></div>
              <p className="text-center text-slate-600 leading-relaxed font-serif">
                「ねぇ、今の気分はどう？<br />
                話してくれたら、君にぴったりの言葉を探してくるね。」
              </p>
            </div>

            <EmotionForm onSubmit={fetchQuote} isLoading={loading} />

            <div className="mt-12 text-center text-slate-400 text-xs tracking-wider">
              <p>Powered by Gemini AI</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <QuoteCard data={quoteData} />

            <div className="max-w-2xl mx-auto space-y-6">
              {quoteData.thinking_process && (
                <EmotionAnalysisComponent emotions={quoteData.thinking_process.detected_emotions} />
              )}

              {quoteData.thinking_process && (
                <AlternativeQuotes quotes={quoteData.thinking_process.alternative_quotes} />
              )}

              <ShareButton data={quoteData} onReset={handleReset} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
