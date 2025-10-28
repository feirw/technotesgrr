import React, { useCallback, useEffect, useId, useMemo, useRef, useState, Suspense } from 'react';
import { useAppContext } from '../contexts/AppContext';
import emailjs from '@emailjs/browser';
import technotesLogo from '../assets/technotes_logo.png';
import ChatWidget from '../components/ChatWidget.jsx';
import {
  motion,
  useScroll,
  useTransform,
  MotionConfig,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';

// Lazy-load βαρύτερα components
const SliderCard = React.lazy(() => import('../components/SliderCard.jsx'));

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
  {
    title: 'Σημειώσεις',
    desc: 'Καλύπτουν σε βάθος τη θεωρία και μεθοδολογίες της ύλης.',
    icon: '📚',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Quiz',
    desc: 'Δοκίμασε γνώσεις με έξυπνα, στοχευμένα ερωτήματα τα οποία έχουν εξεταστεί σε προηγούμενες Πανελλήνιες εξετάσεις.',
    icon: '🎯',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    title: 'Flashcards',
    desc: 'Γρήγορη επανάληψη σε όλες τις έννοιες του σχολικού βιβλίου.',
    icon: '🧠',
    gradient: 'from-blue-500 to-cyan-500',
  },
];

// FAQ Data
const faqData = [
  {
    question: 'Είναι δωρεάν η πλατφόρμα;',
    answer: 'Ναι! Το technotesgr είναι εντελώς δωρεάν για όλους τους μαθητές της Γ\' Λυκείου. Στόχος μας είναι να βοηθήσουμε όσο το δυνατόν περισσότερους μαθητές να προετοιμαστούν για τις Πανελλαδικές εξετάσεις.Μελλοντικά θα προστεθεί ένα merch site με σχολικά είδη για την υποστήριξη της πλατφόρμας. Επίσης, θα είναι διαθέσιμες προαιρετικές πληρωμές αν κάποιος θέλει πρόσβαση σε όλα τα καταγεγραμμένα μαθήματα της ύλης, για ευνόητους λόγους',
  },
  {
    question: 'Καλύπτει όλη την ύλη της Πληροφορικής;',
    answer: 'Ναι! Οι σημειώσεις μας καλύπτουν αναλυτικά όλη την ύλη του σχολικού βιβλίου Πληροφορικής Γ\' Λυκείου, με επιπλέον παραδείγματα και ασκήσεις.',
  },
  {
    question: 'Πώς μπορώ να παρακολουθήσω την πρόοδό μου;',
    answer: 'Μέσα από τα quiz και τα flashcards μπορείς να δεις τις απαντήσεις σου και να εντοπίσεις τα σημεία που χρειάζονται περισσότερη μελέτη. Κάθε quiz σου δίνει άμεσο feedback.',
  },
  {
    question: 'Μπορώ να χρησιμοποιήσω την πλατφόρμα από το κινητό μου;',
    answer: 'Απολύτως! Η πλατφόρμα είναι πλήρως responsive και λειτουργεί άψογα σε κινητά, tablets και υπολογιστές. Μπορείς να μελετάς όπου και όποτε θέλεις!',
  },
  {
    question: 'Πόσο συχνά ενημερώνεται το περιεχόμενο;',
    answer: 'Ενημερώνουμε τακτικά το περιεχόμενο με νέα quiz, flashcards και βελτιωμένες σημειώσεις. Παρακολουθούμε επίσης τις τάσεις των Πανελλαδικών για να προσθέτουμε σχετικό υλικό.',
  },
  {
    question: 'Μπορώ να κάνω ερωτήσεις αν δυσκολευτώ;',
    answer: 'Φυσικά! Μπορείς να επικοινωνήσεις μαζί μας μέσω της φόρμας επικοινωνίας ή μέσω των social media μας. Θα χαρούμε να σε βοηθήσουμε!',
  },
];

// ---------- Enhanced Motion variants ----------
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Floating animation for hero elements
const floatingAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// ---------- Enhanced UI Components ----------
const Section = ({ id, title, subtitle, className = '', children, withGradient = false }) => (
  <section id={id} className={`py-20 relative overflow-hidden ${className}`}>
    {withGradient && (
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/30 to-transparent dark:via-pink-900/10 pointer-events-none" />
    )}
    <div className="container mx-auto px-6 relative z-10">
      {title && (
        <motion.header
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 bg-clip-text text-transparent mb-4"
            variants={fadeInUp}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.header>
      )}
      {children}
    </div>
  </section>
);

