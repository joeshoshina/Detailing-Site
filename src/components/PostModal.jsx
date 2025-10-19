// PURPOSE:
// Full-screen modal for displaying Instagram posts with support for
// carousel albums (multi-image posts), captions, and navigation.
//
// FEATURES:
// - Displays single images, videos, or carousel albums
// - Left/right arrow navigation for carousel posts
// - Keyboard controls (Escape to close, Arrow keys to navigate)
// - Truncated captions with "Read more" expansion
// - Dark letterboxing (#0b0b0b) for proper image aspect ratios
// - Responsive design (90vh mobile, 75vh tablet, 50vh desktop)
// - Only closes via X button or ESC key (not by clicking outside)
// - Background remains scrollable while modal is open
//
// PROPS:
// - post: {
//     id: string,
//     username: string,
//     caption: string,
//     permalink: string,
//     media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM",
//     media_url: string (for single posts),
//     children: [{ media_url, media_type }] (for carousels)
//   }
// - onClose: Function to call when modal is closed
//
// DEPENDENCIES:
// - lucide-react: X, ChevronLeft, ChevronRight, Instagram icons
//
// STYLING NOTES:
// - Uses Tailwind CSS utility classes
// - Modal max-height: 50vh on desktop (lg breakpoint)
// - Media background: #0b0b0b (dark letterboxing)
// - Brand colors: #053a57 (primary), #021b2a (hover)
// - Caption truncates at 150 characters
//
// KEYBOARD SHORTCUTS:
// - ESC: Close modal
// - Arrow Left: Previous image (carousel only)
// - Arrow Right: Next image (carousel only)
//
// MAINTENANCE NOTES:
// - Caption truncation length adjustable via shouldTruncate constant
// - Modal heights responsive via max-h-[90vh] sm:max-h-[75vh] lg:max-h-[50vh]
// - Images use object-contain to prevent cropping
// - Background remains scrollable for better UX
//
// AUTHOR: CR Auto Detailing Development Team
// LAST UPDATED: 2025
// ============================================

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Instagram } from "lucide-react";

