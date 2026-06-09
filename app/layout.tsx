import type { Metadata } from "next";
import {
  Space_Grotesk,
  Space_Mono,
  Playfair_Display,
  Archivo_Black,
  Anton,
  Spline_Sans,
} from "next/font/google";
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

// ── fontes da tela final (mundo visual próprio do resultado) ──
const archivo = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});
const spline = Spline_Sans({
  variable: "--font-spline",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${display.variable} ${mono.variable} ${serif.variable} ${archivo.variable} ${anton.variable} ${spline.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-preto text-claro">
        <CursorBall />
        {children}
        <Grain />
      </body>
    </html>
  );
}
