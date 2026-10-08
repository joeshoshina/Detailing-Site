import { Layers, Play } from "lucide-react";

function PostCard({ post, onClick }) {
  // Carousels use their first slide as the cover
  const cover = post.children?.[0] ?? post;
  const isVideo = cover.media_type === "VIDEO";
  // Videos come with a still thumbnail; loading that is far lighter than the video
  const imageUrl = isVideo ? cover.thumbnail_url : cover.media_url;
  const hasMultiple = post.children?.length > 1;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open post: ${post.caption?.slice(0, 80) || "Instagram post"}`}
      className="group overflow-hidden rounded-sm shadow-lg transform transition-all duration-300 hover:scale-102 cursor-pointer relative aspect-square bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#053a57]"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300"
        />
      ) : (
        <video
          src={cover.media_url}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          playsInline
        />
      )}

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

      {/* Video / multi-image indicator */}
      {(isVideo || hasMultiple) && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-black/60 text-white px-1.5 py-1 rounded-md text-xs sm:text-sm font-medium">
          {hasMultiple ? (
            <>
              <Layers size={14} /> {post.children.length}
            </>
          ) : (
            <Play size={14} fill="currentColor" />
          )}
        </div>
      )}
    </button>
  );
}
export default PostCard;
