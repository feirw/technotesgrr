import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
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

interface Feature {
  title: string;
  desc: string;
  badge: string;
  iconSrc: string;
  iconClassName?: string;
  path?: string;
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

const featuresData: Feature[] = [
  {
    title: 'Μεθοδολογίες',
    desc: 'Τυπικοί αλγόριθμοι σε ΓΛΩΣΣΑ — Όσο, πίνακες, στοίβα, ουρά και άλλες κατηγορίες της ύλης.',
    badge: '01',
    iconSrc: MENU_ICONS.methodologies,
    path: '/methodologies',
  },
  {
    title: 'Ασκήσεις',
    desc: 'Προτεινόμενες ασκήσεις Θέμα Γ και Θέμα Δ με πλήρεις εκφωνήσεις για εξάσκηση.',
    badge: '02',
    iconSrc: MENU_ICONS.askiseis,
    iconClassName: 'w-24 h-24',
    path: '/askiseis',
  },
  {
    title: 'Quiz',
    desc: 'Δοκίμασε γνώσεις με έξυπνα, στοχευμένα ερωτήματα τα οποία έχουν εξεταστεί σε προηγούμενες Πανελλήνιες εξετάσεις.',
    badge: '03',
    iconSrc: MENU_ICONS.quiz,
    path: '/quiz',
  },
  {
    title: 'Flashcards',
    desc: 'Γρήγορη επανάληψη σε όλες τις έννοιες του σχολικού βιβλίου.',
    badge: '04',
    iconSrc: MENU_ICONS.flashcards,
    path: '/flashcards',
  },
  {
    title: 'Study Timer',
    desc: 'Οργάνωσε τον χρόνο μελέτης σου και παρακολούθησε την καθημερινή πρόοδό σου.',
    badge: '05',
    iconSrc: MENU_ICONS.studyTimer,
    path: '/study-timer',
  },
  {
    title: 'Σχολές και Καριέρα',
    desc: 'Εξερεύνησε επιλογές σχολών και οργάνωσε πιο σωστά τα επόμενα βήματά σου.',
    badge: '06',
    iconSrc: MENU_ICONS.schools,
    path: '/sxoles',
  },
  {
    title: 'Παλιά Θέματα και Αλγόριθμοι',
    desc: 'Μελέτησε παλαιά θέματα και δες οπτικοποιήσεις αλγορίθμων για βαθύτερη κατανόηση.',
    badge: '07',
    iconSrc: MENU_ICONS.paliathemata,
    path: '/paliathemata',
  },
  {
    title: 'Online Διερμηνευτής της Γλώσσας',
    desc: 'Γράψε και δοκίμασε κώδικα στη ΓΛΩΣΣΑ άμεσα, με γρήγορη εκτέλεση και καλύτερη εξάσκηση.',
    badge: '08',
    iconSrc: MENU_ICONS.gloglossa,
    path: '/gloglossa',
  },
  {
    title: 'Tracker της ύλης',
    desc: 'Παρακολούθησε κεφάλαια και ενότητες: δες τι έχεις καλύψει και τι απομένει πριν τις εξετάσεις.',
    badge: '09',
    iconSrc: MENU_ICONS.progressTracker,
    path: '/progress-tracker',
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

interface FeatureCardProps extends Feature {
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  desc,
  iconSrc,
  iconClassName = 'w-20 h-20',
  onClick,
}) => (
  <motion.button
    type="button"
    className="group relative bg-white rounded-2xl shadow-xl p-8 text-center transition-all duration-500 border border-[#f07f97]/35 overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-[#f07f97] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2d1c48]"
    aria-label={title}
    onClick={onClick}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0 }}
    whileHover={{
      y: -10,
      scale: 1.02,
      boxShadow: '0 25px 50px -12px rgba(232, 86, 100, 0.26)',
      transition: { duration: 0.3 },
    }}
  >
    <motion.div className="absolute inset-0 bg-[#f07f97] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

    <div className="absolute -inset-0.5 bg-[#f07f97] rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />

    <div className="relative z-10">
      <motion.div
        className="mb-6 mx-auto flex items-center justify-center"
        whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
      >
        <MenuIconImg src={iconSrc} className={iconClassName} />
      </motion.div>

      <motion.h3
        className="text-2xl font-bold mb-3 text-gray-900"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        {title}
      </motion.h3>

      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  </motion.button>
);

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
              για τις Πανελλήνιες.
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

        {/* Features Section */}
        <Section
          id="features"
          title="Τι προσφέρουμε;"
          subtitle="Όλα όσα χρειάζεσαι για να πετύχεις στις Πανελλήνιες"
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12"
          >
            {featuresData.map((feat) => (
              <FeatureCard
                key={feat.title}
                {...feat}
                onClick={() => {
                  if (!feat.path) return;
                  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                  navigate(feat.path);
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
