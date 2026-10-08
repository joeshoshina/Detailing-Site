import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Instagram } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import PostCard from "../components/PostCard.jsx";
import PostModal from "../components/PostModal.jsx";

// The API lives on the same Vercel deployment (/api/instagram). Set
// VITE_API_BASE_URL only when this frontend is hosted somewhere else.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const Gallery = () => {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [attempt, setAttempt] = useState(0); // bump to retry
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE}/api/instagram`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPosts(data.data || []);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch Instagram posts:", err);
        setStatus("error");
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = () => {
    setStatus("loading");
    setAttempt((n) => n + 1);
  };

  const username = posts[0]?.username;

  return (
    <section className="flex flex-col items-center min-h-screen bg-gray-50">
      <PageHeader title="Gallery" />

      {/* --- Intro --- */}
      <div className="mt-28 sm:mt-32 lg:mt-40 px-4 text-center">
        <h1 className="text-3xl font-bold">Our Recent Work</h1>
        <p className="mt-2 text-gray-600">
          Fresh from our Instagram. Tap a post to see the full set.
        </p>
        {username && (
          <a
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-[#053a57] hover:text-[#021b2a] font-medium"
          >
            <Instagram size={18} /> @{username}
          </a>
        )}
      </div>

      {/* --- Gallery Grid --- */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-8 max-w-6xl w-full px-3 sm:px-4 pb-12">
        {status === "loading" &&
          Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm bg-gray-200 animate-pulse"
            />
          ))}

        {status === "error" && (
          <div className="col-span-full flex flex-col items-center py-20 text-gray-600">
            <p>We couldn't load our latest posts right now.</p>
            <button
              onClick={retry}
              className="mt-4 px-5 py-2 rounded-lg bg-[#053a57] text-white hover:bg-[#021b2a] transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {status === "ready" && posts.length === 0 && (
          <p className="text-center col-span-full text-gray-600 py-20">
            No posts available
          </p>
        )}

        {status === "ready" &&
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => setSelectedPost(post)}
            />
          ))}
      </div>

      {/* --- Booking CTA --- */}
      {status === "ready" && (
        <div className="pb-16 text-center">
          <p className="text-lg text-gray-700">Like what you see?</p>
          <Link
            to="/book"
            className="inline-block mt-3 px-6 py-2.5 rounded-lg bg-[#053a57] text-white font-medium hover:bg-[#021b2a] transition-colors"
          >
            Book Your Detail
          </Link>
        </div>
      )}

      {/* --- Modal --- */}
      {/* key remounts the modal per post so the slide index never carries over */}
      {selectedPost && (
        <PostModal
          key={selectedPost.id}
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </section>
  );
};

export default Gallery;
