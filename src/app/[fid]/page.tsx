import { Metadata } from 'next';

type PageProps = {
  params: {
    fid: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { fid } = params;
  return {
    title: `Details for FID: ${fid}`,
    description: `This page shows details for the FID route: ${fid}.`,
    other: {
      "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: `https://connect-four-hazel.vercel.app/api/streak/fid?fid=${fid}`,
      button: {
        title: "Connect Four 🎮",
        action: {
          type: "launch_frame",
          name: "Connect Four",
          url: "https://pzm0b0bg-3000.inc1.devtunnels.ms",
          splashImageUrl: "https://connect-four-hazel.vercel.app/logo.png",
        }
      }
    }),
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `https://connect-four-hazel.vercel.app/api/streak/fid?fid=${fid}`,
      button: {
        title: "Connect Four 🎮",
        action: {
          type: "launch_frame",
          name: "Connect Four",
          url: "https://pzm0b0bg-3000.inc1.devtunnels.ms",
          splashImageUrl: "https://connect-four-hazel.vercel.app/logo.png",
        }
      },
      action: "launch"
    })
    },
  };
}

export default function FidPage({ params }: PageProps) {
  const { fid } = params;
  return (
    <main>
      <h1>FID Route Details</h1>
      <p>
        You are viewing details for FID: <strong>{fid}</strong>
      </p>
    </main>
  );
}
