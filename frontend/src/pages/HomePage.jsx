import React, { useCallback, useEffect, useId, useMemo, useRef, useState, Suspense } from 'react';
import { useAppContext } from '../contexts/AppContext';
import technotesLogo from '../assets/technotes_logo.png';
import ChatWidget from '../components/ChatWidget.jsx';
import { motion, useScroll, useTransform, MotionConfig, AnimatePresence } from 'motion/react';

// Lazy-load βαρύτερα components
const SliderCard = React.lazy(() => import('../components/SliderCard.jsx'));

// .env: VITE_API_URL=https://api.technotes.gr
const BACKEND_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:8001').replace(/\/+$/, '');

// ---------- Mock data ----------
const reviewsData = [
  {
    name: 'Μαρία Π.',
    rating: 5,
    description:
      'Οι σημειώσεις είναι εξαιρετικές! Με βοήθησαν πάρα πολύ να κατανοήσω την ύλη της πληροφορικής. Το quiz είναι διασκεδαστικό και εκπαιδευτικό!',
  },
  {
    name: 'Γιάννης Κ.',
    rating: 5,
    description:
      'Φανταστικό site! Οι flashcards με βοήθησαν να επαναλάβω γρήγορα όλες τις έννοιες. Τώρα νιώθω πιο σίγουρος για τις πανελλαδικές!',
  },
  {
    name: 'Ελένη Σ.',
    rating: 4,
    description:
      'Πολύ καλή πλατφόρμα για προετοιμασία! Οι οπτικοποιήσεις των αλγορίθμων είναι πολύ χρήσιμες. Συνιστώ ανεπιφύλακτα!',
  },
  {
    name: 'Νίκος Α.',
    rating: 5,
    description: 'Οι ερωτήσεις είναι πολύ καλά δομημένες και με προετοιμάζουν σωστά.',
  },
  {
    name: 'Αγγελική Β.',
    rating: 5,
    description:
      'Εξαιρετικό εργαλείο μελέτης! Τα παιχνίδια οπτικοποίησης με βοήθησαν να καταλάβω καλύτερα τους αλγορίθμους. Ευχαριστώ πολύ!',
  },
];

const featuresData = [
  { title: 'Σημειώσεις', desc: 'Καλύπτουν σε βάθος τη θεωρία και μεθοδολογίες της ύλης.' },
  {
    title: 'Quiz',
    desc: 'Δοκίμασε γνώσεις με έξυπνα, στοχευμένα ερωτήματα τα οποία έχουν εξεταστεί σε προηγούμενες Πανελλήνιες εξετάσεις.',
  },
  { title: 'Flashcards', desc: 'Γρήγορη επανάληψη σε όλες τις έννοιες του σχολικού βιβλίου.' },
];

// ---------- Motion helpers ----------
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// ---------- Small UI helpers ----------
const Section = ({ id, title, subtitle, className = '', children }) => (
  <section id={id} className={`py-16 ${className}`}>
    <div className="container mx-auto px-6">
      {title && (
        <header className="text-center mb-12">
          <motion.h2
            className="text-3xl font-extrabold tracking-tight"
            {...fadeInUp}
            transition={{ type: 'spring', stiffness: 100, damping: 14 }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              className="text-gray-600 dark:text-gray-300 mt-2"
              {...fadeIn}
              transition={{ duration: 0.45 }}
            >
              {subtitle}
            </motion.p>
          )}
        </header>
      )}
      {children}
    </div>
  </section>
);

const FeatureCard = ({ title, desc, i }) => (
  <motion.article
    className="group bg-white/70 dark:bg-[#1f1f1f]/70 backdrop-blur rounded-xl shadow-md p-6 text-center transition-all duration-300 ring-1 ring-transparent hover:ring-[#feabab]/50"
    aria-label={title}
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ type: 'spring', stiffness: 120, damping: 14, delay: i * 0.04 }}
    whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}
    layout
  >
    <motion.h3
      className="text-xl font-semibold mb-2"
      whileHover={{ color: '#ff7b7b' }}
      transition={{ duration: 0.2 }}
    >
      {title}
    </motion.h3>
    <p className="text-gray-700 dark:text-gray-300">{desc}</p>
  </motion.article>
);

const StarRating = ({ value = 0 }) => {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex justify-center" aria-label={`Βαθμολογία ${clamped} από 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className={`text-xl ${i < clamped ? 'text-yellow-400' : 'text-gray-300'}`}
          aria-hidden="true"
          initial={{ scale: 0, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: i * 0.06 }}
        >
          ★
        </motion.span>
      ))}
      <span className="sr-only">{clamped}/5</span>
    </div>
  );
};

