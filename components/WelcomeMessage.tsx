'use client';

import React, { useEffect, useState } from 'react';

const WELCOME_MESSAGES = {
    morning: [
        "おはよう！ 今日という『第1話』を始めるための、元気な主題歌（OP）みたいな名言、どう？",
        "まだ眠い？ シャキッと目が覚めるような、衝撃のセリフを探してこようか。",
        "新しい朝だね。今日の君の『冒険』に役立つアイテム（言葉）、装備していかない？"
    ],
    daytime: [
        "お昼休みかな？ 午後の強敵（タスク）に負けないよう、強力なバフ（強化魔法）をかけに来たよ。",
        "ちょっとひと息。コーヒーのついでに、心に効くサプリメント（名言）もどう？",
        "1日はまだ長いね。だらけそうな空気を切り裂く、必殺技みたいな一言はいかが？"
    ],
    evening: [
        "一日お疲れさま！ 戦いを終えた戦士には、心安らぐ『エンディング曲』のような言葉が必要だね。",
        "今日あった嫌なこと、寝る前に全部ここに吐き出しちゃいなよ。僕が受け止めるからさ。",
        "おかえりなさい。現実（リアル）のログアウト、完了だね。とっておきの名言でHP回復しようか。",
        "ねぇ、今の気分はどう？ 話してくれたら、君にぴったりの言葉を探してくるね。"
    ],
    lateNight: [
        "こんな時間まで起きてるの？ 夜更かしな君には、深夜アニメのような少しディープな名言が効くかもね。",
        "眠れない夜かな？ 静かな夜にだけ響く、秘密の言葉を探しにいこうか。",
        "まだ起きてるんだね。大丈夫、僕も夜行性だよ。君にぴったりの言葉、ゆっくり探そう。"
    ]
};

export const WelcomeMessage = () => {
    const [message, setMessage] = useState<string>("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        let timeKey: keyof typeof WELCOME_MESSAGES = 'lateNight';

        if (hour >= 6 && hour < 11) {
            timeKey = 'morning';
        } else if (hour >= 11 && hour < 17) {
            timeKey = 'daytime';
        } else if (hour >= 17 && hour < 23) {
            timeKey = 'evening';
        }

        const messages = WELCOME_MESSAGES[timeKey];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];

        setMessage(randomMsg);
        setIsVisible(true);
    }, []);

    return (
        <div
            className={`
        relative p-5 w-full mx-auto
        bg-slate-50/90 backdrop-blur-sm 
        rounded-xl border border-slate-200 shadow-sm
        transition-all duration-1000 ease-out
        overflow-hidden
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
        >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-asanoha opacity-60 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                <p className="text-center text-slate-700 leading-relaxed font-serif text-sm tracking-wide">
                    {message || <span className="opacity-0">言葉を探しています...</span>}
                </p>

                {/* Subtle Gold Accent Line */}
                <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mt-3 opacity-50" />
            </div>
        </div>
    );
};
