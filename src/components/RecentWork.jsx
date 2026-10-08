import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import PostCard from "./PostCard";
import PostGrid from "./PostGrid";
import PostModal from "./PostModal";
import useInstagramPosts from "../hooks/useInstagramPosts";

/**
 * RecentWork.jsx
 * ----------------------------
 * Home page preview of the latest Instagram posts (real social proof),
 * linking through to the full gallery. Hides itself entirely if Instagram
 * can't be reached, so the home page never shows an error.
 */

const PREVIEW_COUNT = 4;

const RecentWork = () => {
  const { posts, status } = useInstagramPosts();
  const [selectedPost, setSelectedPost] = useState(null);

  if (status === "error" || (status === "ready" && posts.length === 0)) {
    return null;
  }

  const previewPosts = posts.slice(0, PREVIEW_COUNT);

  return (
    <section id="work" className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Recent work" title="Fresh off the driveway">
          Before-and-afters straight from our Instagram.
        </SectionHeading>

        <div className="mt-14">
          <PostGrid count={status === "loading" ? PREVIEW_COUNT : previewPosts.length}>
            {status === "loading"
              ? Array.from({ length: PREVIEW_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-sm bg-gray-200 animate-pulse"
                  />
                ))
              : previewPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
          </PostGrid>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-dark"
          >
            See the full gallery <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

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

export default RecentWork;
