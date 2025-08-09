import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import SliderCard from '../components/SliderCard.jsx';
import technotesLogo from '../assets/technotes_logo.png';

// .env: VITE_API_URL=https://api.technotes.gr
const BACKEND_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8001';

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
  { title: 'Quiz', desc: 'Δοκίμασε γνώσεις με έξυπνα, στοχευμένα ερωτήματα.' },
  { title: 'Flashcards', desc: 'Γρήγορη επανάληψη στις βασικές έννοιες.' },
];

// ---------- Small UI helpers ----------
const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="py-16">
    <div className="container mx-auto px-6">
      {title && (
        <header className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  </section>
);

const FeatureCard = ({ title, desc }) => (
  <div className="group bg-white/70 dark:bg-[#1f1f1f]/70 backdrop-blur rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ring-1 ring-transparent hover:ring-[#feabab]/50">
    <h3 className="text-xl font-semibold mb-2 group-hover:text-[#ff7b7b] transition-colors">
      {title}
    </h3>
    <p className="text-gray-700 dark:text-gray-300">{desc}</p>
  </div>
);

const StarRating = ({ value }) => (
  <div className="flex justify-center" aria-label={`Βαθμολογία ${value} από 5`}>
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-xl ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))}
  </div>
);

// ---------- Page ----------
const HomePage = () => {
  const { nickname } = useAppContext();

  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!contactForm.firstName.trim() || !contactForm.email.trim() || !contactForm.message.trim())
      return 'Συμπλήρωσε όνομα, email και μήνυμα.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email))
      return 'Το email δεν φαίνεται έγκυρο.';
    return null;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    setContactSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) throw new Error('Bad response');
      await res.json().catch(() => ({}));
      setContactSuccess(true);
      setContactForm({ firstName: '', lastName: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 4500);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Υπήρξε ένα πρόβλημα κατά την αποστολή της φόρμας. Δοκίμασε ξανά.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6f6] text-gray-800">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#feabab] via-[#ffc3c3] to-[#ffdede] text-gray-900 py-20 shadow-inner">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/70 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-md ring-1 ring-white/40">
              <img
                src={technotesLogo}
                alt="Technotesgr Logo"
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">Technotesgr</h1>
          <p className="text-lg sm:text-xl mb-6 opacity-90">
            Οι καλύτερες σημειώσεις για ΑΕΠΠ – Πανελλαδικές
          </p>
          {nickname ? (
            <p className="text-base font-semibold opacity-90">Καλώς ήρθες ξανά, {nickname}!</p>
          ) : (
            <p className="text-base opacity-90">Πληροφορική Γ' Γενικού Λυκείου</p>
          )}

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/notes"
              className="px-6 py-3 rounded-lg font-semibold bg-white text-gray-900 shadow hover:shadow-lg transition"
            >
              Δες τις Σημειώσεις
            </a>
            <a
              href="/quiz"
              className="px-6 py-3 rounded-lg font-semibold bg-black/10 hover:bg-black/20 shadow transition"
            >
              Ξεκίνα Quiz
            </a>
          </div>
        </div>
      </div>

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

      {/* Reviews */}
      <Section id="reviews" title="Τι λένε οι μαθητές μας">
        <SliderCard
          title=""
          data={reviewsData}
          containerClassName="bg-white/70 backdrop-blur rounded-xl ring-1 ring-[#ffdada]"
          renderCard={(review) => (
            <article className="bg-[#fff2f2] rounded-xl p-8 text-center h-full flex flex-col justify-center ring-1 ring-[#ffdada]">
              <div className="mb-3">
                <StarRating value={review.rating} />
                <h3 className="text-lg font-semibold mt-1">{review.name}</h3>
              </div>
              <p className="text-gray-700 italic leading-relaxed">“{review.description}”</p>
            </article>
          )}
          sliderSettings={{ autoplaySpeed: 4000, pauseOnHover: true }}
        />
      </Section>

      {/* Contact */}
      <Section
        id="contact"
        title="Επικοινωνία"
        subtitle="Έχεις απορία ή πρόταση; Στείλε μας μήνυμα!"
      >
        <form
          onSubmit={handleContactSubmit}
          className="max-w-3xl mx-auto bg-white/80 backdrop-blur p-6 rounded-xl shadow ring-1 ring-[#ffdada]"
        >
          {contactSuccess && (
            <div className="mb-4 rounded-lg bg-green-50 text-green-800 px-4 py-3 text-sm">
              ✅ Το μήνυμα στάλθηκε! Θα σου απαντήσουμε σύντομα.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                Όνομα *
              </label>
              <input
                id="firstName"
                name="firstName"
                value={contactForm.firstName}
                onChange={handleContactInputChange}
                required
                className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab]"
                placeholder="π.χ. Μαρία"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Επώνυμο
              </label>
              <input
                id="lastName"
                name="lastName"
                value={contactForm.lastName}
                onChange={handleContactInputChange}
                className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab]"
                placeholder="π.χ. Παπαδοπούλου"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={contactForm.email}
              onChange={handleContactInputChange}
              required
              className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab]"
              placeholder="name@example.com"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Μήνυμα *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={contactForm.message}
              onChange={handleContactInputChange}
              required
              className="w-full rounded-lg border border-[#ffdada] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#feabab] resize-y"
              placeholder="Γράψε εδώ την απορία/πρότασή σου…"
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={contactSubmitting}
              className="px-6 py-3 rounded-lg font-semibold text-black bg-[#feabab] shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {contactSubmitting ? 'Αποστολή…' : 'Αποστολή'}
            </button>
            <p className="text-xs text-gray-500">* Υποχρεωτικά πεδία</p>
          </div>
        </form>
      </Section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur border-t border-[#ffdada] mt-8">
        <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Σχετικά με εμάς 🎓</h3>
            <p className="text-gray-600 text-sm">
              Το <strong>technotesgr</strong> βοηθά μαθητές Γ’ Λυκείου να προετοιμαστούν
              αποτελεσματικά για τις Πανελλαδικές Πληροφορικής — σημειώσεις, quiz & διαδραστικά
              εργαλεία.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Γρήγοροι Σύνδεσμοι</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/notes" className="text-gray-600 hover:text-[#ff7b7b] transition">
                  📚 Σημειώσεις
                </a>
              </li>
              <li>
                <a href="/quiz" className="text-gray-600 hover:text-[#ff7b7b] transition">
                  🎯 Quiz
                </a>
              </li>
              <li>
                <a href="/flashcards" className="text-gray-600 hover:text-[#ff7b7b] transition">
                  🧠 Flashcards
                </a>
              </li>
              <li>
                <a
                  href="https://evripides.mysch.gr/dave/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#ff7b7b] transition"
                >
                  💻 Algorithms Games
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Επικοινωνία 📬</h3>
            <div className="space-y-2 text-sm">
              <a
                href="https://www.instagram.com/technotesgr/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#ff4d4d] font-medium"
              >
                👉 Instagram: @technotesgr
              </a>
              <br />
              <a
                href="https://www.tiktok.com/@technotesgr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#ff4d4d] font-medium"
              >
                👉 TikTok: @technotesgr
              </a>
            </div>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur py-4 border-t border-[#ffdada]">
          <div className="container mx-auto px-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} technotesgr. All rights reserved.</p>
            <p className="mt-1">Made with ❤️ by feirw, areynbaw and deathwish</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
