import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { QuoteResponse } from "@/types/quote";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: "Server Configuration Error: GEMINI_API_KEY is missing."
      }, { status: 500 });
    }

    const { emotion } = await req.json();

    if (!emotion || typeof emotion !== "string") {
      return NextResponse.json({ error: "Emotion text is required" }, { status: 400 });
    }

    if (emotion.length < 2 || emotion.length > 200) { // relaxed lower bound
      return NextResponse.json({ error: "Text length must be between 2 and 200 characters" }, { status: 400 });
    }

    // Basic Safety Check (Keyword based - simplistic)
    const badWords = ['死ね', '殺す'];
    if (badWords.some(w => emotion.includes(w))) {
      return NextResponse.json({ error: "優しい言葉で入力してください" }, { status: 400 });
    }

    const prompt = `
あなたは、日本のアニメ・漫画に精通した「伝説のオタク」であり、
かつユーザーの心を癒やす「心理カウンセラー」です。

ユーザーから「現在の感情や悩み」が入力されます。
その感情に寄り添い、あるいは笑い飛ばせるような
「アニメ・漫画の名言」を一つ選び、以下のJSON形式で出力してください。

**選定の基準:**
1. 意外性: 超有名作品だけでなく、マニアックな作品も混ぜる
2. トリビア: ファンしか知らない裏話を必ず含める
3. 検索性: 書影取得用の正確なキーワードを含める

**ユーザーの感情:**
${emotion}

**出力フォーマット（JSONのみ）:**
{
  "selected_quote": "名言のテキスト（正確に）",
  "character_name": "キャラクター名",
  "work_title": "作品名",
  "author": "原作者名",
  "context": "セリフが言われた状況（50文字以内）",
  "trivia": "マニアックなトリビア（100文字以内）",
  "search_keyword": "書影検索用の正式な作品名（日本語）。巻数は含めず、作品名のみとする。(例: 進撃の巨人)",
  "mood_color": "#HEXCODE",
  "design_font_style": "mincho | gothic | handwriting",
  
  "thinking_process": {
    "detected_emotions": {
      "primary": "主要感情 (XX%)",
      "secondary": "副次的感情 (XX%)",
      "hidden": "隠れた感情 (XX%)"
    },
    "alternative_quotes": [
      {
        "quote": "没案1",
        "character": "キャラ",
        "work": "作品",
        "rejection_reason": "理由（30文字以内）"
      }
    ],
    "selection_reasoning": "選定理由（100文字以内）"
  }
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let data: QuoteResponse;
    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      data = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON Parse Error", e);
      // Retry logic could go here, but for now error out or return text
      return NextResponse.json({ error: "AI response parsing failed" }, { status: 500 });
    }

    console.log("Gemini Output:", data);

    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json({
      error: `API Request Failed: ${errorMessage}`
    }, { status: 500 });
  }
}

