import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Instagram } from "lucide-react";

function PostModal({ post, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const media = post.children || [
    { media_url: post.media_url, media_type: post.media_type },
  ];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

  const currentMedia = media[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-2 sm:p-4"
      onClick={onClose}
      style={{ animation: "fadeIn 0.25s ease-out" }}
    >
      <div
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.3s ease-out" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 text-white rounded-full p-1.5 sm:p-2 hover:bg-black/70 transition-all"
          aria-label="Close modal"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Media section */}
        <div className="relative flex-1 flex items-center justify-center bg-[#f2f2f2] lg:max-w-[60%] min-h-[50vh] sm:min-h-[60vh]">
          {currentMedia.media_type === "VIDEO" ? (
            <video
              key={currentMedia.media_url}
              src={currentMedia.media_url}
              className="w-full h-full max-h-[75vh] object-contain"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={currentMedia.media_url}
              alt="Instagram post"
              className="w-full h-full max-h-[75vh] object-contain"
            />
          )}

          {/* Navigation arrows */}
          {media.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 sm:p-3 hover:bg-black/80 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 sm:p-3 hover:bg-black/80 transition-all"
                aria-label="Next image"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Caption section */}
        <div className="flex-1 p-5 sm:p-6 lg:p-8 overflow-y-auto lg:max-w-[40%] flex flex-col text-gray-800">
          {/* Username */}
          <a
            href={
              post.username ? `https://instagram.com/${post.username}` : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#053a57] hover:text-[#021b2a] font-semibold text-lg sm:text-xl transition-colors"
          >
            @{post.username || "unknown_user"}
          </a>

          <hr className="my-3 border-gray-200" />

          {/* Info row */}
          <div className="flex items-center justify-between text-sm sm:text-base text-gray-600 mb-3">
            <span>
              {currentIndex + 1} / {media.length}
            </span>
            <a
              href={
                post.username
                  ? `https://instagram.com/${post.username}`
                  : post.permalink
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#053a57] transition-colors"
            >
              <Instagram size={18} /> Instagram
            </a>
          </div>

          <hr className="mb-4 border-gray-200" />

          {/* Caption */}
          <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.caption || "No caption available"}
          </p>
        </div>
      </div>
    </div>
  );
}
export default PostModal;
