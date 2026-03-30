import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, AlertCircle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { apiFetch } from '@/utils/apiClient';
import { getBackendUrl } from '@/utils/backendUrl';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WidgetProps {
  nickname?: string;
}

interface Message {
  role: 'bot' | 'user' | 'error';
  content: string;
  ts: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

// FIX #1: Read from env var so it works in every environment.
// In your .env file: VITE_BACKEND_URL=http://localhost:8001
const BACKEND_URL = getBackendUrl();

const BOT_WELCOME =
  'Γεια! Είμαι ο βοηθός του TechNotesGR. Ρώτησέ με για σημειώσεις, quiz, flashcards ή οτιδήποτε σχετικό με ΑΕΠΠ. 😊';
const CHAT_STORAGE_KEY = 'chatWidgetMessages:v1';
const CHAT_SESSION_KEY = 'chatWidgetSessionId:v1';
const QUICK_PROMPTS = [
  'Δώσε μου σύντομη επανάληψη για στοίβα και ουρά.',
  'Πώς να διαβάσω αποτελεσματικά για ΑΕΠΠ σε 7 ημέρες;',
  'Φτιάξε μου 5 ερωτήσεις quiz για αλγορίθμους.',
];

const MAX_RETRIES = 2;

// ─── API helper ───────────────────────────────────────────────────────────────

// FIX #2: The original code called `/api/` (wrong path). Correct path is `/api/chat`.
async function fetchBotReply(message: string, sessionId: string, retries = 0): Promise<string> {
  try {
    const data = await apiFetch<{ reply: string }>(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeoutMs: 15_000,
      retries: 0,
      body: JSON.stringify({ message, session_id: sessionId }),
    });

    // FIX #4: validate that the field we expect actually exists
    if (typeof data?.reply !== 'string') {
      throw new Error('Unexpected response format from server.');
    }

    return data.reply;
  } catch (err: unknown) {
    // Retry on network errors (not on 4xx/5xx)
    const isNetworkError =
      err instanceof TypeError || (err instanceof DOMException && err.name === 'TimeoutError');

    if (isNetworkError && retries < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 800 * (retries + 1)));
      return fetchBotReply(message, sessionId, retries + 1);
    }

    throw err;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const BotMessageContent: React.FC<{ content: string }> = ({ content }) => (
  <ReactMarkdown
    components={{
      ul: ({ ...props }) => <ul className="list-disc ml-5 space-y-1" {...props} />,
      ol: ({ ...props }) => <ol className="list-decimal ml-5 space-y-1" {...props} />,
      a: ({ ...props }) => (
        <a
          className="text-pink-600 underline hover:text-pink-400"
          target="_blank"
          rel="noreferrer"
          {...props}
        />
      ),
      p: ({ ...props }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed" {...props} />,
      code: ({ ...props }) => (
        <code
          className="bg-pink-50 text-pink-700 rounded px-1 py-0.5 text-xs font-mono"
          {...props}
        />
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const TypingIndicator: React.FC = () => (
  <motion.div
    className="flex justify-start"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 rounded-full bg-white border-2 border-pink-300 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-pink-600" />
      </div>
      <div className="bg-white rounded-2xl px-4 py-3 shadow-lg">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-pink-400"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Main Widget ──────────────────────────────────────────────────────────────

const Widget: React.FC<WidgetProps> = ({ nickname }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false
  );
  const [viewportHeight, setViewportHeight] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Message[]) : null;
      if (parsed && parsed.length) return parsed;
    } catch {
      // ignore and use fallback
    }
    return [{ role: 'bot', content: BOT_WELCOME, ts: Date.now() }];
  });
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem(CHAT_SESSION_KEY);
    if (stored) return stored;
    const generated = crypto.randomUUID();
    localStorage.setItem(CHAT_SESSION_KEY, generated);
    return generated;
  });

  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when panel opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Keep mobile/layout measurements in sync (orientation change, keyboard resize).
  useEffect(() => {
    const onResize = () => {
      setViewportHeight(window.innerHeight);
      setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent background scroll when chat is open on mobile.
  useEffect(() => {
    if (!open || !isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isMobile]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-60)));
  }, [messages]);

  // FIX #5: personalise nickname substitution safely
  const personalise = useCallback(
    (text: string) => text.replace(/\{name\}/g, nickname?.trim() || 'φίλε/φίλη'),
    [nickname]
  );

  const appendMessage = (msg: Omit<Message, 'ts'>) =>
    setMessages((prev) => [...prev, { ...msg, ts: Date.now() }]);

  const send = useCallback(
    async (rawText?: string) => {
      const text = (rawText ?? input).trim();
      if (!text || sending) return;

      setInput('');
      appendMessage({ role: 'user', content: text });
      setSending(true);

      try {
        const raw = await fetchBotReply(text, sessionId);
        appendMessage({ role: 'bot', content: personalise(raw) });
      } catch (err: unknown) {
        console.error('[Widget] AI error:', err);
        const detail = err instanceof Error ? err.message : 'Άγνωστο σφάλμα';
        appendMessage({
          role: 'error',
          content: `⚠️ Δεν μπόρεσα να λάβω απάντηση. ${detail}`,
        });
      } finally {
        setSending(false);
      }
    },
    [input, sending, personalise, sessionId]
  );

  const clearConversation = () => {
    const initial = [{ role: 'bot' as const, content: BOT_WELCOME, ts: Date.now() }];
    setMessages(initial);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initial));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // FIX #6: auto-grow textarea (up to 5 rows)
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const canSend = input.trim().length > 0 && !sending;

  return (
    <>
      {/* ── Floating Button ───────────────────────────────────────────────── */}
      <motion.button
        aria-label={open ? 'Κλείσιμο chat' : 'Άνοιγμα chat'}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 sm:right-6 bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:bottom-6 z-[80] rounded-full shadow-2xl p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300"
        style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={open ? {} : { y: [0, -8, 0] }}
        transition={open ? {} : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* ── Chat Panel ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chatbot βοηθός"
            className="fixed z-[70] left-2 right-2 top-16 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] sm:left-auto sm:top-auto sm:bottom-24 sm:right-6 sm:w-[94vw] sm:max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden bg-white flex flex-col"
            style={{
              border: `3px solid ${BRAND}`,
              maxHeight: isMobile ? `${Math.max(420, viewportHeight - 96)}px` : '820px',
            }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Ψηφιακός Βοηθός</h3>
                    <div className="flex items-center gap-1.5 text-xs text-pink-100">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-green-400"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <motion.button
                    aria-label="Καθαρισμός συνομιλίας"
                    onClick={clearConversation}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    aria-label="Κλείσιμο"
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4 bg-gradient-to-br from-pink-50 to-rose-50"
            >
              {messages.length <= 2 && (
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => void send(prompt)}
                      className="text-xs bg-white border border-pink-200 rounded-full px-3 py-1.5 hover:bg-pink-50 text-pink-700"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div
                  key={`${m.ts}-${i}`}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Error message */}
                  {m.role === 'error' ? (
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2 border border-red-200">
                        {m.content}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`flex items-end gap-2 max-w-[85%] ${
                        m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          m.role === 'user'
                            ? 'bg-gradient-to-br from-pink-400 to-rose-400'
                            : 'bg-white border-2 border-pink-300'
                        }`}
                      >
                        {m.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-pink-600" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-md ${
                          m.role === 'user'
                            ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white'
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        {m.role === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        ) : (
                          <BotMessageContent content={m.content} />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>{sending && <TypingIndicator />}</AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white border-t-2 border-pink-100 flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Γράψε εδώ... (Enter για αποστολή)"
                  disabled={sending}
                  aria-label="Μήνυμα"
                  className="flex-1 resize-none rounded-xl border-2 border-pink-200 px-4 py-3 text-base focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:opacity-60 transition-colors"
                  style={{ minHeight: '48px', maxHeight: '160px' }}
                />
                <motion.button
                  aria-label="Αποστολή"
                  onClick={send}
                  disabled={!canSend}
                  className="rounded-xl p-3 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
                  whileHover={canSend ? { scale: 1.08 } : {}}
                  whileTap={canSend ? { scale: 0.93 } : {}}
                >
                  <Send className="w-6 h-6" />
                </motion.button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 pl-1">Shift+Enter για νέα γραμμή</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Widget;
