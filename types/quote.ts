export interface EmotionAnalysis {
  primary: string;   // "落ち込み (65%)"
  secondary: string; // "焦り (25%)"
  hidden: string;    // "自己嫌悪 (10%)"
}

export interface AlternativeQuote {
  quote: string;
  character: string;
  work: string;
  rejection_reason: string;
}

export interface ThinkingProcess {
  detected_emotions: EmotionAnalysis;
  alternative_quotes: AlternativeQuote[];
  selection_reasoning: string;
}

export interface QuoteResponse {
  selected_quote: string;
  character_name: string;
  work_title: string;
  author: string;
  context: string;
  trivia: string;
  search_keyword: string;
  mood_color: string; // HEX color
  design_font_style: 'mincho' | 'gothic' | 'handwriting';
  thinking_process: ThinkingProcess;
  book_cover_url?: string;
  book_product_url?: string;
}

export interface ApiError {
  error: string;
  code: 'RATE_LIMIT' | 'INVALID_INPUT' | 'AI_ERROR' | 'BOOK_NOT_FOUND';
}
