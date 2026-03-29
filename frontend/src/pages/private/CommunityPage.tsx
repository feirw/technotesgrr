import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/utils/apiClient';
import { supabase } from '@/utils/supabaseClient';

type CommunityPost = {
  id: number;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
};

type CommunityResponse = {
  posts: CommunityPost[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8001';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const isMountedRef = useRef(true);

  const fetchPosts = useCallback(async (nextOffset = 0, append = false) => {
    setError(null);
    if (!append) setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Δεν υπάρχει ενεργή σύνδεση.');

      const data = await apiFetch<CommunityResponse>(
        `${BACKEND_URL}/api/community/posts?limit=20&offset=${nextOffset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          dedupeKey: `community-posts-${nextOffset}`,
        }
      );

      if (!isMountedRef.current) return;
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setOffset(nextOffset);
      setHasMore(Boolean(data.has_more));
    } catch (e: any) {
      if (!isMountedRef.current) return;
      setError(e?.message || 'Αποτυχία φόρτωσης community posts.');
    } finally {
      if (!isMountedRef.current) return;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void fetchPosts();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPosts]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = content.trim();
    if (!value) return;
    setPosting(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Δεν υπάρχει ενεργή σύνδεση.');

      await apiFetch<{ post: CommunityPost }>(`${BACKEND_URL}/api/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: value }),
      });

      setContent('');
      await fetchPosts(0, false);
    } catch (e: any) {
      setError(e?.message || 'Αποτυχία δημιουργίας post.');
    } finally {
      setPosting(false);
    }
  };

  const formattedPosts = useMemo(
    () =>
      posts.map((p) => ({
        ...p,
        dateLabel: new Date(p.created_at).toLocaleString('el-GR'),
      })),
    [posts]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 border-2 border-pink-200 rounded-3xl shadow-xl p-5 sm:p-6 mb-5">
          <h1 className="text-3xl font-black text-pink-600 flex items-center gap-2">
            <MessageSquare className="w-7 h-7" />
            Student Community
          </h1>
          <p className="text-gray-600 mt-2">
            Ανέβασε απορίες, tips και υλικό για να βοηθάτε ο ένας τον άλλο.
          </p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl border-2 border-pink-200 p-4 mb-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            placeholder="Γράψε το post σου..."
            className="w-full min-h-[110px] rounded-xl border-2 border-pink-100 p-3 focus:outline-none focus:border-pink-400"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">{content.length}/2000</span>
            <button
              type="submit"
              disabled={posting || !content.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {posting ? 'Ανέβασμα...' : 'Δημοσίευση'}
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-600">Φόρτωση posts...</p>
          ) : (
            formattedPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-pink-200 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-pink-600">{post.username}</span>
                  <span className="text-xs text-gray-500">{post.dateLabel}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => void fetchPosts(0, false)}
            className="px-4 py-2 rounded-xl border border-pink-200 bg-white text-pink-700 font-semibold inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Ανανέωση
          </button>
          {hasMore && (
            <button
              onClick={() => void fetchPosts(offset + 20, true)}
              className="px-4 py-2 rounded-xl bg-pink-500 text-white font-semibold"
            >
              Περισσότερα
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;

