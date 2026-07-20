import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';
// import { getBackendUrl } from '@/utils/backendUrl';
// import { apiFetch } from '@/utils/apiClient';
// import { FiSend } from 'react-icons/fi';

// --- Types & Interfaces ---

// interface ContactFormState {
//   firstName: string;
//   lastName: string;
//   email: string;
//   message: string;
//   website: string;
// }

interface Review {
  name: string;
  rating: number;
  description: string;
}

interface FeatureCategoryItem {
  label: string;
  path: string;
  iconSrc: string;
}

interface FeatureCategory {
  title: string;
  desc: string;
  items: FeatureCategoryItem[];
}

// interface ContactResponse {
//   message: string;
//   submission_id: number;
//   email_sent?: boolean;
// }

interface FaqItem {
  question: string;
  answer: string;
}

// ---------- MOCK DATA ----------

const HERO_BACKGROUND_LIGHT = '/images/home%20page/bc11.jpg';
const HERO_BACKGROUND_DARK = '/images/home%20page/night.jpg';

const SHOWCASE_VIDEOS = [
  '/videos/v24044gl0000d8dc50vog65ursbvt0u0.MP4',
  '/videos/v24044gl0000d8ptjgnog65tm9lv8qug.MP4',
  '/videos/v24044gl0000d93vpsfog65oopq68cbg.MP4',
];

const reviewsData: Review[] = [
  {
    name: 'Ρία Κ. Απόφοιτη 2025',
    rating: 5,
    description:
      'Οι σημειώσεις είναι εξαιρετικές! Με βοήθησαν πάρα πολύ να κατανοήσω την ύλη της πληροφορικής. Το quiz είναι διασκεδαστικό και εκπαιδευτικό!',
  },
  {
    name: "Χριστίνα Σ. Μαθήτρια Γ' Λυκείου",
    rating: 5,
    description:
      'Φανταστικό site! Οι flashcards με βοήθησαν να επαναλάβω γρήγορα όλες τις έννοιες. Τώρα νιώθω πιο σίγουρος για τις πανελλαδικές!',
  },
  {
    name: "Ντέμυ Λ. Μαθήτρια Γ' Λυκείου",
    rating: 5,
    description:
      'Πολύ καλή πλατφόρμα για προετοιμασία! Οι οπτικοποιήσεις των αλγορίθμων είναι πολύ χρήσιμες. Συνιστώ ανεπιφύλακτα!',
  },
  {
    name: "Βικτώρια Κ. Μαθητρια Γ' Λυκείου",
    rating: 5,
    description: 'Οι ερωτήσεις είναι πολύ καλά δομημένες και με προετοιμάζουν σωστά.',
  },
  {
    name: "Αγγελική Β. Μαθήτρια Β' Λυκείου",
    rating: 5,
    description:
      'Εξαιρετικό εργαλείο μελέτης! Τα παιχνίδια οπτικοποίησης με βοήθησαν να καταλάβω καλύτερα τους αλγορίθμους. Ευχαριστώ πολύ!',
  },
];

