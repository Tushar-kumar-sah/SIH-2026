import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "CropShield IQ — AI-Powered Crop Disease & Pest Management | SIH 2026",
  description:
    "Early detection and management of crop diseases and pest infestations using computer vision, micro-climate predictive modeling, and integrated pest management. SIH 2026 Finalist — Team CodeNova (STCET-17).",
  keywords: ["crop disease", "pest management", "AI agriculture", "SIH 2026", "YOLOv8", "IPM"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-deep antialiased">
        {children}
      </body>
    </html>
  );
}
