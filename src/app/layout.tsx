import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "Dona Diarista | Sua Casa Impecável, sem esforço",
  description: "Marketplace que conecta Clientes a Diaristas verificadas. Segurança, confiança e qualidade em cada limpeza no interior de SP.",
  keywords: ["diarista", "limpeza", "casa", "serviços domésticos", "interior sp", "bauru"],
  authors: [{ name: "Gabriel Amaral", url: "https://instagram.com/sougabrielamaral" }],
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
