import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./app.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-source",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fido — Private onchain payroll & AI agents",
  description:
    "Pay your team, automate business operations, and manage everything from one intelligent workspace — powered by private AI and NEAR Intents.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
