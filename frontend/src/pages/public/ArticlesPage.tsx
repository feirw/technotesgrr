import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MoreVertical,
  PenSquare,
  Plus,
  Share2,
  Sparkles,
  Trash2,
  X,
  User,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { Article, ArticlePastel } from '../../data/articles';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { getBackendUrlCandidates } from '@/utils/backendUrl';

/* ─────────────────────────── constants ─────────────────────────── */

const CLIENT_ID_KEY = 'technotesgr_article_client_v1';
const LIKED_IDS_KEY = 'technotesgr_liked_article_ids_v1';

const PASTEL_OPTIONS: { key: ArticlePastel; label: string; hex: string }[] = [
  { key: 'white',  label: 'Λευκό',   hex: '#ffffff' },
  { key: 'pink',   label: 'Ροζ',     hex: '#fce7f3' },
  { key: 'sky',    label: 'Γαλάζιο', hex: '#e0f2fe' },
  { key: 'yellow', label: 'Κίτρινο', hex: '#fef9c3' },
  { key: 'violet', label: 'Μωβ',     hex: '#ede9fe' },
  { key: 'mint',   label: 'Μέντα',   hex: '#ccfbf1' },
];

const pastelConfig: Record<ArticlePastel, { light: string; dark: string; accent: string }> = {
  white:  { light: 'bg-white',           dark: 'dark:bg-slate-800',      accent: 'border-slate-200 dark:border-slate-700' },
  pink:   { light: 'bg-pink-50',         dark: 'dark:bg-pink-950/40',    accent: 'border-pink-200 dark:border-pink-800/60' },
  sky:    { light: 'bg-sky-50',          dark: 'dark:bg-sky-950/40',     accent: 'border-sky-200 dark:border-sky-800/60' },
  yellow: { light: 'bg-amber-50',        dark: 'dark:bg-amber-950/30',   accent: 'border-amber-200 dark:border-amber-800/50' },
  violet: { light: 'bg-violet-50',       dark: 'dark:bg-violet-950/30',  accent: 'border-violet-200 dark:border-violet-800/50' },
  mint:   { light: 'bg-teal-50',         dark: 'dark:bg-teal-950/30',    accent: 'border-teal-200 dark:border-teal-800/50' },
};

/* ─────────────────────────── utilities ─────────────────────────── */

function getOrCreateClientId(): string {
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id || id.length < 10) {
      id = crypto.randomUUID();
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return `fallback-${Date.now()}`;
  }
}

function loadLikedIds(): Set<number> {
  try {
    const raw = localStorage.getItem(LIKED_IDS_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is number => typeof x === 'number'));
  } catch {
    return new Set();
  }
}

function persistLikedId(id: number): void {
  const s = loadLikedIds();
  s.add(id);
  try {
    localStorage.setItem(LIKED_IDS_KEY, JSON.stringify([...s]));
  } catch { /* ignore */ }
}

