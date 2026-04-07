import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, Send, RefreshCw, UserCircle2, Trash2 } from 'lucide-react';
import { apiFetch } from '@/utils/apiClient';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { getBackendUrl } from '@/utils/backendUrl';

type CommunityPost = {
  id: number;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  replies?: CommunityReply[];
};

type CommunityReply = {
  id: number;
  post_id: number;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
};

type CommunityResponse = {
  posts: CommunityPost[];
  total?: number | null;
  limit: number;
  offset: number;
  has_more: boolean;
};

const BACKEND_URL = getBackendUrl();

/** JWT για κλήσεις API — δοκιμάζει refresh αν το session δεν έχει ακόμα token (restore καρτέλας κ.λπ.). */
async function getAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) return session.access_token;
  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session?.access_token) {
    throw new Error('Δεν υπάρχει ενεργή σύνδεση.');
  }
  return data.session.access_token;
}

const CommunityPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [replyingPostId, setReplyingPostId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const isMountedRef = useRef(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const fetchPosts = useCallback(async (nextOffset = 0, append = false) => {
    setError(null);
    if (!append) setLoading(true);
    try {
      const token = await getAccessToken();

      const data = await apiFetch<CommunityResponse>(
        `${BACKEND_URL}/api/community/posts?limit=20&offset=${nextOffset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          dedupeKey: `community-posts-${nextOffset}`,
          retries: 0,
          timeoutMs: 12_000,
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
      const token = await getAccessToken();

      const result = await apiFetch<{ post: CommunityPost }>(`${BACKEND_URL}/api/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: value }),
      });

      setContent('');
      // Optimistic prepend avoids full list refetch and feels instant.
      setPosts((prev) => [result.post, ...prev]);
    } catch (e: any) {
      setError(e?.message || 'Αποτυχία δημιουργίας post.');
    } finally {
      setPosting(false);
    }
  };

  const onDeletePost = useCallback(async (postId: number) => {
    if (!window.confirm('Θες σίγουρα να διαγράψεις αυτό το post;')) return;
    setDeletingPostId(postId);
    setError(null);
    try {
      const token = await getAccessToken();

      await apiFetch<{ ok: boolean; deleted_id: number }>(
        `${BACKEND_URL}/api/community/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (e: any) {
      setError(e?.message || 'Αποτυχία διαγραφής post.');
    } finally {
      setDeletingPostId(null);
    }
  }, []);

  const onSubmitReply = useCallback(
    async (postId: number) => {
      const inputEl = replyInputRefs.current[postId];
      const value = inputEl?.value.trim() ?? '';
      if (!value) return;

      setReplyingPostId(postId);
      setError(null);
      try {
        const token = await getAccessToken();

        const result = await apiFetch<{ reply: CommunityReply }>(
          `${BACKEND_URL}/api/community/posts/${postId}/replies`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: value }),
          }
        );

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  replies: [...(p.replies ?? []), result.reply],
                }
              : p
          )
        );
        if (inputEl) inputEl.value = '';
      } catch (e: any) {
        setError(e?.message || 'Αποτυχία αποστολής απάντησης.');
      } finally {
        setReplyingPostId(null);
      }
    },
    []
  );

  // Autosize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 220) + 'px';
  }, [content]);

  const formattedPosts = useMemo(
    () =>
      posts.map((p) => ({
        ...p,
        dateLabel: new Date(p.created_at).toLocaleString('el-GR'),
      })),
    [posts]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-coral-accent rounded-3xl shadow-xl p-5 sm:p-6 mb-5 text-white border-2 border-coral-light/50">
          <h1 className="text-3xl font-black flex items-center gap-2">
            <MessageSquare className="w-7 h-7" />
            Student Community
          </h1>
          <p className="text-white/90 mt-1">
            Κάνε μια ερώτηση, μοιράσου tip, δώσε κίνητρο σε κάποιον άλλο. Να είμαστε ευγενικοί. 🙂
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white/95 dark:bg-gray-900/95 rounded-2xl border-2 border-coral-accent/25 dark:border-gray-700 p-4 mb-5 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-coral-wash flex items-center justify-center text-coral-strong font-bold shadow-sm border border-coral-accent/25">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                placeholder="Γράψε το post σου… (Σεβασμός, χωρίς προσωπικά δεδομένα)"
                className="w-full min-h-[90px] rounded-xl border-2 border-coral-accent/15 dark:border-gray-700 p-3 focus:outline-none focus:border-coral-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{content.length}/2000</span>
                <button
                  type="submit"
                  disabled={posting || !content.trim()}
                  className="px-4 py-2 rounded-xl bg-coral-accent hover:bg-coral-strong text-white font-bold disabled:opacity-50 inline-flex items-center gap-2 shadow-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {posting ? 'Ανέβασμα…' : 'Δημοσίευση'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-coral-accent/20 p-4 animate-pulse"
                >
                  <div className="h-3 w-1/3 bg-coral-accent/15 rounded mb-3" />
                  <div className="h-3 w-3/4 bg-coral-accent/15 rounded mb-2" />
                  <div className="h-3 w-2/4 bg-coral-accent/15 rounded" />
                </div>
              ))}
            </div>
          ) : formattedPosts.length === 0 ? (
            <div className="text-center bg-white/80 border-2 border-coral-accent/25 rounded-2xl p-8">
              <p className="text-coral-accent font-bold mb-1">Κανένα post ακόμα</p>
              <p className="text-gray-600 text-sm">
                Γράψε το πρώτο σου μήνυμα και ξεκίνα τη συζήτηση!
              </p>
            </div>
          ) : (
            formattedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border-2 border-coral-accent/20 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <header className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-coral-wash flex items-center justify-center text-coral-strong font-bold border border-coral-accent/20">
                      {post.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="font-bold text-coral-accent">{post.username}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <time className="text-xs text-gray-500">{post.dateLabel}</time>
                    {(isAdmin || String(user?.id ?? '') === String(post.user_id)) && (
                      <button
                        type="button"
                        onClick={() => void onDeletePost(post.id)}
                        disabled={deletingPostId === post.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        title="Διαγραφή post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deletingPostId === post.id ? 'Διαγραφή…' : 'Διαγραφή'}
                      </button>
                    )}
                  </div>
                </header>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>

                <div className="mt-4 border-t border-coral-accent/15 pt-3">
                  <div className="space-y-2 mb-3">
                    {(post.replies ?? []).map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-xl bg-coral-wash/90 border border-coral-accent/15 p-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-coral-strong">
                            {reply.username}
                          </span>
                          <time className="text-[11px] text-gray-500">
                            {new Date(reply.created_at).toLocaleString('el-GR')}
                          </time>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                    {(post.replies ?? []).length === 0 && (
                      <p className="text-xs text-gray-500">Δεν υπάρχουν απαντήσεις ακόμα.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      ref={(el) => {
                        replyInputRefs.current[post.id] = el;
                      }}
                      maxLength={1500}
                      placeholder="Απάντησε σε αυτό το post…"
                      className="flex-1 rounded-xl border border-coral-accent/25 px-3 py-2 text-sm focus:outline-none focus:border-coral-accent"
                    />
                    <button
                      type="button"
                      onClick={() => void onSubmitReply(post.id)}
                      disabled={replyingPostId === post.id}
                      className="px-3 py-2 rounded-xl bg-coral-accent hover:bg-coral-strong text-white text-sm font-semibold disabled:opacity-50 transition-colors"
                    >
                      {replyingPostId === post.id ? 'Στέλνεται…' : 'Απάντηση'}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => void fetchPosts(0, false)}
            className="px-4 py-2 rounded-xl border border-coral-accent/30 bg-white text-coral-strong font-semibold inline-flex items-center gap-2 hover:border-coral-accent"
          >
            <RefreshCw className="w-4 h-4" />
            Ανανέωση
          </button>
          {hasMore && (
            <button
              onClick={() => void fetchPosts(offset + 20, true)}
              className="px-4 py-2 rounded-xl bg-coral-accent hover:bg-coral-strong text-white font-semibold shadow-md transition-colors"
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
