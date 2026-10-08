import { Link } from "react-router-dom";
import { useState } from "react";
import { Instagram } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import PostCard from "../components/PostCard.jsx";
import PostGrid from "../components/PostGrid.jsx";
import PostModal from "../components/PostModal.jsx";
import Footer from "../components/Footer.jsx";
import MobileCTA from "../components/MobileCTA.jsx";
import useInstagramPosts from "../hooks/useInstagramPosts.js";
import business from "../data/business.js";

const SKELETON_COUNT = 6;

const Gallery = () => {
  const { posts, status, retry } = useInstagramPosts();
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <>
      <PageHeader />

      <main id="main" tabIndex={-1} className="min-h-screen bg-gray-50 outline-none">
        {/* --- Intro --- */}
        <div className="px-4 pt-32 sm:pt-36 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Our recent work
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-balance">
            Before & After Car Detailing Gallery
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 text-pretty">
            Real exterior, interior, and full details from driveways around the
            San Fernando Valley, fresh from our Instagram. Tap a post to see the
            full set.
          </p>
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 font-medium text-brand hover:text-brand-dark"
          >
            <Instagram size={18} /> Follow @{business.instagram}
          </a>
        </div>

        {/* --- Gallery Grid (column count adapts to the number of posts) --- */}
        <div className="mt-10 px-3 pb-12 sm:px-6">
          {status === "loading" && (
            <PostGrid count={SKELETON_COUNT}>
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-gray-200 animate-pulse"
                />
              ))}
            </PostGrid>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center py-20 text-center text-gray-600">
              <p>We couldn't load our latest posts right now.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={retry}
                  className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark transition-colors"
                >
                  Try again
                </button>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-brand px-5 py-2.5 font-semibold text-brand hover:bg-brand-tint transition-colors"
                >
                  View on Instagram
                </a>
              </div>
            </div>
          )}

          {status === "ready" && posts.length === 0 && (
            <p className="py-20 text-center text-gray-600">No posts available</p>
          )}

          {status === "ready" && posts.length > 0 && (
            <PostGrid count={posts.length}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </PostGrid>
          )}
        </div>

        {/* --- Booking CTA --- */}
        {status === "ready" && (
          <div className="pb-20 text-center">
            <p className="text-lg text-gray-700">Like what you see?</p>
            <Link
              to="/book"
              className="mt-3 inline-block rounded-lg bg-brand px-8 py-3.5 text-lg font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              Book Your Detail
            </Link>
          </div>
        )}

        {/* key remounts the modal per post so the slide index never carries over */}
        {selectedPost && (
          <PostModal
            key={selectedPost.id}
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </main>

      <Footer />
      <MobileCTA />
    </>
  );
};

export default Gallery;
