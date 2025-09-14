import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeMaster - AI-Powered Learning Platform",
  description: "Interactive coding challenges, AI-powered quizzes, and real-time code execution. Build your programming skills with personalized learning paths.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
