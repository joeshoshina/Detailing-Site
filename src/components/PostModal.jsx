// PURPOSE:
// Full-screen modal for displaying Instagram posts with support for
// carousel albums (multi-image posts), captions, and navigation.
//
// FEATURES:
// - Displays single images, videos, or carousel albums
// - Left/right arrow navigation for carousel posts, plus swipe on touch screens
// - Keyboard controls (Escape to close, Arrow keys to navigate)
// - Full caption in its own scroll area, so long captions never resize the
//   modal or shift the image
// - Dark letterboxing (#0b0b0b) for proper image aspect ratios
// - Only closes via X button or ESC key (not by clicking outside)
// - Background remains scrollable while modal is open
// - Keyboard focus moves to the close button on open and returns to the
//   post that opened it on close
//
// PROPS:
// - post: {
//     id: string,
//     username: string,
//     caption: string,
//     permalink: string,
//     media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM",
//     media_url: string,
//     thumbnail_url: string (videos only),
//     children: [{ media_url, media_type, thumbnail_url }] (for carousels)
//   }
// - onClose: Function to call when modal is closed
//
// DEPENDENCIES:
// - lucide-react: X, ChevronLeft, ChevronRight, Instagram icons
//
// STYLING NOTES:
// - Uses Tailwind CSS utility classes
// - Fixed modal height per breakpoint (media 50vh on mobile, 50vh total on desktop)
// - Media background: #0b0b0b (dark letterboxing)
// - Brand colors: brand / brand-dark tokens (see index.css)
//
// KEYBOARD SHORTCUTS:
// - ESC: Close modal
// - Arrow Left: Previous image (carousel only)
// - Arrow Right: Next image (carousel only)
//
// MAINTENANCE NOTES:
// - Gallery renders this with key={post.id}, so state resets per post
// - Images use object-contain to prevent cropping
//
// AUTHOR: CR Auto Detailing Development Team
// LAST UPDATED: 2026
// ============================================

import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Instagram } from "lucide-react";

const SWIPE_THRESHOLD_PX = 40;

function PostModal({ post, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const closeButtonRef = useRef(null);

  // ============================================
  // MEDIA DATA PREPARATION
  // ============================================
  // For carousel posts: use children array
  // For single posts: wrap the post itself in an array for consistent handling
  // ============================================
  const media = post.children?.length ? post.children : [post];
  const count = media.length;
  const currentMedia = media[currentIndex];
  const caption = post.caption || "No caption available";

  // Circular navigation via modulo
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % count);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + count) % count);

  // ============================================
  // FOCUS MANAGEMENT
  // ============================================
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    return () => previouslyFocused?.focus?.({ preventScroll: true });
  }, []);

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % count);
      if (e.key === "ArrowLeft")
        setCurrentIndex((prev) => (prev - 1 + count) % count);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count, onClose]);

  // ============================================
  // SWIPE NAVIGATION (touch screens)
  // ============================================
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || count < 2) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX <= -SWIPE_THRESHOLD_PX) goToNext();
    if (deltaX >= SWIPE_THRESHOLD_PX) goToPrev();
  };

  return (
    // ============================================
    // MODAL BACKDROP
    // ============================================
    // pointer-events-none lets the page behind stay scrollable/clickable;
    // backdrop clicks do NOT close the modal (only X / ESC do)
    // ============================================
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-2 sm:p-4 pointer-events-none animate-fade-in">
      {/* ============================================
          MODAL CONTAINER
          ============================================
          Mobile/tablet: stacked, media on top with a fixed height, caption
          below takes the remaining space and scrolls.
          Desktop (lg): side by side at a fixed 50vh height.
          ============================================ */}
      <div
        role="dialog"
        aria-label={`Instagram post by @${post.username || "unknown_user"}`}
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh] lg:h-[50vh] pointer-events-auto animate-scale-in"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 text-white rounded-full p-1.5 sm:p-2 hover:bg-black/70 transition-all"
          aria-label="Close modal"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* ============================================
            MEDIA SECTION
            ============================================ */}
        <div
          className="relative shrink-0 flex items-center justify-center bg-[#0b0b0b] h-[50vh] sm:h-[55vh] lg:h-full lg:flex-1"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {currentMedia.media_type === "VIDEO" ? (
            <video
              key={currentMedia.media_url}
              src={currentMedia.media_url}
              poster={currentMedia.thumbnail_url}
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={currentMedia.media_url}
              alt={`Photo ${currentIndex + 1} of ${count}`}
              className="max-w-full max-h-full object-contain"
            />
          )}

          {/* Navigation arrows: carousel posts only */}
          {count > 1 && (
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

        {/* ============================================
            CAPTION SECTION
            ============================================
            min-h-0 lets the caption shrink and scroll inside the fixed
            modal height instead of stretching it.
            ============================================ */}
        <div className="flex flex-col min-h-0 p-5 sm:p-6 lg:p-8 lg:w-[40%] text-gray-800">
          <a
            href={
              post.username ? `https://instagram.com/${post.username}` : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand-dark font-semibold text-lg sm:text-xl transition-colors"
          >
            @{post.username || "unknown_user"}
          </a>

          <hr className="my-3 border-gray-200" />

          <div className="flex items-center justify-between text-sm sm:text-base text-gray-600 mb-3">
            <span>
              {currentIndex + 1} / {count}
            </span>
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-brand transition-colors"
            >
              <Instagram size={18} /> View on Instagram
            </a>
          </div>

          <hr className="mb-4 border-gray-200" />

          <p className="flex-1 min-h-0 overflow-y-auto whitespace-pre-wrap text-sm sm:text-base text-gray-700 leading-relaxed">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
