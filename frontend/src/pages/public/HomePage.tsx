import React, { useCallback, useEffect, useId, useState } from 'react';
import { getBackendUrl } from '@/utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  MotionConfig,
  AnimatePresence,
  useSpring,
} from 'framer-motion';
import { apiFetch } from '@/utils/apiClient';
import {
  Trophy,
  Layers,
  Timer,
  BookOpen,
  ClipboardList,
  School2Icon,
  Code,
  Terminal,
  ListChecks,
  LucideIcon,
} from 'lucide-react';
import { FiSend } from 'react-icons/fi';

// --- Types & Interfaces ---

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  website: string;
}

interface HeroImage {
  src: string;
  alt: string;
  rotation: number;
}

interface Review {
  name: string;
  rating: number;
  description: string;
}

interface Feature {
  title: string;
  desc: string;
  badge: string;
  icon?: LucideIcon;
  path?: string;
}

interface ContactResponse {
  message: string;
  submission_id: number;
  email_sent?: boolean;
}

interface FaqItem {
  question: string;
  answer: string;
}

// ---------- MOCK DATA ----------

const heroImages: HeroImage[] = [
  { src: '/images/a2.jpg', alt: 'Hero image 1', rotation: 3 },
  { src: '/images/a3.jpg', alt: 'Hero image 2', rotation: -4 },
  { src: '/images/a4.jpg', alt: 'Hero image 3', rotation: 5 },
  { src: '/images/a5.jpg', alt: 'Hero image 4', rotation: -2 },
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

const featuresData: Feature[] = [
  {
    title: 'Μεθοδολογίες',
    desc: 'Τυπικοί αλγόριθμοι σε ΓΛΩΣΣΑ — Όσο, πίνακες, στοίβα, ουρά και άλλες κατηγορίες της ύλης.',
    badge: '01',
    icon: BookOpen,
    path: '/methodologies',
  },
  {
    title: 'Ασκήσεις',
    desc: 'Προτεινόμενες ασκήσεις Θέμα Γ και Θέμα Δ με πλήρεις εκφωνήσεις για εξάσκηση.',
    badge: '02',
    icon: ClipboardList,
    path: '/askiseis',
  },
  {
    title: 'Quiz',
    desc: 'Δοκίμασε γνώσεις με έξυπνα, στοχευμένα ερωτήματα τα οποία έχουν εξεταστεί σε προηγούμενες Πανελλήνιες εξετάσεις.',
    badge: '03',
    icon: Trophy,
    path: '/quiz',
  },
  {
    title: 'Flashcards',
    desc: 'Γρήγορη επανάληψη σε όλες τις έννοιες του σχολικού βιβλίου.',
    badge: '04',
    icon: Layers,
    path: '/flashcards',
  },
  {
    title: 'Study Timer',
    desc: 'Οργάνωσε τον χρόνο μελέτης σου και παρακολούθησε την καθημερινή πρόοδό σου.',
    badge: '05',
    icon: Timer,
    path: '/study-timer',
  },
  {
    title: 'Σχολές και Καριέρα',
    desc: 'Εξερεύνησε επιλογές σχολών και οργάνωσε πιο σωστά τα επόμενα βήματά σου.',
    badge: '06',
    icon: School2Icon,
    path: '/sxoles',
  },
  {
    title: 'Παλιά Θέματα και Αλγόριθμοι',
    desc: 'Μελέτησε παλαιά θέματα και δες οπτικοποιήσεις αλγορίθμων για βαθύτερη κατανόηση.',
    badge: '07',
    icon: Code,
    path: '/paliathemata',
  },
  {
    title: 'Online Διερμηνευτής της Γλώσσας',
    desc: 'Γράψε και δοκίμασε κώδικα στη ΓΛΩΣΣΑ άμεσα, με γρήγορη εκτέλεση και καλύτερη εξάσκηση.',
    badge: '08',
    icon: Terminal,
    path: '/gloglossa',
  },
  {
    title: 'Tracker της ύλης',
    desc: 'Παρακολούθησε κεφάλαια και ενότητες: δες τι έχεις καλύψει και τι απομένει πριν τις εξετάσεις.',
    badge: '09',
    icon: ListChecks,
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

const BACKEND_URL = getBackendUrl();

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

interface AnimatedImageBoxProps {
  src: string;
  alt: string;
  rotation: number;
  widthClass: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low';
}

const AnimatedImageBox: React.FC<AnimatedImageBoxProps> = ({
  src,
  alt,
  rotation,
  widthClass,
  loading = 'lazy',
  fetchPriority = 'low',
}) => (
  <motion.div
    className={`relative w-full h-auto bg-white/90 rounded-lg overflow-hidden shadow-2xl ${widthClass} mx-auto cursor-pointer`}
    style={{ boxShadow: '0 10px 30px rgba(255, 143, 142, 0.38)' }}
    animate={{ opacity: 1, scale: 1, rotate: rotation }}
    transition={{ duration: 0 }}
    whileHover={{
      scale: 1.05,
      rotate: 0,
      boxShadow: '0 15px 40px rgba(255, 107, 122, 0.38)',
    }}
  >
    <img
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className="w-full h-full object-cover rounded-md"
      style={{ filter: 'grayscale(0.1) brightness(1.05)' }}
    />
  </motion.div>
);

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  withGradient?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  subtitle,
  className = '',
  children,
  withGradient = false,
}) => (
  <section
    id={id}
    className={`py-20 relative overflow-hidden ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 480px' }}
  >
    {withGradient && (
      <div className="absolute inset-0 bg-[#ff8f8e]/[0.06] dark:bg-[#ff6b7a]/[0.1] pointer-events-none" />
    )}
    <div className="container mx-auto px-6 relative z-10">
      {title && (
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#ff6b7a] dark:text-[#ffb0a4] mb-4">
            {title}
          </h2>

          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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

const FeatureCard: React.FC<FeatureCardProps> = ({ title, desc, icon: Icon, onClick }) => (
  <motion.button
    type="button"
    className="group relative bg-white/85 dark:bg-[#17233a]/85 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center transition-all duration-500 border border-[#ff8f8e]/35 dark:border-white/10 overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff8f8e] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f152a]"
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
    <motion.div className="absolute inset-0 bg-[#ff8f8e] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

    <div className="absolute -inset-0.5 bg-[#ff8f8e] rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />

    <div className="relative z-10">
      {Icon && (
        <motion.div
          className="w-16 h-16 mb-6 mx-auto rounded-2xl flex items-center justify-center text-2xl text-[#ff6b7a] bg-[#fff5f4] border-2 border-[#ff8f8e]/40 dark:bg-[#2a1815]/55 dark:border-[#ff6b7a]/35 dark:text-[#ffb0a4]"
          whileHover={{ scale: 1.15, rotate: 0, transition: { duration: 0.3 } }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
      )}

      <motion.h3
        className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-50"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        {title}
      </motion.h3>

      <p className="text-gray-600 dark:text-gray-200/90 leading-relaxed">{desc}</p>
    </div>
  </motion.button>
);

const StarRating: React.FC<{ value?: number }> = ({ value = 0 }) => {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex justify-center gap-1" aria-label={`Βαθμολογία ${clamped} από 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className={`text-3xl ${i < clamped ? 'text-yellow-400' : 'text-gray-300'}`}
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
          ★
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
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left group"
        whileHover={{ backgroundColor: 'rgba(255, 143, 142, 0.1)' }}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-8 group-hover:text-[#ff6b7a] dark:group-hover:text-[#ffb0a4] transition-colors">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg
            className="w-6 h-6 text-[#ff8f8e] dark:text-[#ffb0a4]"
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

/** Απαλά blurs ροζ-κοραλί (συμπαγές χρώμα, όχι gradient). */
const HeroMeshBlurs: React.FC = () => (
  <div
    className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    aria-hidden
  >
    <div
      className="absolute -top-28 -left-20 sm:-top-32 sm:-left-24 w-[min(92vw,560px)] h-[min(92vw,560px)] rounded-full blur-3xl opacity-90 dark:opacity-50 bg-[#ff8f8e]/25"
    />
    <div className="absolute top-[12%] -right-16 sm:right-0 w-[min(88vw,520px)] h-[min(88vw,520px)] rounded-full blur-3xl opacity-85 dark:opacity-48 bg-[#ff6b7a]/22" />
    <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[min(95vw,640px)] h-[min(70vw,420px)] rounded-full blur-3xl opacity-60 dark:opacity-38 bg-[#fbcfe8]/40" />
  </div>
);

// Logo «βροχή» — ίδια κίνηση με τις παλιές καρδιές, εικόνα από public/images/logo.png
const HeartsRain: React.FC<{ count?: number }> = ({ count = 14 }) => {
  const hearts = React.useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: `${Math.random() * 100}%`,
        delay: `${(Math.random() * 10).toFixed(2)}s`,
        duration: `${12 + Math.random() * 8}s`,
        sway: `${2.4 + Math.random() * 1.8}s`,
        size: `${22 + Math.random() * 28}px`,
        rotate: `${-15 + Math.random() * 30}deg`,
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden motion-safe:opacity-100 motion-reduce:hidden">
      {hearts.map((h, idx) => (
        <span
          key={idx}
          className="absolute -top-[6%]"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            animation: `hearts-fall ${h.duration} linear ${h.delay} infinite, hearts-sway ${h.sway} ease-in-out ${h.delay} infinite`,
            filter: 'drop-shadow(0 2px 2px rgba(255, 107, 122, 0.36))',
          }}
        >
          <img
            src="/images/logo.png"
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-full h-full object-contain select-none"
            draggable={false}
            style={{ transform: `rotate(${h.rotate})` }}
          />
        </span>
      ))}

      <style>
        {`
        @keyframes hearts-fall {
          0%   { transform: translateY(-5vh) }
          100% { transform: translateY(105vh) }
        }
        @keyframes hearts-sway {
          0%   { margin-left: -12px; opacity: 0 }
          10%  { opacity: 0.9 }
          50%  { margin-left: 24px }
          100% { margin-left: -12px; opacity: 0.9 }
        }
        `}
      </style>
    </div>
  );
};

// --- Responsive helpers ---
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [query]);
  return matches;
};

