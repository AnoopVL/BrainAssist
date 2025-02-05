import { ShareIcon } from "../../icons/ShareIcon";

interface CardProps {
  title: string; // Title of the card, e.g., video or tweet title
  link: string; // Link to the content (YouTube or Twitter)
  type: "twitter" | "youtube"; // Type of the content
}

// The Card component represents a styled card that can display either a YouTube video or a Twitter embed based on the type prop.
export function Card({ title, link, type }: CardProps) {
  // const getYouTubeEmbedUrl = (url: string) => {
  //   const videoId = new URL(url).searchParams.get("v");
  //   return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  // };
  return (
    <div>
      {/* Card Container */}
      <div className="p-4 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72">
        {/* Header Section */}
        <div className="flex justify-between">
          {/* Left Section: Title with Icon */}
          <div className="flex items-center text-md">{title}</div>
          {/* Right Section: Links with Icons */}
          <div className="flex items-center">
            <div className="pr-2 text-gray-500">
              {/* Clickable Share Icon that opens the link */}
              <a href={link} target="_blank">
                <ShareIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-4">
          {type === "youtube" && (
            <iframe
              className="w-full"
              src={(() => {
                let videoId = "";
                if (link.includes("youtu.be/")) {
                  // Extract video ID from short URL
                  videoId = link.split("youtu.be/")[1]?.split(/[?&]/)[0];
                } else if (link.includes("watch?v=")) {
                  // Extract video ID from standard YouTube URL
                  videoId = link.split("watch?v=")[1]?.split("&")[0];
                }
                return `https://www.youtube.com/embed/${videoId}`;
              })()}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen></iframe>
          )}

          {/* Render Twitter embed if type is "twitter" */}
          {type === "twitter" && (
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
