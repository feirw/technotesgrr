import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const BOT_WELCOME = 'Γεια! Είμαι ο βοηθός του technotesgr. Ρώτησέ με για σημειώσεις, quiz, flashcards ή οτιδήποτε σχετικό με ΑΕΠΠ. 😊';

const RULES = [
  { test: /σημειωσ|notes/i, reply: 'Οι σημειώσεις είναι εδώ 👉 /notes' },
  { test: /quiz|κουιζ/i, reply: 'Μπορείς να ξεκινήσεις Quiz από εδώ 👉 /quiz' },
  { test: /flashcards?|flash|καρτελ/i, reply: 'Οι Flashcards είναι διαθέσιμες εδώ 👉 /flashcards' },
  { test: /επικοινων|(contact|mail)/i, reply: 'Γράψε μας στη φόρμα στο κάτω μέρος της σελίδας ή στείλε DM στο Instagram @technotesgr.' },
  { test: /αεππ|πανελλαδικ/i, reply: 'Καλύπτουμε πλήρως την ύλη της ΑΕΠΠ με σημειώσεις + quiz ανά κεφάλαιο. Θες να σου προτείνω σειρά μελέτης;' },
];

function localBotReply(message) {
  for (const r of RULES) if (r.test.test(message)) return r.reply;
  return 'Δεν ξέρω την απάντηση. Δοκίμασε να ρωτήσεις κάτι άλλο!';
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
    if (open) setTimeout(() => textareaRef.current?.focus(), 100);
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
      const content = nickname ? reply.replaceAll('{name}', nickname) : reply.replaceAll('{name}', 'φίλε/φίλη');
      setMessages((prev) => [...prev, { role: 'bot', content, ts: Date.now() }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Ωχ! Κάτι πήγε στραβά. Δοκίμασε ξανά.', ts: Date.now() }]);
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
      {/* Floating Button */}
      <motion.button onClick={() => setOpen((v) => !v)} className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl p-4" style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }} whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} animate={open ? {} : { y: [0, -10, 0] }} transition={open ? {} : { duration: 2, repeat: Infinity }}>
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-md rounded-3xl shadow-2xl overflow-hidden bg-white" style={{ border: `3px solid ${BRAND}`, height: '70vh' }} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300 }}>
            
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Ψηφιακός Βοηθός</h3>
                    <div className="flex items-center gap-2 text-xs text-pink-100">
                      <motion.div className="w-2 h-2 rounded-full bg-green-400" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                      Online
                    </div>
                  </div>
                </div>
                <motion.button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-white/20 transition-colors" whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-pink-50 to-rose-50" style={{ height: 'calc(70vh - 180px)' }}>
              {messages.map((m, i) => (
                <motion.div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className={`flex items-end gap-2 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-gradient-to-br from-pink-400 to-rose-400' : 'bg-white border-2 border-pink-300'}`}>
                      {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-pink-600" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 shadow-lg ${m.role === 'user' ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white' : 'bg-white text-gray-800'}`}>
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {sending && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-pink-300 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-lg">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} className="w-2 h-2 rounded-full bg-pink-400" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t-2 border-pink-200">
              <div className="flex items-end gap-2">
                <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} rows={1} placeholder="Γράψε εδώ..." className="flex-1 resize-none rounded-xl border-2 border-pink-200 px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200" />
                <motion.button onClick={send} disabled={!input.trim() || sending} className="rounded-xl p-3 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}