function formatDateLong(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat('el-GR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch { return iso; }
}

function daysAgoLabel(iso: string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return 'Σήμερα';
  if (days === 1) return 'Χθες';
  if (days < 7) return `${days} μέρες πριν`;
  if (days < 30) return `${Math.floor(days / 7)} εβδ. πριν`;
  return formatDateLong(iso);
}

/* ─────────────────────────── types / mapping ─────────────────────────── */

type ApiArticleRow = {
  id: number;
  author_name: string;
  author_avatar?: string | null;
  created_at: string;
  title: string;
  body: string;
  pastel: string;
  likes_count: number;
};

function mapApiRow(r: ApiArticleRow): Article {
  const pastel = (['white', 'sky', 'pink', 'yellow', 'violet', 'mint'].includes(r.pastel)
    ? r.pastel : 'white') as ArticlePastel;
  return {
    id: r.id,
    authorName: r.author_name,
    authorAvatar: r.author_avatar ?? undefined,
    publishedAt: r.created_at.slice(0, 10),
    title: r.title,
    body: r.body,
    pastel,
    likes: r.likes_count,
  };
}

/* ─────────────────────────── Avatar ─────────────────────────── */

const Avatar: React.FC<{ src?: string; name: string; size?: 'sm' | 'md' }> = ({ src, name, size = 'md' }) => {
  const [err, setErr] = useState(false);
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div className={`${dim} rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-slate-700 shadow-sm`}>
      {src && !err ? (
        <img src={src} alt={name} className="w-full h-full object-cover" loading="lazy" decoding="async" onError={() => setErr(true)} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 font-bold text-slate-600 dark:text-slate-200">
          {initials || <User className="w-4 h-4" />}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────── Toast ─────────────────────────── */

const Toast: React.FC<{ message: string; type?: 'success' | 'error'; onDismiss: () => void }> = ({ message, type = 'success', onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold border ${
      type === 'success'
        ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        : 'bg-white dark:bg-slate-800 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
    }`}
  >
    {type === 'success'
      ? <Check className="w-4 h-4 flex-shrink-0" />
      : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
    {message}
    <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
  </motion.div>
);

/* ─────────────────────────── ArticleCard ─────────────────────────── */

type CardProps = {
  article: Article;
  isAdmin: boolean;
  onDelete: (id: number) => void;
  likedIds: Set<number>;
  likingId: number | null;
  onLike: (id: number) => void;
  index: number;
};

const ArticleCard: React.FC<CardProps> = ({ article, isAdmin, onDelete, likedIds, likingId, onLike, index }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const hasLiked = likedIds.has(article.id);
  const busy = likingId === article.id;
  const cfg = pastelConfig[article.pastel];

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const shareUrl = useCallback(async () => {
    const url = `${window.location.origin}/articles#article-${article.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
    setMenuOpen(false);
  }, [article.id]);

  const paragraphs = useMemo<string[]>(
    () =>
      article.body
        .split(/\n\n+/)
        .map((segment: string) => segment.trim())
        .filter((line: string) => line.length > 0),
    [article.body]
  );

  return (
    <motion.article
      id={`article-${article.id}`}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        break-inside-avoid mb-6 rounded-2xl border overflow-hidden
        ${cfg.light} ${cfg.dark} ${cfg.accent}
        shadow-sm hover:shadow-md transition-shadow duration-300
      `}
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={article.authorAvatar} name={article.authorName} />
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate leading-tight">
                {article.authorName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {daysAgoLabel(article.publishedAt)}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label="Επιλογές"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  id={menuId}
                  role="menu"
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-20 overflow-hidden py-1"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void shareUrl()}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-slate-400" />}
                    {copied ? 'Αντιγράφηκε!' : 'Αντιγραφή συνδέσμου'}
                  </button>
                  {isAdmin && (
                    <>
                      <div className="h-px bg-slate-100 dark:bg-slate-700 mx-3 my-1" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => { setMenuOpen(false); onDelete(article.id); }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Διαγραφή ανάρτησης
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug mb-3">
          {article.title}
        </h2>

        {/* Body */}
        <div className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {paragraphs.map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
        <button
          type="button"
          disabled={hasLiked || busy}
          onClick={() => onLike(article.id)}
          aria-pressed={hasLiked}
          aria-label={hasLiked ? `Σου αρέσει (${article.likes})` : `Like (${article.likes})`}
          className={`
            group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
            transition-all duration-200 select-none touch-manipulation
            ${hasLiked
              ? 'text-rose-600 dark:text-rose-400 cursor-default'
              : 'text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-40'}
          `}
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 transition-all ${hasLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'group-hover:scale-110'}`} />
          )}
          <span className="tabular-nums">{article.likes}</span>
          {hasLiked && <span className="text-xs">· Σου αρέσει</span>}
        </button>

        <time className="text-xs text-slate-400 dark:text-slate-500" dateTime={article.publishedAt}>
          {formatDateLong(article.publishedAt)}
        </time>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────── Compose Modal ─────────────────────────── */

type ComposeProps = {
  open: boolean;
  onClose: () => void;
  onPublished: (article: Article) => void;
  postWithCandidates: (path: string, init: RequestInit & { parseJson?: boolean }) => Promise<{ base: string; data: unknown }>;
};

const ComposeModal: React.FC<ComposeProps> = ({ open, onClose, onPublished, postWithCandidates }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pastel, setPastel] = useState<ArticlePastel>('white');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => titleRef.current?.focus(), 100);
  }, [open]);

  // Trap Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const reset = () => { setTitle(''); setBody(''); setPastel('white'); setAvatarUrl(''); setError(''); };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const t = title.trim();
    const b = body.trim();
    if (t.length < 2) { setError('Ο τίτλος χρειάζεται τουλάχιστον 2 χαρακτήρες.'); return; }
    if (b.length < 8) { setError('Το κείμενο είναι πολύ σύντομο (τουλάχιστον 8 χαρακτήρες).'); return; }
    setSubmitting(true);
    try {
      const { data } = await postWithCandidates('/api/articles', {
        method: 'POST',
        body: JSON.stringify({ title: t, body: b, pastel, author_avatar: avatarUrl.trim() || null }),
      });
      const row = (data as { article?: ApiArticleRow }).article;
      if (!row) throw new Error('Άκυρη απάντηση server');
      onPublished(mapApiRow(row));
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία δημοσίευσης. Δοκίμασε ξανά.');
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = body.length;
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compose-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative w-full sm:max-w-xl max-h-[95dvh] sm:max-h-[85dvh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <div>
                <h2 id="compose-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Νέα ανάρτηση
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Θα δημοσιευτεί άμεσα</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Κλείσιμο"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={e => void handleSubmit(e)} className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-5">

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Title */}
                <div>
                  <label htmlFor="art-title" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Τίτλος *
                  </label>
                  <input
                    id="art-title"
                    ref={titleRef}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={200}
                    placeholder="Τι θέλεις να πεις;"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition-all text-sm font-medium"
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">{title.length}/200</p>
                </div>

                {/* Body */}
                <div>
                  <label htmlFor="art-body" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Κείμενο * <span className="normal-case font-normal text-slate-400">(κενή γραμμή = νέα παράγραφος)</span>
                  </label>
                  <textarea
                    id="art-body"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={7}
                    placeholder="Γράψε εδώ…"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition-all text-sm resize-y min-h-[140px]"
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {wordCount} {wordCount === 1 ? 'λέξη' : 'λέξεις'} · {charCount} χαρακτήρες
                  </p>
                </div>

                {/* Color picker */}
                <div>
                  <p className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Χρώμα κάρτας
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PASTEL_OPTIONS.map(({ key, label, hex }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPastel(key)}
                        title={label}
                        aria-label={label}
                        aria-pressed={pastel === key}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                          border-2 transition-all duration-150
                          ${pastel === key
                            ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white bg-white dark:bg-slate-700 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800'}
                        `}
                      >
                        <span
                          className="w-4 h-4 rounded-full ring-1 ring-black/10 flex-shrink-0"
                          style={{ background: hex }}
                          aria-hidden
                        />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar URL */}
                <div>
                  <label htmlFor="art-avatar" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    URL εικόνας προφίλ <span className="normal-case font-normal">(προαιρετικό)</span>
                  </label>
                  <input
                    id="art-avatar"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="px-6 pb-6 flex-shrink-0">
                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    w-full py-3.5 rounded-xl font-bold text-sm
                    bg-slate-900 dark:bg-white text-white dark:text-slate-900
                    hover:bg-slate-700 dark:hover:bg-slate-100
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 touch-manipulation
                    flex items-center justify-center gap-2
                  "
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Δημοσίευση…' : 'Δημοσίευση ανάρτησης'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────── Delete Confirm ─────────────────────────── */

const DeleteConfirmModal: React.FC<{
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}> = ({ open, onConfirm, onCancel, loading }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-6" role="dialog" aria-modal="true">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 max-w-sm w-full text-center"
        >
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Διαγραφή ανάρτησης;</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Η ενέργεια είναι μη αναστρέψιμη.</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Ακύρωση
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Διαγραφή
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

/* ─────────────────────────── Main Page ─────────────────────────── */

const ArticlesPage: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<number>>(() => loadLikedIds());
  const [likingId, setLikingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* fetch */
  const fetchList = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    let lastErr: unknown = null;
    for (const base of getBackendUrlCandidates()) {
      try {
        const res = await fetch(`${base}/api/articles`);
        if (!res.ok) continue;
        const data = (await res.json()) as { articles?: unknown };
        const raw = Array.isArray(data.articles) ? data.articles : [];
        setArticles(raw.map(x => mapApiRow(x as ApiArticleRow)));
        setLoading(false);
        return;
      } catch (e) { lastErr = e; }
    }
    setLoadError(lastErr instanceof Error ? lastErr.message : 'Σφάλμα δικτύου');
    setLoading(false);
  }, []);

  useEffect(() => { void fetchList(); }, [fetchList]);

  /* auth helper */
  const getAuthHeader = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const postWithCandidates = useCallback(async (
    path: string,
    init: RequestInit & { parseJson?: boolean }
  ): Promise<{ base: string; data: unknown }> => {
    const token = await getAuthHeader();
    if (!token) throw new Error('Χρειάζεσαι σύνδεση ως διαχειριστής.');
    const { parseJson = true, ...rest } = init;
    let lastErr: unknown = null;
    for (const base of getBackendUrlCandidates()) {
      try {
        const res = await fetch(`${base}${path}`, {
          ...rest,
          headers: {
            ...(rest.headers as Record<string, string>),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = parseJson ? await res.json().catch(() => ({})) : {};
        if (!res.ok) {
          const detail = typeof (data as { detail?: string }).detail === 'string'
            ? (data as { detail: string }).detail : `HTTP ${res.status}`;
          lastErr = new Error(detail);
          continue;
        }
        return { base, data };
      } catch (e) { lastErr = e; }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Αποτυχία σύνδεσης με τον server');
  }, []);

  /* delete */
  const confirmDelete = async () => {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await postWithCandidates(`/api/articles/${deleteTarget}`, { method: 'DELETE', parseJson: true });
      setArticles(prev => prev.filter(a => a.id !== deleteTarget));
      setLikedIds(prev => {
        const n = new Set(prev);
        n.delete(deleteTarget);
        try { localStorage.setItem(LIKED_IDS_KEY, JSON.stringify([...n])); } catch { /* ignore */ }
        return n;
      });
      showToast('Η ανάρτηση διαγράφηκε.');
    } catch {
      showToast('Δεν ήταν δυνατή η διαγραφή.', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* like */
  const handleLike = async (id: number) => {
    if (likedIds.has(id)) return;
    setLikingId(id);
    try {
      let lastErr: unknown = null;
      for (const base of getBackendUrlCandidates()) {
        try {
          const res = await fetch(`${base}/api/articles/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_id: getOrCreateClientId() }),
          });
          const data = (await res.json()) as {
            liked?: boolean; already_liked?: boolean;
            likes_count?: number; detail?: string;
          };
          if (!res.ok) {
            lastErr = new Error(typeof data.detail === 'string' ? data.detail : `HTTP ${res.status}`);
            continue;
          }
          const count = typeof data.likes_count === 'number' ? data.likes_count : 0;
          setArticles(prev => prev.map(a => (a.id === id ? { ...a, likes: count } : a)));
          if (data.liked || data.already_liked) {
            persistLikedId(id);
            setLikedIds(prev => new Set([...prev, id]));
          }
          return;
        } catch (e) { lastErr = e; }
      }
      console.warn(lastErr);
    } finally {
      setLikingId(null);
    }
  };

  const showComposer = !authLoading && isAdmin;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Page Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                <PenSquare className="w-3.5 h-3.5" />
                TechNotesGR
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 leading-tight tracking-tight">
                Άρθρα &amp; Ανακοινώσεις
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                Δημοσιεύσεις από τη διαχείριση. Μπορείς να πατήσεις <strong className="text-slate-700 dark:text-slate-300">like</strong> μία φορά ανά συσκευή.
              </p>
            </div>

            {showComposer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <button
                  type="button"
                  onClick={() => setComposeOpen(true)}
                  className="
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-slate-900 dark:bg-white text-white dark:text-slate-900
                    text-sm font-bold hover:bg-slate-700 dark:hover:bg-slate-100
                    transition-colors shadow-sm touch-manipulation whitespace-nowrap
                  "
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  Νέα ανάρτηση
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Load Error */}
        <AnimatePresence>
          {loadError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 mb-8 px-5 py-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Τα άρθρα δεν φορτώθηκαν</p>
                <p className="text-red-600/80 dark:text-red-400/80">{loadError}. Έλεγξε ότι τρέχει το backend.</p>
              </div>
              <button onClick={() => void fetchList()} className="ml-auto text-xs font-semibold underline underline-offset-2 hover:no-underline flex-shrink-0">
                Επανάληψη
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-24 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Φόρτωση άρθρων…</p>
          </div>
        ) : articles.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Δεν υπάρχουν αναρτήσεις ακόμα</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {showComposer
                  ? 'Πάτα «Νέα ανάρτηση» για να δημοσιεύσεις το πρώτο άρθρο.'
                  : 'Όταν η διαχείριση δημοσιεύσει κάτι, θα εμφανιστεί εδώ.'}
              </p>
            </div>
            {showComposer && (
              <button
                onClick={() => setComposeOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
              >
                <Plus className="w-4 h-4 inline -mt-0.5 mr-1.5" />
                Νέα ανάρτηση
              </button>
            )}
          </motion.div>
        ) : (
          /* Articles Grid */
          <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-5 sm:gap-6">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                isAdmin={Boolean(isAdmin)}
                onDelete={id => setDeleteTarget(id)}
                likedIds={likedIds}
                likingId={likingId}
                onLike={id => void handleLike(id)}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB (mobile) */}
      {showComposer && (
        <motion.button
          type="button"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', damping: 20 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setComposeOpen(true)}
          aria-label="Νέα ανάρτηση"
          className="
            fixed z-[73] bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4
            sm:hidden inline-flex items-center gap-2 px-4 py-3 rounded-2xl
            bg-slate-900 dark:bg-white text-white dark:text-slate-900
            text-sm font-bold shadow-xl touch-manipulation
          "
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          Ανάρτηση
        </motion.button>
      )}

      {/* Compose Modal */}
      <ComposeModal
        open={composeOpen && showComposer}
        onClose={() => setComposeOpen(false)}
        onPublished={article => {
          setArticles(prev => [article, ...prev]);
          showToast('Η ανάρτηση δημοσιεύτηκε επιτυχώς!');
        }}
        postWithCandidates={postWithCandidates}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        open={deleteTarget !== null}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticlesPage;