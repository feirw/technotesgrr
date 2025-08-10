import React, { useCallback, useEffect, useId, useMemo, useRef, useState, Suspense } from 'react';
import { useAppContext } from '../contexts/AppContext';
import technotesLogo from '../assets/technotes_logo.png';

// Lazy-load βαρύτερα components
const SliderCard = React.lazy(() => import('../components/SliderCard.jsx'));

// .env: VITE_API_URL=https://api.technotes.gr
const BACKEND_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:8001').replace(/\/+$/, '');

// ---------- Mock data ----------
const reviewsData = [
  { name: 'Μαρία Π.', rating: 5, description: 'Οι σημειώσεις είναι εξαιρετικές! Με βοήθησαν πάρα πολύ να κατανοήσω την ύλη της πληροφορικής. Το quiz είναι διασκεδαστικό και εκπαιδευτικό!' },
  { name: 'Γιάννης Κ.', rating: 5, description: 'Φανταστικό site! Οι flashcards με βοήθησαν να επαναλάβω γρήγορα όλες τις έννοιες. Τώρα νιώθω πιο σίγουρος για τις πανελλαδικές!' },
  { name: 'Ελένη Σ.', rating: 4, description: 'Πολύ καλή πλατφόρμα για προετοιμασία! Οι οπτικοποιήσεις των αλγορίθμων είναι πολύ χρήσιμες. Συνιστώ ανεπιφύλακτα!' },
  { name: 'Νίκος Α.', rating: 5, description: 'Οι ερωτήσεις είναι πολύ καλά δομημένες και με προετοιμάζουν σωστά.' },
  { name: 'Αγγελική Β.', rating: 5, description: 'Εξαιρετικό εργαλείο μελέτης! Τα παιχνίδια οπτικοποίησης με βοήθησαν να καταλάβω καλύτερα τους αλγορίθμους. Ευχαριστώ πολύ!' },
];

const featuresData = [
  { title: 'Σημειώσεις', desc: 'Καλύπτουν σε βάθος τη θεωρία και μεθοδολογίες της ύλης.' },
  { title: 'Quiz', desc: 'Δοκίμασε γνώσεις με έξυπνα, στοχευμένα ερωτήματα τα οποία έχουν εξεταστεί σε προηγούμενες Πανελλήνιες εξετάσεις.' },
  { title: 'Flashcards', desc: 'Γρήγορη επανάληψη σε όλες τις έννοιες του σχολικού βιβλίου.' },
];

// ---------- Small UI helpers ----------
const Section = ({ id, title, subtitle, className = '', children }) => (
  <section id={id} className={`py-16 ${className}`}>
    <div className="container mx-auto px-6">
      {title && (
        <header className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          {subtitle && <p className="text-gray-600 dark:text-gray-300 mt-2">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  </section>
);

const FeatureCard = ({ title, desc }) => (
  <article
    className="group bg-white/70 dark:bg-[#1f1f1f]/70 backdrop-blur rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ring-1 ring-transparent hover:ring-[#feabab]/50"
    aria-label={title}
  >
    <h3 className="text-xl font-semibold mb-2 group-hover:text-[#ff7b7b] transition-colors">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300">{desc}</p>
  </article>
);

const StarRating = ({ value = 0 }) => {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex justify-center" aria-label={`Βαθμολογία ${clamped} από 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-xl ${i < clamped ? 'text-yellow-400' : 'text-gray-300'}`} aria-hidden="true">★</span>
      ))}
      <span className="sr-only">{clamped}/5</span>
    </div>
  );
};

