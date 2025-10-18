function PostCard({ post, onClick }) {
  const thumbnailUrl = post.children?.[0]?.media_url || post.media_url;
  const isVideo =
    post.children?.[0]?.media_type === "VIDEO" || post.media_type === "VIDEO";
  const hasMultiple = post.children && post.children.length > 1;

  return (
    <div
      onClick={onClick}
      className="group overflow-hidden rounded-sm shadow-lg transform transition-all duration-300 hover:scale-102 cursor-pointer relative aspect-square bg-gray-200"
    >
      {isVideo ? (
        <video
          src={thumbnailUrl}
          className="w-full h-full object-cover transition-transform duration-300"
          muted
          playsInline
        />
      ) : (
        <img
          src={thumbnailUrl}
          alt={post.caption || "Instagram post"}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      )}

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

      {/* Multi-image indicator */}
      {hasMultiple && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black bg-opacity-70 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium z-10">
          1/{post.children.length}
        </div>
      )}
    </div>
  );
}
export default PostCard;
