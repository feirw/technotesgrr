import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

const BRAND      = '#fda8a9';
const BRAND_DARK = '#f88b8c';

// FIX #1: Read from env var so it works in every environment.
// In your .env file: VITE_BACKEND_URL=http://localhost:8001
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8001';

const BOT_WELCOME =
  'Γεια! Είμαι ο βοηθός του TechNotesGR. Ρώτησέ με για σημειώσεις, quiz, flashcards ή οτιδήποτε σχετικό με ΑΕΠΠ. 😊';

const MAX_RETRIES = 2;

// ─── API helper ───────────────────────────────────────────────────────────────

// FIX #2: The original code called `/api/` (wrong path). Correct path is `/api/chat`.
async function fetchBotReply(message: string, retries = 0): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // FIX #3: send timeout signal so we don't hang indefinitely
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      // Try to surface the server's error message when available
      const errorBody = await response.json().catch(() => ({}));
      const detail = errorBody?.detail ?? `HTTP ${response.status}`;
      throw new Error(detail);
    }

    const data = await response.json();

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
      return fetchBotReply(message, retries + 1);
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
      a:  ({ ...props }) => (
        <a className="text-pink-600 underline hover:text-pink-400" target="_blank" rel="noreferrer" {...props} />
      ),
      p:  ({ ...props }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed" {...props} />,
      code: ({ ...props }) => (
        <code className="bg-pink-50 text-pink-700 rounded px-1 py-0.5 text-xs font-mono" {...props} />
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
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: BOT_WELCOME, ts: Date.now() },
  ]);

  const listRef     = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when panel opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  // FIX #5: personalise nickname substitution safely
  const personalise = useCallback(
    (text: string) =>
      text.replace(/\{name\}/g, nickname?.trim() || 'φίλε/φίλη'),
    [nickname],
  );

  const appendMessage = (msg: Omit<Message, 'ts'>) =>
    setMessages((prev) => [...prev, { ...msg, ts: Date.now() }]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    appendMessage({ role: 'user', content: text });
    setSending(true);

    try {
      const raw = await fetchBotReply(text);
      appendMessage({ role: 'bot', content: personalise(raw) });
    } catch (err: unknown) {
      console.error('[Widget] AI error:', err);
      const detail =
        err instanceof Error ? err.message : 'Άγνωστο σφάλμα';
      appendMessage({
        role: 'error',
        content: `⚠️ Δεν μπόρεσα να λάβω απάντηση. ${detail}`,
      });
    } finally {
      setSending(false);
    }
  }, [input, sending, personalise]);

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
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300"
        style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={open ? {} : { y: [0, -8, 0] }}
        transition={open ? {} : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {open
          ? <X             className="w-6 h-6 text-white" />
          : <MessageCircle className="w-6 h-6 text-white" />
        }
      </motion.button>

      {/* ── Chat Panel ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chatbot βοηθός"
            className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-md rounded-3xl shadow-2xl overflow-hidden bg-white flex flex-col"
            style={{ border: `3px solid ${BRAND}`, height: '70vh', maxHeight: '600px' }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between">
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

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-pink-50 to-rose-50"
            >
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
                        {m.role === 'user'
                          ? <User className="w-4 h-4 text-white" />
                          : <Bot  className="w-4 h-4 text-pink-600" />
                        }
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
              <AnimatePresence>
                {sending && <TypingIndicator />}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t-2 border-pink-100 flex-shrink-0">
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
                  className="flex-1 resize-none rounded-xl border-2 border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:opacity-60 transition-colors"
                  style={{ minHeight: '42px', maxHeight: '120px' }}
                />
                <motion.button
                  aria-label="Αποστολή"
                  onClick={send}
                  disabled={!canSend}
                  className="rounded-xl p-2.5 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
                  whileHover={canSend ? { scale: 1.08 } : {}}
                  whileTap={canSend  ? { scale: 0.93 } : {}}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 pl-1">
                Shift+Enter για νέα γραμμή
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Widget;