const featureCategoriesData: FeatureCategory[] = [
  {
    title: 'Για πριν τις πανελλήνιες',
    desc: 'Όλα τα εργαλεία μελέτης και εξάσκησης για να φτάσεις προετοιμασμένος/η στις εξετάσεις.',
    items: [
      { label: 'Flashcards', path: '/flashcards', iconSrc: MENU_ICONS.flashcards },
      { label: 'Quiz', path: '/quiz', iconSrc: MENU_ICONS.quiz },
      { label: 'Παλιά Θέματα', path: '/paliathemata', iconSrc: MENU_ICONS.paliathemata },
      { label: 'Μεθοδολογίες', path: '/methodologies', iconSrc: MENU_ICONS.methodologies },
      { label: 'Ασκήσεις', path: '/askiseis', iconSrc: MENU_ICONS.askiseis },
      { label: 'Διερμηνευτής ΓΛΩΣΣΑΣ', path: '/gloglossa', iconSrc: MENU_ICONS.gloglossa },
      { label: 'Study Timer', path: '/study-timer', iconSrc: MENU_ICONS.studyTimer },
      { label: 'Tracker Ύλης', path: '/progress-tracker', iconSrc: MENU_ICONS.progressTracker },
    ],
  },
  {
    title: 'Για μετά τις πανελλήνιες',
    desc: 'Οδηγός για σχολές, μόρια και τα επόμενα βήματα μετά τις εξετάσεις.',
    items: [
      { label: 'Σχολές', path: '/sxoles', iconSrc: MENU_ICONS.schools },
      { label: 'Βάσεις Σχολών', path: '/ypologismos-morion', iconSrc: MENU_ICONS.ypologismosMorion },
      { label: 'Συντελεστές', path: '/syntelestes-sxolon', iconSrc: MENU_ICONS.syntelestesSxolon },
      { label: 'Αντιστοιχίες Σχολών', path: '/antistoixies-sxolon', iconSrc: MENU_ICONS.antistixia },
      { label: 'Μετεγγραφές', path: '/meteggrafes', iconSrc: MENU_ICONS.meteggrafes },
      { label: 'Μελλοντικές Καριέρες & Προσανατολισμός', path: '/prosanatolismos', iconSrc: MENU_ICONS.prosanatolismos },
      { label: 'ΣΑΕΚ', path: '/saek', iconSrc: MENU_ICONS.saek },
      {label : 'Πρόβα Μηχανογραφικού', path: '/prova-mixanografiko', iconSrc: MENU_ICONS.mixanografiko},
    ],
  },
];

const faqData: FaqItem[] = [
  {
    question: 'Είναι δωρεάν η πλατφόρμα;',
    answer:
      "Ναι! Το technotesgr είναι εντελώς δωρεάν για όλους τους μαθητές της Γ' Λυκείου. Στόχος μας είναι να βοηθήσουμε όσο το δυνατόν περισσότερους μαθητές να προετοιμαστούν για τις Πανελλαδικές εξετάσεις.",
  },
  {
    question: 'Καλύπτει όλη την ύλη της Πληροφορικής;',
    answer:
      "Ναι! Τα flashcards και τα quiz μας καλύπτουν αναλυτικά όλη την ύλη του σχολικού βιβλίου Πληροφορικής Γ' Λυκείου.",
  },
  {
    question: 'Πώς μπορώ να παρακολουθήσω την πρόοδό μου;',
    answer:
      'Μέσα από τα quiz και τα flashcards μπορείς να δεις τις απαντήσεις σου και να εντοπίσεις τα σημεία που χρειάζονται περισσότερη μελέτη. Κάθε quiz σου δίνει άμεσο feedback.',
  },
  {
    question: 'Μπορώ να χρησιμοποιήσω την πλατφόρμα από το κινητό μου;',
    answer:
      'Απολύτως! Η πλατφόρμα είναι πλήρως responsive και λειτουργεί άψογα σε κινητά, tablets και υπολογιστές.',
  },
  {
    question: 'Πόσο συχνά ενημερώνεται το περιεχόμενο;',
    answer:
      'Ενημερώνουμε τακτικά το περιεχόμενο με νέα quiz, flashcards και βελτιωμένες σημειώσεις.',
  },
  {
    question: 'Μπορώ να κάνω ερωτήσεις αν δυσκολευτώ;',
    answer:
      'Φυσικά! Μπορείς να επικοινωνήσεις μαζί μας μέσω της φόρμας επικοινωνίας ή μέσω των social media μας. Θα χαρούμε να σε βοηθήσουμε!',
  },
];

// const BACKEND_URL = getBackendUrl();

/** Κοραλί (ζεστό): κύριο `#ff8f8e`, accent `#ff6b7a`, hover `#e85563`, ανοιχτό `#ffb0a4`. */

const REVIEW_CAROUSEL_INTERVAL_MS = 6000;

/** Διεύθυνση: +1 = επόμενη κριτική (μπαίνει από δεξιά), -1 = προηγούμενη (από αριστερά). */
const reviewCarouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 64 : -64,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -64 : 64,
    opacity: 0,
    scale: 0.97,
  }),
};