// ---------- Main Component ----------

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isSmall = useMediaQuery('(max-width: 640px)');

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 100,
    damping: 30,
  });

  // Contact form state
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

  // (Panic Button moved to the top navbar in MainLayout)

  // 1. Διόρθωση Contact Form: Καθαρισμός error όταν πληκτρολογεί
  const handleContactInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setContactForm((prev) => ({ ...prev, [name]: value }));
      if (contactError) setContactError(''); // Reset error on change
    },
    [contactError]
  );

  // 2. Διόρθωση Form Validation: Email pattern check
  const validate = useCallback((): string | null => {
    if (contactForm.website) return 'Spam detected.';
    if (!contactForm.firstName.trim() || !contactForm.email.trim() || !contactForm.message.trim())
      return 'Συμπλήρωσε όνομα, email και μήνυμα.';

    // Πιο αυστηρό email regex για client-side validation
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

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#fff5f4] dark:bg-gray-900 transition-colors duration-500">
        <HeartsRain count={isSmall ? 5 : 10} />
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-[#ff8f8e] origin-left z-50 shadow-lg shadow-[#ff6b7a]/35"
          style={{ scaleX }}
        />

        {/* 🚀 HERO SECTION 🚀 */}
        <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20 md:py-0">
          <HeroMeshBlurs />
          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
            <div>
              <h1
                className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 text-[#ff6b7a] dark:text-[#ffb0a4] drop-shadow-lg leading-tight"
              >
                Γράψε 100 στην Πληροφορική
              </h1>

              <p
                className="text-base sm:text-lg md:text-2xl text-gray-700 dark:text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Η <span className="font-bold text-[#ff6b7a] dark:text-[#ffb0a4]">ιδανική πλατφόρμα</span> προετοιμασίας
                για τις Πανελλήνιες.
              </p>

              <motion.button
                className="relative inline-flex items-center gap-3 px-9 py-4 bg-[#ff6b7a] hover:bg-[#e85563] text-white font-extrabold rounded-full shadow-xl transition-colors transition-transform hover:-translate-y-1"
                onClick={() => navigate('/quiz')}
                whileTap={{ scale: 0.98 }}
              >
                <span>Ξεκίνα την προετοιμασία</span>
                <span
                  className="absolute inset-0 rounded-full ring-2 ring-[#ff8f8e]/55 animate-pulse"
                  aria-hidden="true"
                />
                <span
                  className="absolute -inset-px rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition"
                  aria-hidden="true"
                />
              </motion.button>
              <div className="mt-4 flex justify-center gap-3"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto mt-10 md:mt-16">
              {heroImages.map((image, index) => (
                <AnimatedImageBox
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  rotation={image.rotation}
                  widthClass="aspect-[4/3] h-auto"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Panic Button relocated to navbar (MainLayout) */}

        {/* Features Section */}
        <Section
          id="features"
          title="Τι προσφέρουμε;"
          subtitle="Όλα όσα χρειάζεσαι για να πετύχεις στις Πανελλήνιες"
          withGradient
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12"
          >
            {featuresData.map((feat) => (
              <FeatureCard
                key={feat.title}
                {...feat}
                onClick={() => {
                  if (feat.path) navigate(feat.path);
                }}
              />
            ))}
          </div>
        </Section>

        {/* Reviews Section */}
        <Section
          id="reviews"
          title="Τι λένε οι μαθητές μας;"
          className="bg-[#ff8f8e]/[0.06] dark:bg-[#ff6b7a]/[0.08]"
        >
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
                className="pointer-events-none absolute left-3 right-3 top-5 bottom-0 rounded-3xl bg-white/70 dark:bg-gray-800/55 border border-[#ff8f8e]/20 dark:border-gray-600/50 shadow-lg scale-[0.97] -z-10"
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
                    className="absolute inset-0 flex flex-col justify-center rounded-3xl border-2 border-[#ff8f8e]/35 dark:border-[#ff6b7a]/25 bg-white dark:bg-gray-800 p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(255,107,122,0.28),0_8px_24px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/10"
                  >
                    <div
                      className="absolute top-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r from-transparent via-[#ff8f8e] to-transparent opacity-80"
                      aria-hidden
                    />
                    <StarRating value={reviewsData[reviewIndex].rating} />
                    <p className="text-gray-700 dark:text-gray-300 mt-5 text-base sm:text-lg leading-relaxed italic">
                      "{reviewsData[reviewIndex].description}"
                    </p>
                    <p className="text-[#ff6b7a] dark:text-[#ffb0a4] font-bold mt-5 text-right">
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
                      ? 'w-8 bg-[#ff6b7a] dark:bg-[#ffb0a4]'
                      : 'w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-[#ff8f8e]/80'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </Section>

        {/* FAQ Section */}
        <Section id="faq" title="Συχνές Ερωτήσεις" withGradient>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem key={index} {...faq} index={index} />
            ))}
          </div>
        </Section>

        {/* Contact Section */}
        <Section
          id="contact"
          title="Επικοινώνησε μαζί μας"
          subtitle="Έχεις απορίες ή προτάσεις; Στείλε μας μήνυμα!"
          withGradient
        >
          <motion.form
            onSubmit={handleContactSubmit}
            className="max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <input
              type="text"
              name="website"
              value={contactForm.website}
              onChange={handleContactInputChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="sr-only"
            />

            <AnimatePresence>
              {contactSuccess && (
                <motion.div
                  id={successId}
                  role="alert"
                  className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    {contactSuccessMessage || '✓ Το μήνυμά σου στάλθηκε επιτυχώς!'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {contactError && (
                <motion.div
                  id={errorId}
                  role="alert"
                  className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <p className="text-red-700 dark:text-red-300 font-semibold">{contactError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor={firstId}
                  className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200"
                >
                  Όνομα *
                </label>
                <motion.input
                  id={firstId}
                  name="firstName"
                  value={contactForm.firstName}
                  onChange={handleContactInputChange}
                  required
                  autoComplete="given-name"
                  className="w-full rounded-xl border-2 border-[#f3c6dd] dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b7a] bg-white dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="π.χ. Μαρία"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label
                  htmlFor={lastId}
                  className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200"
                >
                  Επώνυμο
                </label>
                <motion.input
                  id={lastId}
                  name="lastName"
                  value={contactForm.lastName}
                  onChange={handleContactInputChange}
                  autoComplete="family-name"
                  className="w-full rounded-xl border-2 border-[#f3c6dd] dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b7a] bg-white dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="π.χ. Παπαδοπούλου"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor={emailId}
                className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200"
              >
                Email *
              </label>
              {/* 3. Client-side email validation via type and pattern */}
              <motion.input
                id={emailId}
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactInputChange}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                inputMode="email"
                autoComplete="email"
                className="w-full rounded-xl border-2 border-[#f3c6dd] dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b7a] bg-white dark:bg-gray-700 dark:text-white transition-all"
                placeholder="name@example.com"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor={msgId}
                className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200"
              >
                Μήνυμα *
              </label>
              <motion.textarea
                id={msgId}
                name="message"
                rows={6}
                value={contactForm.message}
                onChange={handleContactInputChange}
                required
                className="w-full rounded-xl border-2 border-[#f3c6dd] dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b7a] bg-white dark:bg-gray-700 dark:text-white resize-y transition-all"
                placeholder="Γράψε εδώ την απορία/πρότασή σου…"
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="mt-8 flex flex-col items-start gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">* Υποχρεωτικά πεδία</p>
              <motion.button
                type="submit"
                disabled={contactSubmitting}
                className="relative inline-flex items-center gap-2 px-8 py-4 bg-[#ff6b7a] hover:bg-[#e85563] text-white font-bold rounded-full shadow-lg disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">
                  {contactSubmitting ? 'Αποστολή…' : 'Αποστολή'}
                </span>
                <FiSend className="relative z-10 w-4 h-4" aria-hidden />
                <motion.div
                  className="absolute inset-0 bg-[#ffb0a4]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </motion.form>
        </Section>
      </div>
    </MotionConfig>
  );
};

export default HomePage;
