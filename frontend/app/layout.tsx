import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"], variable: "--font-nunito" });
export const metadata = { title: "Duolingo Clone" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={`${nunito.variable} font-sans`}><Providers>{children}</Providers></body></html>;
}
