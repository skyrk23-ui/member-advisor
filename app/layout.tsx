import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'メンバー相談ボット',
  description: 'メンバーへの声の掛け方を相談できるアプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