function PostModal({ post, onClose }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  // currentIndex: Tracks which image in carousel is displayed (0-indexed)
  // showFullCaption: Controls caption expansion for long captions
  // ============================================
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullCaption, setShowFullCaption] = useState(false);

  // ============================================
  // MEDIA DATA PREPARATION
  // ============================================
  // For carousel posts: use children array
  // For single posts: wrap media_url in array format for consistent handling
  // ============================================
  const media = post.children || [
    { media_url: post.media_url, media_type: post.media_type },
  ];

  // ============================================
  // NAVIGATION FUNCTIONS
  // ============================================
  // goToNext: Cycles to next image, wraps to start at end
  // goToPrev: Cycles to previous image, wraps to end at start
  // Uses modulo operator for circular navigation
  // ============================================
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

  const currentMedia = media[currentIndex];
  const caption = post.caption || "No caption available";

  // ============================================
  // CAPTION TRUNCATION
  // ============================================
  // Captions longer than 150 characters show "Read more" button
  // Adjust this value to change truncation threshold
  // ============================================
  const shouldTruncate = caption.length > 150;

  // ============================================
  // KEYBOARD NAVIGATION SETUP
  // ============================================
  // Adds keyboard event listeners for modal controls
  // Background remains scrollable for better UX
  // Cleanup removes listeners on unmount
  // ============================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    // ============================================
    // MODAL BACKDROP
    // ============================================
    // Full-screen overlay with blur effect
    // Background is scrollable - modal doesn't lock scroll
    // Backdrop clicks do NOT close modal (only X button closes)
    // fadeIn animation provides smooth entrance
    // pointer-events-none allows clicking through to background
    // ============================================
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-2 sm:p-4 pointer-events-none"
      style={{ animation: "fadeIn 0.25s ease-out" }}
    >
      {/* ============================================
          MODAL CONTAINER
          ============================================
          Responsive max-heights:
          - Mobile (default): 90vh - More vertical space for stacked layout
          - Tablet (sm): 75vh - Balanced height
          - Desktop (lg): 50vh - Compact as requested
          
          Layout changes from column (mobile) to row (desktop) at lg breakpoint
          pointer-events-auto re-enables clicking inside the modal
          ============================================ */}
      <div
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh] sm:max-h-[75vh] lg:max-h-[50vh] pointer-events-auto"
        style={{ animation: "scaleIn 0.3s ease-out" }}
      >
        {/* ============================================
            CLOSE BUTTON
            ============================================
            Positioned absolutely in top-right corner
            Z-index 10 ensures it stays above media content
            ============================================ */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 text-white rounded-full p-1.5 sm:p-2 hover:bg-black/70 transition-all"
          aria-label="Close modal"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* ============================================
            MEDIA SECTION
            ============================================
            Left side of modal (desktop) / Top (mobile)
            
            Background: #0b0b0b (dark letterboxing for proper aspect ratios)
            
            Image/Video behavior:
            - object-contain: Shows entire media without cropping
            - max-w-full max-h-full: Scales to fit container
            - Creates letterboxing/pillarboxing as needed
            
            Height behavior:
            - Mobile: Fixed 50vh
            - Tablet: Fixed 55vh
            - Desktop (lg): Auto height (fills available space in 50vh modal)
            
            Max width on desktop: 60% of modal (40% reserved for caption)
            ============================================ */}
        <div className="relative flex-1 flex items-center justify-center bg-[#0b0b0b] lg:max-w-[60%] h-[50vh] sm:h-[55vh] lg:h-auto">
          {currentMedia.media_type === "VIDEO" ? (
            <video
              key={currentMedia.media_url}
              src={currentMedia.media_url}
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
              alt="Instagram post"
              className="max-w-full max-h-full object-contain"
            />
          )}

          {/* ============================================
              NAVIGATION ARROWS
              ============================================
              Only visible for carousel posts (media.length > 1)
              Positioned vertically centered (top-1/2 -translate-y-1/2)
              Fixed horizontally (left/right with padding)
              ============================================ */}
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

        {/* ============================================
            CAPTION SECTION
            ============================================
            Right side of modal (desktop) / Bottom (mobile)
            
            Max width on desktop: 40% of modal
            Max height: 40vh on mobile to prevent overflow
            
            Contains:
            - Username link (clickable to Instagram profile)
            - Image counter (X / Y)
            - Instagram link
            - Caption with read more/less functionality
            ============================================ */}
        <div className="flex-1 p-5 sm:p-6 lg:p-8 lg:max-w-[40%] flex flex-col text-gray-800 max-h-[40vh] lg:max-h-full">
          {/* Username Link */}
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

          {/* Image Counter & Instagram Link */}
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

          {/* ============================================
              CAPTION WITH READ MORE
              ============================================
              Truncates captions longer than 150 characters
              
              Behavior:
              - Collapsed: Shows first 150 chars + "..."
              - Expanded: Shows full caption with scroll
              - overflow-y-auto and flex-1 applied when expanded
                to enable scrolling within available space
              
              Read more button only appears for long captions
              ============================================ */}
          <div
            className={`text-sm sm:text-base text-gray-700 leading-relaxed ${
              showFullCaption ? "overflow-y-auto flex-1" : ""
            }`}
          >
            <p className="whitespace-pre-wrap">
              {shouldTruncate && !showFullCaption
                ? caption.slice(0, 150) + "..."
                : caption}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullCaption(!showFullCaption)}
                className="text-[#053a57] hover:text-[#021b2a] font-medium mt-2 transition-colors"
              >
                {showFullCaption ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          ANIMATIONS
          ============================================
          fadeIn: Smooth backdrop fade-in (0.25s)
          scaleIn: Modal scales up from 95% to 100% (0.3s)
          ============================================ */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default PostModal;