// ---------- Sub-Components ----------

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  subtitle,
  className = '',
  children,
}) => (
  <section
    id={id}
    className={`py-20 relative overflow-hidden ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 480px' }}
  >
    <div className="container mx-auto px-6 relative z-10">
      {title && (
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#faf5ef] mb-4 drop-shadow-sm">
            {title}
          </h2>

          {subtitle && (
            <p className="text-lg text-[#fffdfb] max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </div>
  </section>
);

interface CategoryCardProps extends FeatureCategory {
  onNavigate: (path: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, desc, items, onNavigate }) => (
  <motion.div
    className="group relative bg-white dark:bg-[#3a2658] rounded-3xl shadow-xl p-8 sm:p-10 border border-[#f07f97]/35 dark:border-[#f07f97]/25 overflow-hidden"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
    whileHover={{
      y: -6,
      boxShadow: '0 25px 50px -12px rgba(232, 86, 100, 0.26)',
      transition: { duration: 0.3 },
    }}
  >
    <div className="absolute -inset-0.5 bg-[#f07f97] rounded-3xl blur opacity-0 group-hover:opacity-15 transition duration-500 pointer-events-none" />

    <div className="relative z-10">
      <h3 className="text-2xl sm:text-3xl font-black mb-3 text-[#f07f97]">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{desc}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.path)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#f07f97]/25 dark:border-white/10 bg-coral-wash/60 dark:bg-white/5 hover:bg-[#f07f97]/15 dark:hover:bg-[#f07f97]/15 hover:border-[#f07f97] px-3 py-4 text-center transition-colors"
          >
            <MenuIconImg src={item.iconSrc} className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

interface VideoShowcaseCardProps {
  src: string;
  index: number;
}

const VideoShowcaseCard: React.FC<VideoShowcaseCardProps> = ({ src, index }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <motion.div
      className="relative group mx-auto w-full max-w-[300px]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      {/* Pink frame */}
      <div className="relative rounded-[1.75rem] border-[6px] border-[#f07f97] bg-black overflow-hidden shadow-2xl shadow-[#f07f97]/40 aspect-[9/16] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Top sheen for legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Sound toggle */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? 'Ενεργοποίηση ήχου' : 'Σίγαση'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#e06d88] flex items-center justify-center shadow-md backdrop-blur-sm transition-colors z-10"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Brand badge */}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex justify-center">
          <span className="px-3 py-1 rounded-full bg-[#f07f97] text-white text-xs font-black shadow-lg tracking-wide">
            technotesgr
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const REVIEW_STARS_IMG = '/images/home%20page/stars-removebg-preview.png';

const StarRating: React.FC<{ value?: number }> = ({ value = 0 }) => {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex justify-center gap-2 sm:gap-3" aria-label={`Βαθμολογία ${clamped} από 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className="inline-flex"
          aria-hidden="true"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: i * 0.08,
          }}
        >
          <img
            src={REVIEW_STARS_IMG}
            alt=""
            className={`w-16 h-16 sm:w-20 sm:h-20 object-contain ${i < clamped ? 'opacity-100' : 'opacity-25 grayscale'}`}
            decoding="async"
          />
        </motion.span>
      ))}
    </div>
  );
};

interface FAQItemProps extends FaqItem {
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="bg-white/80 dark:bg-[#3a2658]/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-white/15 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left group"
        whileHover={{ backgroundColor: 'rgba(240, 127, 151, 0.1)' }}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-8 group-hover:text-[#f07f97] transition-colors">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg
            className="w-6 h-6 text-[#f07f97]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pt-3 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------- Main Component ----------

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Contact form state (προσωρινά απενεργοποιημένη η φόρμα)
  /*
  const [contactForm, setContactForm] = useState<ContactFormState>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    website: '',
  });

  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccessMessage, setContactSuccessMessage] = useState('');

  const firstId = useId();
  const lastId = useId();
  const emailId = useId();
  const msgId = useId();
  const successId = useId();
  const errorId = useId();
  */

  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewDirection, setReviewDirection] = useState(1);

