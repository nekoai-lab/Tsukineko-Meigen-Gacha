import { EmotionAnalysis } from "@/types/quote";

interface EmotionAnalysisProps {
    emotions: EmotionAnalysis;
}

export default function EmotionAnalysisComponent({ emotions }: EmotionAnalysisProps) {
    // Helper to extract percentage for width
    const getPercent = (str: string) => {
        const match = str.match(/(\d+)%/);
        return match ? parseInt(match[1]) : 0;
    };

    const primary = getPercent(emotions.primary);
    const secondary = getPercent(emotions.secondary);
    const hidden = getPercent(emotions.hidden);

    return (
        <div className="w-full bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span> 感情分析レポート
            </h3>

            <div className="space-y-4">
                {/* Primary */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-700">{emotions.primary.split(' (')[0]}</span>
                        <span className="text-indigo-600 font-mono">{primary}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${primary}%` }}
                        />
                    </div>
                </div>

                {/* Secondary */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-700">{emotions.secondary.split(' (')[0]}</span>
                        <span className="text-purple-500 font-mono">{secondary}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out delay-100"
                            style={{ width: `${secondary}%` }}
                        />
                    </div>
                </div>

                {/* Hidden */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-700">{emotions.hidden.split(' (')[0]}</span>
                        <span className="text-pink-500 font-mono">{hidden}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-pink-500 rounded-full transition-all duration-1000 ease-out delay-200"
                            style={{ width: `${hidden}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
