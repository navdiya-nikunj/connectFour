import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connect Four - Farcaster Mini App",
  description: "Play Connect Four with your Farcaster friends! Classic gameplay with social features and tournaments.",
  keywords: "connect four, farcaster, game, multiplayer, social gaming",
  authors: [{ name: "Connect Four Team" }],
  viewport: "width=device-width, initial-scale=1",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://connectfour.miniapps.farcaster.xyz/logo.png",
      button: {
        title: "Connect Four",
        action: {
          url: "https://connectfour.miniapps.farcaster.xyz",
          method: "GET"
        }
      }
    }),
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://connectfour.miniapps.farcaster.xyz/logo.png",
      button: {
        title: "Connect Four",
        action: {
          url: "https://connectfour.miniapps.farcaster.xyz",
          method: "GET"
        }
      }
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
      </body>
    </html>
  );
}