// ---------- Page ----------
const HomePage = () => {
  const { nickname } = useAppContext();

  // Contact form state
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', message: '', website: '' }); // website = honeypot
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
    if (!contactForm.firstName.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return 'Συμπλήρωσε όνομα, email και μήνυμα.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) return 'Το email δεν φαίνεται έγκυρο.';
    return null;
  }, [contactForm]);

  const handleContactSubmit = useCallback(async (e) => {
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
  }, [contactForm, validate]);

  useEffect(() => () => abortRef.current?.abort?.(), []);

  return (
    <div className="min-h-screen bg-[#fff6f6] text-gray-800 dark:bg-[#0f0f0f] dark:text-gray-100">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-[#feabab] via-[#ffc3c3] to-[#ffdede] text-gray-900 dark:from-[#8a3a3a] dark:via-[#b85c5c] dark:to-[#cc7a7a]"
        aria-labelledby="site-hero-title"
      >
        {/* Διακοσμητικά blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/20 blur-3xl" />

        {/* Pattern overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />

        <div className="relative py-20 sm:py-24">
          <div className="container mx-auto max-w-6xl px-6 text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
                <img
                  src={technotesLogo}
                    alt="Technotesgr"
                      className="h-24 w-24 object-contain"
                        loading="lazy"
                        decoding="async"
                  />
              
            </div>


            {/* Τίτλος */}
            <h1 id="site-hero-title" className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Technotesgr
              <span className="block text-[rgb(35,35,35)]/80 mt-1 sm:mt-2">
                Οι καλύτερες σημειώσεις για{' '}
                <span className="relative">
                  ΑΕΠΠ
                  <span className="absolute -bottom-1 left-0 h-2 w-full bg-yellow-300/80" />
                </span>{' '}
                – Πανελλαδικές
              </span>
            </h1>

            {/* Υπότιτλος / Προσωποποίηση */}
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg opacity-90">
              {nickname ? (
                <>Καλώς ήρθες ξανά, <span className="font-semibold">{nickname}</span>!</>
              ) : (
                <>Πληροφορική Γ&apos; Γενικού Λυκείου</>
              )}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/notes"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 shadow-sm ring-1 ring-black/5 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
              >
                Δες τις Σημειώσεις
              </a>
              <a
                href="/quiz"
                className="inline-flex items-center justify-center rounded-xl bg-black/10 px-6 py-3 font-semibold text-gray-900 ring-1 ring-black/10 transition hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              >
                Ξεκίνα Quiz
              </a>
            </div>

            {/* Social proof */}
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 text-sm text-gray-800/90 sm:grid-cols-3">
              <div className="rounded-lg bg-white/60 p-3 ring-1 ring-[#ffdada]">
                <strong className="block text-lg">+5,000</strong>
                μαθητές μας εμπιστεύτηκαν
              </div>
              <div className="rounded-lg bg-white/60 p-3 ring-1 ring-[#ffdada]">
                <strong className="block text-lg">100%</strong>
                δωρεάν πλατφόρμα
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-lg bg-white/60 p-3 ring-1 ring-[#ffdada]">
                <strong className="block text-lg">Quiz</strong>
                με απαντήσεις για να ελέγξεις τις γνώσεις σου
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section
        id="features"
        title="Τι προσφέρουμε"
        subtitle="Υλικό προσαρμοσμένο στην ύλη, με έμφαση στην κατανόηση."
      >
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((f, i) => (
            <FeatureCard key={i} title={f.title} desc={f.desc} />
          ))}
        </div>
      </Section>

      {/* FAQ (placeholder) */}
      <Section id="faq" title="FAQ">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-white/10 backdrop-blur p-6 rounded-xl shadow ring-1 ring-[#ffdada]">
          {/* Πρόσθεσε εδώ Accordion Q&A */}
        <p className="text-gray-700 font-bold dark:text-gray-300 hover:underline hover:text-[#ff4d4d] font-medium cursor-pointer">
            1. Είναι δωρεάν τα quiz,τα flashcard και οι σημειώσεις; </p>
            Ναι, όλα τα εργαλεία μας είναι εντελώς δωρεάν για όλους τους μαθητές. 
          <p className="text-gray-700 font-bold dark:text-gray-300 hover:underline hover:text-[#ff4d4d] font-medium cursor-pointer">
            2. Τι να κάνω αν έχω και άλλες απορίες; </p>
            Μπορείς να μας στείλεις μήνυμα μέσω της φόρμας επικοινωνίας παρακάτω ή να μας ακολουθήσεις στα social media για άμεσες απαντήσεις.
        </div>
      </Section>

      {/* Reviews */}
      <Section id="reviews" title="Τι λένε οι μαθητές μας">
        <Suspense fallback={
          <div className="mx-auto max-w-4xl bg-white/60 rounded-xl ring-1 ring-[#ffdada] p-8 text-center">
            Φόρτωση κριτικών…
          </div>
        }>
          <SliderCard
            title=""
            data={reviewsData}
            containerClassName="bg-white/60 backdrop-blur-xl rounded-xl ring-1 ring-[#ffdada] p-4"
            sliderSettings={{ autoplaySpeed: 4000, pauseOnHover: true, arrows: false, dots: true }}
            renderCard={(review) => (
              <article
                className="bg-[#fff2f2] rounded-xl p-6 sm:p-8 text-center h-full flex flex-col justify-between shadow-sm ring-1 ring-[#ffdada]"
                aria-label={`Αξιολόγηση από ${review.name}`}
              >
                <header className="mb-4">
                  <StarRating value={review.rating} />
                  <h3 className="text-lg font-semibold mt-2">{review.name}</h3>
                </header>
                <p className="text-gray-700 italic leading-relaxed">“{review.description}”</p>
              </article>
            )}
          />
        </Suspense>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Επικοινωνία" subtitle="Έχεις απορία ή πρόταση; Στείλε μας μήνυμα!">
        <form
          onSubmit={handleContactSubmit}
          className="max-w-3xl mx-auto bg-white/80 dark:bg-white/10 backdrop-blur p-6 rounded-xl shadow ring-1 ring-[#ffdada]"
          noValidate
        >
          {/* Live regions */}
          <div role="status" aria-live="polite" id={successId} className="sr-only">{contactSuccess ? 'Το μήνυμα στάλθηκε!' : ''}</div>
          <div role="alert" aria-live="assertive" id={errorId} className="sr-only">{contactError || ''}</div>

          {contactSuccess && (
            <div className="mb-4 rounded-lg bg-green-50 text-green-800 px-4 py-3 text-sm">
              ✅ Το μήνυμα στάλθηκε! Θα σου απαντήσουμε σύντομα.
            </div>
          )}
          {contactError && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-800 px-4 py-3 text-sm">
              ⚠️ {contactError}
            </div>
          )}

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
              <label htmlFor={firstId} className="block text-sm font-medium mb-1">Όνομα *</label>
              <input
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
              />
            </div>
            <div>
              <label htmlFor={lastId} className="block text-sm font-medium mb-1">Επώνυμο</label>
              <input
                id={lastId}
                name="lastName"
                value={contactForm.lastName}
                onChange={handleContactInputChange}
                autoComplete="family-name"
                className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab]"
                placeholder="π.χ. Παπαδοπούλου"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor={emailId} className="block text-sm font-medium mb-1">Email *</label>
            <input
              id={emailId}
              name="email"
              type="email"
              value={contactForm.email}
              onChange={handleContactInputChange}
              required
              inputMode="email"
              autoComplete="email"
              aria-invalid={!!contactError && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)}
              aria-describedby={contactError ? errorId : undefined}
              className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab]"
              placeholder="name@example.com"
            />
          </div>

          <div className="mt-4">
            <label htmlFor={msgId} className="block text-sm font-medium mb-1">Μήνυμα *</label>
            <textarea
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
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={contactSubmitting}
              aria-busy={contactSubmitting}
              className="px-6 py-3 rounded-lg font-semibold text-black bg-[#feabab] shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {contactSubmitting ? 'Αποστολή…' : 'Αποστολή'}
            </button>
            <p className="text-xs text-gray-500">* Υποχρεωτικά πεδία</p>
          </div>
        </form>
      </Section>

      {/* Footer */}
        <footer className="bg-gradient-to-l from-[#ff7b7b] via-red-200 to-white-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-[#ffdada] mt-8">
        <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Σχετικά με εμάς 🎓</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Το <strong>technotesgr</strong> βοηθά μαθητές Γ’ Λυκείου να προετοιμαστούν αποτελεσματικά για τις Πανελλαδικές Πληροφορικής — σημειώσεις, quiz & διαδραστικά εργαλελεία.
            </p>
          </div>
          <nav aria-label="Γρήγοροι σύνδεσμοι">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Γρήγοροι Σύνδεσμοι</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/notes" className="text-gray-600 dark:text-gray-300 hover:text-[#ff7b7b] transition">📚 Σημειώσεις</a></li>
              <li><a href="/quiz" className="text-gray-600 dark:text-gray-300 hover:text-[#ff7b7b] transition">🎯 Quiz</a></li>
              <li><a href="/flashcards" className="text-gray-600 dark:text-gray-300 hover:text-[#ff7b7b] transition">🧠 Flashcards</a></li>
              <li><a href="https://evripides.mysch.gr/dave/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-[#ff7b7b] transition">💻 Algorithms Games</a></li>
            </ul>
          </nav>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Επικοινωνία </h3>
            <div className="space-y-2 text-sm">
              <a href="https://www.instagram.com/technotesgr/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[#ff4d4d] font-medium">
                Instagram: @technotesgr
              </a>
              <br />
              <a href="https://www.tiktok.com/@technotesgr" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[#ff4d4d] font-medium">
                TikTok: @technotesgr
              </a>
            </div>
          </div>
        </div>
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur py-4 border-t border-[#ffdada]">
          <div className="container mx-auto px-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {currentYear} technotesgr. All rights reserved.</p>
            <p className="mt-1">Made with ♡ by feirw, areynbaw and deathwish</p>
          </div>
        </div>
      </footer>

      {/* Προαιρετικό JSON-LD για SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'technotesgr',
            url: 'https://technotes.gr',
            sameAs: [
              'https://www.instagram.com/technotesgr/',
              'https://www.tiktok.com/@technotesgr'
            ]
          })
        }}
      />
    </div>
  );
};

export default HomePage;
