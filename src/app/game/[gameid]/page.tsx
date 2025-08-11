import { Metadata } from 'next';

type PageProps = {
  params: Promise<{
    gameid: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gameid } = await params;
  return {
    title: `Details for Game: ${gameid}`,
    description: `This page shows details for the Game route: ${gameid}.`,
    other: {
      "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: `https://connect-four-hazel.vercel.app/api/game/gameid?gameid=${gameid}`,
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
      imageUrl: `https://connect-four-hazel.vercel.app/api/game/gameid?gameid=${gameid}`,
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
    },
  };
}

export default async function GamePage({ params }: PageProps) {
  const { gameid } = await params;
  return (
    <main>
      <h1>FID Route Details</h1>
      <p>
        You are viewing details for Game: <strong>{gameid}</strong>
      </p>
    </main>
  );
}