  const reviewCount = reviewsData.length;
  const goNextReview = useCallback(() => {
    setReviewDirection(1);
    setReviewIndex((i) => (i + 1) % reviewCount);
  }, [reviewCount]);
  const goToReview = useCallback(
    (target: number) => {
      if (target === reviewIndex || target < 0 || target >= reviewCount) return;
      const forward = (target - reviewIndex + reviewCount) % reviewCount;
      const backward = (reviewIndex - target + reviewCount) % reviewCount;
      setReviewDirection(forward <= backward ? 1 : -1);
      setReviewIndex(target);
    },
    [reviewIndex, reviewCount]
  );

  useEffect(() => {
    const id = window.setInterval(goNextReview, REVIEW_CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [goNextReview]);

  // (Take a breath moved to the top navbar in MainLayout)

  /*
  const handleContactInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setContactForm((prev) => ({ ...prev, [name]: value }));
      if (contactError) setContactError('');
    },
    [contactError]
  );

  const validate = useCallback((): string | null => {
    if (contactForm.website) return 'Spam detected.';
    if (!contactForm.firstName.trim() || !contactForm.email.trim() || !contactForm.message.trim())
      return 'Συμπλήρωσε όνομα, email και μήνυμα.';

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(contactForm.email))
      return 'Το email δεν φαίνεται έγκυρο. Παρακαλώ ελέγξτε τη μορφή (π.χ. user@example.com).';

    return null;
  }, [contactForm]);

  const handleContactSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setContactError('');
      const err = validate();
      if (err) {
        setContactError(err);
        return;
      }

      setContactSubmitting(true);

      try {
        const data = await apiFetch<ContactResponse>(`${BACKEND_URL}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          timeoutMs: 10000,
          retries: 1,
          body: JSON.stringify({
            firstName: contactForm.firstName.trim(),
            lastName: contactForm.lastName.trim(),
            email: contactForm.email.trim(),
            message: contactForm.message.trim(),
          }),
        });
        setContactSuccess(true);
        setContactSuccessMessage(
          data?.email_sent
            ? '✓ Το μήνυμά σου στάλθηκε και ενημερώθηκε η ομάδα μας με email.'
            : '✓ Το μήνυμά σου καταχωρήθηκε επιτυχώς. Θα σου απαντήσουμε σύντομα.'
        );
        setContactForm({
          firstName: '',
          lastName: '',
          email: '',
          message: '',
          website: '',
        });
        setTimeout(() => {
          setContactSuccess(false);
          setContactSuccessMessage('');
        }, 5000);
      } catch (err) {
        console.error('Error:', err);
        const detail = err instanceof Error ? err.message : '';
        setContactError(detail || 'Κάτι πήγε στραβά. Προσπάθησε ξανά.');
      } finally {
        setContactSubmitting(false);
      }
    },
    [contactForm, validate]
  );
  */

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen transition-colors duration-500 bg-[#ff97b2] dark:bg-[#2d1c48]">
        {/* 🚀 HERO SECTION 🚀 */}
        <section className="relative w-full min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
            <img
              src={HERO_BACKGROUND_LIGHT}
              alt="Φόντο πλατφόρμας προετοιμασίας Πανελληνίων Πληροφορικής Technotes"
              className="w-full h-full min-h-[80vh] sm:min-h-screen object-cover object-center dark:hidden"
              decoding="async"
              fetchPriority="high"
            />
            <img
              src={HERO_BACKGROUND_DARK}
              alt="Φόντο πλατφόρμας προετοιμασίας Πανελληνίων Πληροφορικής Technotes (σκοτεινό θέμα)"
              className="hidden w-full h-full min-h-[80vh] sm:min-h-screen object-cover object-center dark:block"
              decoding="async"
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center py-16 sm:py-20">
            <h1
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-4 sm:mb-6 text-[#f07f97] drop-shadow-lg leading-tight tracking-tight"
            >
              Technotes
            </h1>

            <p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Η <span className="font-bold text-[#f07f97]">ιδανική πλατφόρμα</span> προετοιμασίας
              για τις πανελλήνιες,εντελώς <span className="font-bold text-[#00000]"> ΔΩΡΕΑΝ!</span>
            </p>

            <motion.button
              className="relative inline-flex items-center gap-3 px-10 py-5 text-lg sm:text-xl bg-[#f07f97] hover:bg-[#e06d88] text-white font-extrabold rounded-full shadow-xl transition-colors transition-transform hover:-translate-y-1"
              onClick={() => navigate('/quiz')}
              whileTap={{ scale: 0.98 }}
            >
              <span>Ξεκίνα την προετοιμασία</span>
              <span
                className="absolute inset-0 rounded-full ring-2 ring-[#f07f97]/55 animate-pulse"
                aria-hidden="true"
              />
              <span
                className="absolute -inset-px rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition"
                aria-hidden="true"
              />
            </motion.button>

            
          </div>
        </section>

        {/* Take a breath relocated to navbar (MainLayout) */}

        {/* Video Showcase Section */}
        <Section id="videos">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 place-items-center">
            {SHOWCASE_VIDEOS.map((src, idx) => (
              <VideoShowcaseCard key={src} src={src} index={idx} />
            ))}
          </div>
        </Section>

        {/* Features Section */}
        <Section
          id="features"
          title="Τι προσφέρουμε:"
          
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {featureCategoriesData.map((category) => (
              <CategoryCard
                key={category.title}
                {...category}
                onNavigate={(path) => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                  navigate(path);
                }}
              />
            ))}
          </div>
        </Section>

        {/* Reviews Section */}
        <Section id="reviews" title="Τι λένε οι μαθητές μας;">
          <motion.div
            className="max-w-2xl mx-auto px-2 sm:px-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative pt-3 pb-1">
              {/* «Δεύτερη κάρτα» πίσω για αίσθηση στοίβας */}
              <div
                className="pointer-events-none absolute left-3 right-3 top-5 bottom-0 rounded-3xl bg-white/70 dark:bg-gray-800/55 border border-[#f07f97]/20 dark:border-gray-600/50 shadow-lg scale-[0.97] -z-10"
                aria-hidden
              />
              <div className="relative min-h-[280px] sm:min-h-[260px] md:min-h-[230px]">
                <AnimatePresence initial={false} custom={reviewDirection} mode="wait">
                  <motion.div
                    key={reviewIndex}
                    custom={reviewDirection}
                    variants={reviewCarouselVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex flex-col justify-center rounded-3xl border-2 border-[#f07f97]/35 dark:border-[#f07f97]/25 bg-white dark:bg-gray-800 p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(240,127,151,0.28),0_8px_24px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/10"
                  >
                    <div
                      className="absolute top-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r from-transparent via-[#f07f97] to-transparent opacity-80"
                      aria-hidden
                    />
                    <StarRating value={reviewsData[reviewIndex].rating} />
                    <p className="text-gray-700 dark:text-gray-200 mt-5 text-base sm:text-lg leading-relaxed italic">
                      "{reviewsData[reviewIndex].description}"
                    </p>
                    <p className="text-[#f07f97] font-bold mt-5 text-right">
                      — {reviewsData[reviewIndex].name}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 mt-10" role="tablist" aria-label="Επιλογή κριτικής">
              {reviewsData.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === reviewIndex}
                  aria-label={`Κριτική ${idx + 1} από ${reviewCount}`}
                  onClick={() => goToReview(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === reviewIndex
                      ? 'w-8 bg-[#f07f97]'
                      : 'w-2.5 bg-gray-300 dark:bg-white/25 hover:bg-[#f07f97]/80'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </Section>

        {/* FAQ Section */}
        <Section id="faq" title="Συχνές Ερωτήσεις">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem key={index} {...faq} index={index} />
            ))}
          </div>
        </Section>

        {/* Contact Section — προσωρινά απενεργοποιημένη
        <Section
          id="contact"
          title="Επικοινώνησε μαζί μας"
          subtitle="Έχεις απορίες ή προτάσεις; Στείλε μας μήνυμα!"
          withGradient
        >
          ...
        </Section>
        */}
      </div>
    </MotionConfig>
  );
};

export default HomePage;
