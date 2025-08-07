import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Connect Four - Farcaster Mini App",
  description: "Play Connect Four with your Farcaster friends! Classic gameplay with social features and tournaments.",
  keywords: "connect four, farcaster, game, multiplayer, social gaming",
  authors: [{ name: "Nikunj Navdiya" }],
  viewport: "width=device-width, initial-scale=1",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://connect-four-hazel.vercel.app/preview.png",
      button: {
        title: "Connect Four 🎮",
        action: {
          type: "launch_frame",
          name: "Connect Four",
          url: "https://connect-four-hazel.vercel.app",
          splashImageUrl: "https://connect-four-hazel.vercel.app/logo.png",
        }
      }
    }),
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://connect-four-hazel.vercel.app/preview.png",
      button: {
        title: "Connect Four 🎮",
        action: {
          type: "launch_frame",
          name: "Connect Four",
          url: "https://connect-four-hazel.vercel.app",
          splashImageUrl: "https://connect-four-hazel.vercel.app/logo.png",
        }
      },
      action: "launch"
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
