import type { Metadata } from "next";
import { Poppins, Lato } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/store/ReduxProvider";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Travel App",
  description: "Explore the world with our travel app",
  icons: {
    icon: "/app_icon.png",
    apple: "/app_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${lato.variable} antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
