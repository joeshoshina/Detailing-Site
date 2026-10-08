import { useEffect, useState } from "react";

// The API lives on the same Vercel deployment (/api/instagram). Set
// VITE_API_BASE_URL only when this frontend is hosted somewhere else.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Loads recent Instagram posts for the gallery and the home page preview.
 * @returns {{ posts: Array, status: "loading" | "ready" | "error", retry: Function }}
 */
export default function useInstagramPosts() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0); // bump to retry

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

  return { posts, status, retry };
}
