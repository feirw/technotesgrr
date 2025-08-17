import React, { useEffect, useRef, useState } from 'react';

const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:8001').replace(/\/+$/, '');

const BOT_WELCOME =
  'Γεια! Είμαι ο βοηθός του technotesgr. Ρώτησέ με για σημειώσεις, quiz, flashcards ή οτιδήποτε σχετικό με ΑΕΠΠ. 😊';

const RULES = [
  { test: /σημειωσ|notes/i, reply: 'Οι σημειώσεις είναι εδώ 👉 /notes' },
  { test: /quiz|κουιζ/i, reply: 'Μπορείς να ξεκινήσεις Quiz από εδώ 👉 /quiz' },
  { test: /flashcards?|flash|καρτελ/i, reply: 'Οι Flashcards είναι διαθέσιμες εδώ 👉 /flashcards' },
  {
    test: /επικοινων|(contact|mail)/i,
    reply: 'Γράψε μας στη φόρμα στο κάτω μέρος της σελίδας ή στείλε DM στο Instagram @technotesgr.',
  },
  {
    test: /αεππ|πανελλαδικ/i,
    reply:
      'Καλύπτουμε πλήρως την ύλη της ΑΕΠΠ με σημειώσεις + quiz ανά κεφάλαιο. Θες να σου προτείνω σειρά μελέτης;',
  },
];

function localBotReply(message) {
  for (const r of RULES) if (r.test.test(message)) return r.reply;
  return 'Ναι δεν ξερω τι να πω. Δοκίμασε να ρωτήσεις κάτι άλλο ή να είσαι πιο συγκεκριμένος.';
}

async function fetchBotReply(message) {
  await new Promise((r) => setTimeout(r, 800));
  return localBotReply(message);
}

export default function ChatWidget({ nickname }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', content: BOT_WELCOME, ts: Date.now() }]);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    const me = { role: 'user', content: text, ts: Date.now() };
    setMessages((prev) => [...prev, me]);
    setSending(true);
    try {
      const reply = await fetchBotReply(text);
      const content = nickname
        ? reply.replaceAll('{name}', nickname)
        : reply.replaceAll('{name}', 'φίλε/φίλη');
      setMessages((prev) => [...prev, { role: 'bot', content, ts: Date.now() }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Ωχ! Κάτι πήγε στραβά. Δοκίμασε ξανά σε λίγο.', ts: Date.now() },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-80 rounded-full bg-[#feabab] text-black shadow-lg hover:shadow-xl px-4 py-3 font-semibold ring-1 ring-black/10 transition hover:bg-[#ff7b7b] focus:outline-none focus:ring-2 focus:ring-[#feabab]"
        aria-expanded={open}
        aria-controls="chat-widget"
      >
        {open ? 'Κλείσιμο ✖' : 'Chat 💬'}
      </button>

      {/* Panel */}
      {open && (
        <div
          id="chat-widget"
          className="fixed bottom-20 right-5 z-50 w-[90vw] max-w-md h-[70vh] rounded-2xl bg-white/90 dark:bg-[#111]/90 backdrop-blur shadow-2xl ring-1 ring-[#ffdada] flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Chat technotesgr"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#ffd1d1] to-white dark:from-[#222] dark:to-[#111] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <strong>Ψηφιακός Βοηθός</strong>
            </div>
            <button onClick={() => setOpen(false)} className="text-sm opacity-70 hover:opacity-100">
              Κλείσιμο
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                  max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm
                  ${
                    m.role === 'user'
                      ? 'bg-[#feabab] text-black shadow'
                      : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-100 ring-1 ring-[#ffdada]'
                  }
                `}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#1a1a1a] ring-1 ring-[#ffdada] rounded-2xl px-3 py-2">
                  <span className="typing-dots inline-flex items-center gap-1">
                    <i className="dot" />
                    <i className="dot" />
                    <i className="dot" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#ffdada] bg-white/70 dark:bg-[#141414]/80 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Γράψε εδώ…"
                className="flex-1 resize-none rounded-lg border border-[#ffdada] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#feabab] bg-white dark:bg-[#101010]"
              />
              <button
                onClick={send}
                disabled={!input.trim() || sending}
                className="rounded-lg bg-[#feabab] text-black px-4 py-2 font-semibold shadow hover:shadow-md disabled:opacity-60"
              >
                Αποστολή
              </button>
            </div>
          </div>
        </div>
      )}

      {/* local styles for typing dots */}
      <style>{`
        .typing-dots .dot {
          width: 6px; height: 6px; border-radius: 9999px; background: #888;
          display: inline-block; animation: bounce 1s infinite;
        }
        .typing-dots .dot:nth-child(2) { animation-delay: .2s; }
        .typing-dots .dot:nth-child(3) { animation-delay: .4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .3; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
