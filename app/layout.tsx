import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CursorBall } from "@/components/ui/cursor-ball";
import { Grain } from "@/components/ui/grain";

// fonte variável (eixo de peso contínuo) — usada no hover do HUMANWARE
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "HUMANWARE — o espelho",
  description:
    "Não é pesquisa de clima. É um espelho. Você olha, e a gente devolve o que viu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${mono.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-preto text-claro">
        <CursorBall />
        {children}
        <Grain />
      </body>
    </html>
  );
}
