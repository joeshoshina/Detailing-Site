import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard.jsx";
import PostModal from "../components/PostModal.jsx";

const Gallery = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5001/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch Instagram posts:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        {/* --- Header --- */}
        <div className="fixed top-0 left-0 w-full z-50 p-4 bg-gradient-to-br from-[#0a1625] via-[#053a57] to-[#070d16] shadow-md flex justify-center">
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
          >
            <img
              src="https://cdn.zarlasites.com/logo/313e8157a5ef0d7afd436dfe9dfe53f462de17d1b2580c32a6730f6aa6953bd7"
              alt="Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-20 lg:w-20 object-contain transition-all duration-300"
            />
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide transition-all duration-300">
              CR Auto Detailing
            </span>
          </Link>
        </div>

        {/* --- Gallery Grid --- */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-28 sm:mt-32 max-w-[95vw] w-full px-3 sm:px-4 lg:py-12 pb-12">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#053a57] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center col-span-full text-gray-600 py-20">
              No posts available
            </p>
          ) : (
            posts
              .slice(0, 12)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => setSelectedPost(post)}
                />
              ))
          )}
        </div>

        {/* --- Modal --- */}
        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </section>
    </>
  );
};

export default Gallery;