// ---------- Page ----------
const HomePage = () => {
  const { nickname } = useAppContext();

  // Scroll progress bar (linked scroll animation)
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    website: '',
  }); // website = honeypot
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const abortRef = useRef(null);

  const firstId = useId();
  const lastId = useId();
  const emailId = useId();
  const msgId = useId();
  const successId = useId();
  const errorId = useId();

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleContactInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    if (contactForm.website) return 'Spam detected.'; // honeypot
    if (!contactForm.firstName.trim() || !contactForm.email.trim() || !contactForm.message.trim())
      return 'Συμπλήρωσε όνομα, email και μήνυμα.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email))
      return 'Το email δεν φαίνεται έγκυρο.';
    return null;
  }, [contactForm]);

  const handleContactSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setContactError('');
      const err = validate();
      if (err) {
        setContactError(err);
        return;
      }

      setContactSubmitting(true);
      abortRef.current?.abort?.();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${BACKEND_URL}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: contactForm.firstName.trim(),
            lastName: contactForm.lastName.trim(),
            email: contactForm.email.trim(),
            message: contactForm.message.trim(),
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await res.json().catch(() => ({}));

        setContactSuccess(true);
        setContactForm({ firstName: '', lastName: '', email: '', message: '', website: '' });
        setTimeout(() => setContactSuccess(false), 4500);
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('Error submitting contact form:', error);
          setContactError('Υπήρξε πρόβλημα κατά την αποστολή. Δοκίμασε ξανά.');
        }
      } finally {
        setContactSubmitting(false);
      }
    },
    [contactForm, validate]
  );

  useEffect(() => () => abortRef.current?.abort?.(), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#fff6f6] text-gray-800 dark:bg-[#0f0f0f] dark:text-gray-100">
        {/* Scroll progress */}
        <motion.div
          style={{ scaleX }}
          className="fixed left-0 top-0 h-1 w-full origin-left bg-[#ff7b7b] z-[60]"
          aria-hidden
        />

        {/* Hero */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-[#feabab] via-[#ffc3c3] to-[#ffdede] text-gray-900 dark:from-[#8a3a3a] dark:via-[#b85c5c] dark:to-[#cc7a7a]"
          aria-labelledby="site-hero-title"
        >
          {/* Διακοσμητικά blobs */}
          <motion.div
            className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/30 blur-3xl"
            animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/20 blur-3xl"
            animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Pattern overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative py-20 sm:py-24">
            <div className="container mx-auto max-w-6xl px-6 text-center">
              {/* Logo + Badge */}
              {/*
              <motion.div className="mb-6 flex items-center justify-center gap-3" {...fadeInUp}>
                <img
                  src={technotesLogo}
                  alt="Technotesgr"
                  className="h-20 w-20 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
              */}

              {/* Τίτλος */}
              <motion.h1
                id="site-hero-title"
                className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <motion.span
                  className="block text-[#00000]/80 mt-1 sm:mt-2"
                  variants={fadeInUp}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  Γράψε 100 στην Πληροφορική
                </motion.span>
              </motion.h1>

              {/* Υπότιτλος / Προσωποποίηση */}
              <motion.p
                className="mx-auto mt-4 max-w-2xl text-base sm:text-lg opacity-90"
                {...fadeIn}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {nickname ? (
                  <>
                    Καλώς ήρθες ξανά, <span className="font-semibold">{nickname}</span>!
                  </>
                ) : (
                  <>Πληροφορική Γ&apos; Γενικού Λυκείου</>
                )}
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="mt-8 flex flex-wrap items-center justify-center gap-3"
                {...fadeInUp}
                transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.15 }}
              >
                <motion.a
                  href="/notes"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 shadow-sm ring-1 ring-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Δες τις Σημειώσεις
                </motion.a>
                <motion.a
                  href="/quiz"
                  className="inline-flex items-center justify-center rounded-xl bg-black/10 px-6 py-3 font-semibold text-gray-900 ring-1 ring-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Ξεκίνα Quiz
                </motion.a>
              </motion.div>

              {/* Social proof */}
              <motion.div
                className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 text-sm text-gray-800/90 sm:grid-cols-3"
                variants={stagger}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`rounded-lg bg-white/60 p-3 ring-1 ring-[#ffdada] ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
                    variants={fadeInUp}
                    transition={{ type: 'spring', stiffness: 110, damping: 16, delay: i * 0.05 }}
                    whileHover={{ y: -3 }}
                    layout
                  >
                    {i === 0 && (
                      <>
                        <strong className="block text-lg">+5,000</strong>
                        μαθητές μας εμπιστεύτηκαν
                      </>
                    )}
                    {i === 1 && (
                      <>
                        <strong className="block text-lg">100%</strong>
                        δωρεάν πλατφόρμα
                      </>
                    )}
                    {i === 2 && (
                      <>
                        <strong className="block text-lg">Quiz</strong>
                        με απαντήσεις για να ελέγξεις τις γνώσεις σου
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <Section
          id="features"
          title="Τι προσφέρουμε"
          subtitle="Υλικό προσαρμοσμένο στην ύλη, με έμφαση στην κατανόηση."
        >
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {featuresData.map((f, i) => (
              <FeatureCard key={i} title={f.title} desc={f.desc} i={i} />
            ))}
          </motion.div>
        </Section>

        {/* FAQ (placeholder) */}
        <Section id="faq" title="FAQ">
          <motion.div
            className="max-w-3xl mx-auto bg-white/80 dark:bg-white/10 backdrop-blur p-6 rounded-xl shadow ring-1 ring-[#ffdada]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 110, damping: 16 }}
          >
            {/* Πρόσθεσε εδώ Accordion Q&A */}
            <motion.p
              className="text-gray-700 font-bold dark:text-gray-300 hover:underline hover:text-[#ff4d4d] font-medium cursor-pointer"
              whileHover={{ x: 2 }}
            >
              1. Είναι δωρεάν τα quiz, τα flashcards και οι σημειώσεις;
            </motion.p>
            <motion.p {...fadeIn} transition={{ duration: 0.3 }}>
              Ναι, όλα τα εργαλεία μας είναι εντελώς δωρεάν για όλους τους μαθητές.
            </motion.p>
            <motion.p
              className="mt-4 text-gray-700 font-bold dark:text-gray-300 hover:underline hover:text-[#ff4d4d] font-medium cursor-pointer"
              whileHover={{ x: 2 }}
            >
              2. Τι να κάνω αν έχω και άλλες απορίες;
            </motion.p>
            <motion.p {...fadeIn} transition={{ duration: 0.3 }}>
              Μπορείς να μας στείλεις μήνυμα μέσω της φόρμας επικοινωνίας παρακάτω ή να μας
              ακολουθήσεις στα social media για άμεσες απαντήσεις.
            </motion.p>
          </motion.div>
        </Section>

        {/* Reviews */}
        <Section id="reviews" title="Τι λένε οι μαθητές μας">
          <Suspense
            fallback={
              <div className="mx-auto max-w-4xl bg-white/60 rounded-xl ring-1 ring-[#ffdada] p-8 text-center">
                Φόρτωση κριτικών…
              </div>
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: 'spring', stiffness: 110, damping: 16 }}
            >
              <SliderCard
                title=""
                data={reviewsData}
                containerClassName="bg-white/60 backdrop-blur-xl rounded-xl ring-1 ring-[#ffdada] p-4"
                sliderSettings={{
                  autoplaySpeed: 4000,
                  pauseOnHover: true,
                  arrows: false,
                  dots: true,
                }}
                renderCard={(review) => (
                  <motion.article
                    className="bg-[#fff2f2] rounded-xl p-6 sm:p-8 text-center h-full flex flex-col justify-between shadow-sm ring-1 ring-[#ffdada]"
                    aria-label={`Αξιολόγηση από ${review.name}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                    layout
                  >
                    <header className="mb-4">
                      <StarRating value={review.rating} />
                      <h3 className="text-lg font-semibold mt-2">{review.name}</h3>
                    </header>
                    <p className="text-gray-700 italic leading-relaxed">“{review.description}”</p>
                  </motion.article>
                )}
              />
            </motion.div>
          </Suspense>
        </Section>

        {/* Contact */}
        <Section
          id="contact"
          title="Επικοινωνία"
          subtitle="Έχεις απορία ή πρόταση; Στείλε μας μήνυμα!"
        >
          <motion.form
            onSubmit={handleContactSubmit}
            className="max-w-3xl mx-auto bg-white/80 dark:bg-white/10 backdrop-blur p-6 rounded-xl shadow ring-1 ring-[#ffdada]"
            noValidate
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 110, damping: 16 }}
            layout
          >
            {/* Live regions */}
            <div role="status" aria-live="polite" id={successId} className="sr-only">
              {contactSuccess ? 'Το μήνυμα στάλθηκε!' : ''}
            </div>
            <div role="alert" aria-live="assertive" id={errorId} className="sr-only">
              {contactError || ''}
            </div>

            <AnimatePresence>
              {contactSuccess && (
                <motion.div
                  className="mb-4 rounded-lg bg-green-50 text-green-800 px-4 py-3 text-sm"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  ✅ Το μήνυμα στάλθηκε! Θα σου απαντήσουμε σύντομα.
                </motion.div>
              )}
              {contactError && (
                <motion.div
                  className="mb-4 rounded-lg bg-red-50 text-red-800 px-4 py-3 text-sm"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  ⚠️ {contactError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={contactForm.website}
              onChange={handleContactInputChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={firstId} className="block text-sm font-medium mb-1">
                  Όνομα *
                </label>
                <motion.input
                  id={firstId}
                  name="firstName"
                  value={contactForm.firstName}
                  onChange={handleContactInputChange}
                  required
                  autoComplete="given-name"
                  aria-invalid={!!contactError && !contactForm.firstName.trim()}
                  aria-describedby={contactError ? errorId : undefined}
                  className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab]"
                  placeholder="π.χ. Μαρία"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <div>
                <label htmlFor={lastId} className="block text-sm font-medium mb-1">
                  Επώνυμο
                </label>
                <motion.input
                  id={lastId}
                  name="lastName"
                  value={contactForm.lastName}
                  onChange={handleContactInputChange}
                  autoComplete="family-name"
                  className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab]"
                  placeholder="π.χ. Παπαδοπούλου"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor={emailId} className="block text-sm font-medium mb-1">
                Email *
              </label>
              <motion.input
                id={emailId}
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactInputChange}
                required
                inputMode="email"
                autoComplete="email"
                aria-invalid={
                  !!contactError && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)
                }
                aria-describedby={contactError ? errorId : undefined}
                className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab]"
                placeholder="name@example.com"
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="mt-4">
              <label htmlFor={msgId} className="block text-sm font-medium mb-1">
                Μήνυμα *
              </label>
              <motion.textarea
                id={msgId}
                name="message"
                rows={5}
                value={contactForm.message}
                onChange={handleContactInputChange}
                required
                aria-invalid={!!contactError && !contactForm.message.trim()}
                aria-describedby={contactError ? errorId : undefined}
                className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab] resize-y"
                placeholder="Γράψε εδώ την απορία/πρότασή σου…"
                whileFocus={{ scale: 1.005 }}
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <motion.button
                type="submit"
                disabled={contactSubmitting}
                aria-busy={contactSubmitting}
                className="px-6 py-3 rounded-lg font-semibold text-black bg-[#feabab] shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              >
                {contactSubmitting ? 'Αποστολή…' : 'Αποστολή'}
              </motion.button>
              <p className="text-xs text-gray-500">* Υποχρεωτικά πεδία</p>
            </div>
          </motion.form>
        </Section>

        <ChatWidget nickname={nickname} />

        {/* Footer */}
        <footer className="bg-gradient-to-l from-[#ff7b7b] via-red-200 to-white-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-[#ffdada] mt-8">
          <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <motion.div {...fadeIn}>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                Σχετικά με εμάς 🎓
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Το <strong>technotesgr</strong> βοηθά μαθητές Γ’ Λυκείου να προετοιμαστούν
                αποτελεσματικά για τις Πανελλαδικές Πληροφορικής — σημειώσεις, quiz & διαδραστικά
                εργαλεία.
              </p>
            </motion.div>

            <nav aria-label="Γρήγοροι σύνδεσμοι">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                Γρήγοροι Σύνδεσμοι
              </h3>
              <motion.ul
                className="space-y-2 text-sm"
                variants={stagger}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  { href: '/notes', label: '📚 Σημειώσεις' },
                  { href: '/quiz', label: '🎯 Quiz' },
                  { href: '/flashcards', label: '🧠 Flashcards' },
                  {
                    href: 'https://evripides.mysch.gr/dave/',
                    label: '💻 Algorithms Games',
                    external: true,
                  },
                ].map((item, idx) => (
                  <motion.li key={item.href} variants={fadeInUp}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="text-gray-600 dark:text-gray-300 hover:text-[#ff7b7b] transition"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <motion.div {...fadeIn}>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                Επικοινωνία
              </h3>
              <div className="space-y-2 text-sm">
                <a
                  href="https://www.instagram.com/technotesgr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-[#ff4d4d] font-medium"
                >
                  Instagram: @technotesgr
                </a>
                <br />
                <a
                  href="https://www.tiktok.com/@technotesgr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-[#ff4d4d] font-medium"
                >
                  TikTok: @technotesgr
                </a>
              </div>
            </motion.div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center mt-8 mb-4">
            Όροι και Δεδομένα
          </h3>
          <div className="space-y-2 text-sm" />
          <div className="text-center">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-[#ff4d4d] font-medium"
            >
              Όροι χρήσης και Πολιτική Απορρήτου
            </a>
            <br />
            <a
              href="/data"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-[#ff4d4d] font-medium"
            >
              Προσωπικά Δεδομένα
            </a>
          </div>

          {/* */}
          <div className="bg-white/60 dark:bg-white/10 backdrop-blur py-4 border-t border-[#ffdada] mt-6">
            <div className="container mx-auto px-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© {currentYear} technotesgr. All rights reserved.</p>
              <p className="mt-1">Made with ♡ by feirw, areynbaw and deathwish</p>
            </div>
          </div>
        </footer>

        {/* Προαιρετικό JSON-LD για SEO */}
      </div>
    </MotionConfig>
  );
};

export default HomePage;