// Enhanced Feature Card with glassmorphism and glow effects
const FeatureCard = ({ title, desc, icon, gradient, i }) => (
  <motion.article
    className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    aria-label={title}
    initial={{ opacity: 0, y: 30, rotateX: -15 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{
      type: 'spring',
      stiffness: 80,
      damping: 20,
      delay: i * 0.15,
    }}
    whileHover={{
      y: -10,
      scale: 1.02,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: { duration: 0.3 },
    }}
  >
    {/* Animated gradient background on hover */}
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      initial={{ scale: 0.8, rotate: 45 }}
      whileHover={{ scale: 1, rotate: 0 }}
    />

    {/* Glow effect */}
    <div
      className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}
    />

    <div className="relative z-10">
      <motion.div
        className="text-6xl mb-6 inline-block"
        whileHover={{
          scale: 1.2,
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 },
        }}
      >
        {icon}
      </motion.div>

      <motion.h3
        className="text-2xl font-bold mb-3 text-gray-900 dark:text-white"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        {title}
      </motion.h3>

      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{desc}</p>
    </div>
  </motion.article>
);

// Enhanced Star Rating with animations
const StarRating = ({ value = 0 }) => {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex justify-center gap-1" aria-label={`Βαθμολογία ${clamped} από 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className={`text-2xl ${i < clamped ? 'text-yellow-400' : 'text-gray-300'}`}
          aria-hidden="true"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          whileHover={{
            scale: 1.3,
            rotate: 360,
            transition: { duration: 0.4 },
          }}
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
      <span className="sr-only">{clamped}/5</span>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer, index }) => {
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
        whileHover={{ backgroundColor: 'rgba(236, 72, 153, 0.05)' }}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-8 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg
            className="w-6 h-6 text-pink-600 dark:text-pink-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
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
            <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Floating particles background component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-pink-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ---------- Main Component ----------
const HomePage = () => {
  const { nickname } = useAppContext();

  // Enhanced scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 100,
    damping: 30,
  });

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    website: '',
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

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
    if (contactForm.website) return 'Spam detected.';
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

      try {
        const templateParams = {
          firstName: contactForm.firstName.trim(),
          lastName: contactForm.lastName.trim(),
          email: contactForm.email.trim(),
          message: contactForm.message.trim(),
        };

        await emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          templateParams,
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        );

        setContactSuccess(true);
        setContactForm({ firstName: '', lastName: '', email: '', message: '', website: '' });
        setTimeout(() => setContactSuccess(false), 5000);
      } catch (err) {
        console.error('EmailJS error:', err);
        setContactError('Κάτι πήγε στραβά. Προσπάθησε ξανά.');
      } finally {
        setContactSubmitting(false);
      }
    },
    [contactForm, validate]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
        {/* Enhanced Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 origin-left z-50 shadow-lg shadow-pink-500/50"
          style={{ scaleX }}
        />

        {/* Hero Section with Parallax */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <FloatingParticles />

          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900"
            animate={{
              background: [
                'linear-gradient(to bottom right, #fce7f3, #ffe4e6, #fee2e2)',
                'linear-gradient(to bottom right, #ffe4e6, #fee2e2, #fce7f3)',
                'linear-gradient(to bottom right, #fee2e2, #fce7f3, #ffe4e6)',
                'linear-gradient(to bottom right, #fce7f3, #ffe4e6, #fee2e2)',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 20,
                delay: 0.2,
              }}
            >
              <motion.img
                src={technotesLogo}
                alt="technotes logo"
                className="mx-auto w-48 md:w-64 mb-8 drop-shadow-2xl"
                animate={floatingAnimation}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 },
                }}
              />
            </motion.div>

            <motion.h1
              className="text-xl md:text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Γράψε 100 στην Πληροφορική🎓
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Η <span className="font-bold text-pink-600">τέλεια πλατφόρμα</span> προετοιμασίας για
              τις Πανελλήνιες.
              <br />
            </motion.p>
          </div>
        </section>

        {/* Features Section */}
        <Section
          id="features"
          title="Τι προσφέρουμε;"
          subtitle="Όλα όσα χρειάζεσαι για να πετύχεις στις Πανελλήνιες"
          withGradient
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {featuresData.map((feat, idx) => (
              <FeatureCard key={feat.title} {...feat} i={idx} />
            ))}
          </motion.div>
        </Section>

        {/* Reviews Section */}
        <Section
          id="reviews"
          title="Τι λένε οι μαθητές μας;"
          className="bg-gradient-to-b from-transparent via-pink-50/50 to-transparent dark:via-purple-900/10"
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <motion.div
                  className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            }
          >
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {reviewsData.map((review, idx) => (
                <motion.div
                  key={idx}
                  className="mb-8 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: { duration: 0.3 },
                  }}
                >
                  <StarRating value={review.rating} />
                  <p className="text-gray-700 dark:text-gray-300 mt-4 text-lg leading-relaxed italic">
                    "{review.description}"
                  </p>
                  <p className="text-pink-600 dark:text-pink-400 font-bold mt-4 text-right">
                    — {review.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </Suspense>
        </Section>

        {/* FAQ Section */}
        <Section
          id="faq"
          title="Συχνές Ερωτήσεις"
          subtitle="Απαντήσεις στις πιο κοινές απορίες σου"
          withGradient
        >
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
            {/* Honeypot */}
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

            {/* Success Message */}
            <AnimatePresence>
              {contactSuccess && (
                <motion.div
                  id={successId}
                  role="alert"
                  className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 rounded-lg"
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                >
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    ✓ Το μήνυμά σου στάλθηκε επιτυχώς!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {contactError && (
                <motion.div
                  id={errorId}
                  role="alert"
                  className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg"
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
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
                  className="w-full rounded-xl border-2 border-pink-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="π.χ. Μαρία"
                  whileFocus={{ scale: 1.02, borderColor: '#ec4899' }}
                  transition={{ duration: 0.2 }}
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
                  className="w-full rounded-xl border-2 border-pink-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="π.χ. Παπαδοπούλου"
                  whileFocus={{ scale: 1.02, borderColor: '#ec4899' }}
                  transition={{ duration: 0.2 }}
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
              <motion.input
                id={emailId}
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactInputChange}
                required
                inputMode="email"
                autoComplete="email"
                className="w-full rounded-xl border-2 border-pink-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="name@example.com"
                whileFocus={{ scale: 1.02, borderColor: '#ec4899' }}
                transition={{ duration: 0.2 }}
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
                className="w-full rounded-xl border-2 border-pink-200 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y transition-all"
                placeholder="Γράψε εδώ την απορία/πρότασή σου…"
                whileFocus={{ scale: 1.01, borderColor: '#ec4899' }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <div className="mt-8 flex items-center gap-4">
              <motion.button
                type="submit"
                disabled={contactSubmitting}
                className="relative px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">
                  {contactSubmitting ? 'Αποστολή… ⏳' : 'Αποστολή ✉️'}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 to-red-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <p className="text-sm text-gray-500 dark:text-gray-400">* Υποχρεωτικά πεδία</p>
            </div>
          </motion.form>
        </Section>

        {/* <ChatWidget nickname={nickname} /> */}

        {/* Enhanced Footer */}
        <footer className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 border-t border-pink-200 dark:border-gray-700 mt-20">
          <div className="container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* --- Σχετικά με εμάς --- */}
            <motion.div
              {...fadeIn}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Σχετικά με εμάς 🎓
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Το <strong className="text-pink-600 dark:text-pink-400">technotesgr</strong> βοηθά
                μαθητές Γ' Λυκείου να προετοιμαστούν αποτελεσματικά για τις Πανελλαδικές
                Πληροφορικής — σημειώσεις, quiz & διαδραστικά εργαλεία.
              </p>
            </motion.div>

            {/* --- Επικοινωνία --- */}
            <motion.div
              {...fadeIn}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                Επικοινωνία
              </h3>
              <div className="space-y-3">
                {[
                  {
                    href: 'https://www.instagram.com/technotesgr/',
                    label: 'Instagram: @technotesgr',
                  },
                  { href: 'https://www.tiktok.com/@technotesgr', label: 'TikTok: @technotesgr' },
                  {
                    href: 'https://www.linkedin.com/company/technotesgr/',
                    label: 'LinkedIn: technotesgr',
                  },
                ].map((social) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-transform duration-200"
                    whileHover={{ x: 6, scale: 1.05 }}
                  >
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* --- Όροι και Δεδομένα --- */}
            <motion.div
              {...fadeIn}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                Όροι και Δεδομένα
              </h3>
              <div className="space-y-2">
                {[
                  { href: '/privacy-policy', label: 'Όροι Χρήσης & Πολιτική Απορρήτου' },
                  { href: '/data', label: 'Προσωπικά Δεδομένα' },
                ].map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-transform duration-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* --- Κάτω μέρος --- */}
          <div className="bg-gradient-to-r from-pink-100/40 to-rose-100/40 dark:from-gray-800/40 dark:to-purple-900/30 backdrop-blur border-t border-pink-200 dark:border-gray-700 py-6">
            <div className="container mx-auto px-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                © {currentYear} technotesgr. All rights reserved.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Made with{' '}
                <motion.span
                  className="inline-block text-pink-600"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ♡
                </motion.span>{' '}
                by <span className="font-semibold">feirw, areynbaw & deathwish</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
};

export default HomePage;