import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP, Zen_Kurenaido } from "next/font/google"; // Import standard Google Fonts
import "./globals.css";

// Configure fonts
const notoSerif = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const notoSans = Noto_Sans_JP({
  weight: ['400', '500', '700'], // Added 500
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const zenKurenaido = Zen_Kurenaido({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
});

// Configure Metadata
export const metadata: Metadata = {
  title: "月ねこ名言帖 | あなたに寄り添う物語の言葉",
  description: "今の気持ちを入力するだけで、月ねこAIがあなたに最適なアニメ・漫画の名言を処方します。",
  openGraph: {
    title: "月ねこ名言帖",
    description: "月ねこAIがあなたの心に寄り添う名言を選びます",
    siteName: "月ねこ名言帖",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "月ねこ名言帖",
    description: "今の気持ちを入力して、名言を受け取ろう。",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSerif.variable} ${notoSans.variable} ${zenKurenaido.variable}`}>
      <body className="antialiased text-gray-800 bg-background font-sans" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
