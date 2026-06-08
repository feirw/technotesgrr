import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  BookOpenCheck,
  GraduationCap,
  Lightbulb,
  Target,
  Users,
} from 'lucide-react';

// --- Types & Interfaces ---

interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

// --- Motion Variants ---

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// --- Data ---

const funFactsData: string[] = [
  'Λατρεύω να μιλάω και να μεταδίδω την γνώση μου στους άλλους.',
  'Πηγαίνω συνέχεια σε events σχετικά με την τεχνολογία και την εκπαίδευση.',
  'Διαβάζω συνεχώς για νέες τεχνολογίες και εφαρμογές τους στην διδακτική.',
  'Ονειρεύομαι να ανοίξω το δικό μου φροντιστήριο.',
];

const timelineData: TimelineItem[] = [
  {
    period: 'Σεπτέμβριος 2022',
    title: 'Ξεκίνημα προετοιμασίας',
    description: 'Ξεκίνησα την προετοιμασία μου για την Πληροφορική.',
  },
  {
    period: 'Οκτώβριος 2022 - Μάρτιος 2023',
    title: 'Δύσκολη αρχή',
    description: 'Για αρκετούς μήνες δεν καταλάβαινα σχεδόν τίποτα και ένιωθα ότι δεν προχωράω.',
  },
  {
    period: 'Μάρτιος 2023',
    title: 'Καθοριστική ανακάλυψη',
    description:
      'Ανακάλυψα το panellhnies.com, που είχε πολύ καλό υλικό για την Πληροφορική και με βοήθησε σημαντικά.',
  },
  {
    period: 'Μάιος 2023',
    title: 'Νέα αρχή',
    description:
      "Ξεκίνησα ξανά μαθήματα για την Γ' Λυκείου και όλα άρχισαν να βγάζουν περισσότερο νόημα.",
  },
  {
    period: 'Σεπτέμβριος 2023',
    title: 'Πρώτη μεγάλη επιτυχία',
    description: 'Πέτυχα το πρώτο μου 90+ σε διαγώνισμα.',
  },
  {
    period: 'Δεκέμβριος 2023',
    title: '1η επανάληψη',
    description: 'Ολοκλήρωσα την πρώτη μεγάλη επανάληψη της ύλης.',
  },
  {
    period: 'Πάσχα 2024',
    title: 'Τελική επανάληψη',
    description: 'Έκανα την τελευταία επανάληψη πριν τις εξετάσεις.',
  },
  {
    period: 'Ιούνιος 2024',
    title: 'Εξέταση Πληροφορικής',
    description: 'Ημέρα Πανελλαδικής εξέτασης στο μάθημα της Πληροφορικής.',
  },
  {
    period: 'Ιούνιος 2024',
    title: 'Αποτελέσματα',
    description: 'Βαθμός Πληροφορικής: 99/100.',
  },
  {
    period: 'Ιούλιος 2024',
    title: 'Επιτυχία στο ΕΚΠΑ',
    description: 'Πέρασα 10η στο Τμήμα Πληροφορικής και Τηλεπικοινωνιών του ΕΚΠΑ.',
  },
  {
    period: 'Ιούλιος 2024',
    title: 'Γέννηση του technotesgr',
    description: 'Ξεκίνησε το technotesgr στο Instagram.',
  },
  {
    period: 'Οκτώβριος 2024',
    title: 'Πρώτο ιδιαίτερο',
    description: 'Έκανα το πρώτο μου ιδιαίτερο μάθημα.',
  },
  {
    period: 'Φεβρουάριος 2025 - Ιούνιος 2025',
    title: 'Αφιλοκερδής βοήθεια',
    description: 'Βοήθησα αφιλοκερδώς μια κοπέλα στην προετοιμασία της για τις Πανελλήνιες.',
  },
  {
    period: 'Ιούλιος 2025',
    title: 'Νέα βήματα',
    description: 'Άνοιξα TikTok,Youtube και LinkedIn στο technotesgr και ξεκίνησα την ιστοσελίδα.',
  },
  {
    period: 'Σήμερα',
    title: 'Συνεχής εξέλιξη',
    description:
      'Συνεχίζω να αναπτύσσω το technotesgr και να στηρίζω μαθητές στην πορεία τους προς τις Πανελλήνιες.',
  },
];

const achievementImages = [
  '/images/eg1.jpg',
  '/images/eg2.jpg',
  '/images/eg3.jpg',
  '/images/eg4.jpg',
  '/images/eg5.jpg',
  '/images/eg6.jpg',
];

const personalCardImages = ['/images/c2.png', '/images/c3.png'];

// --- Component ---

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-coral-wash/90 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-coral/35 dark:bg-coral-accent/25 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-coral-light/40 dark:bg-coral-strong/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-coral-wash dark:bg-coral-accent/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-coral-wash text-coral-strong font-semibold border border-coral-accent/20"
          >
            <GraduationCap className="w-4 h-4" />
            technotesgr
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-coral-accent dark:text-coral-light">
              Σχετικά με εμένα
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Γεια σου! Είμαι η Ελένη, δημιουργός του{' '}
            <span className="font-bold text-coral-accent dark:text-coral-light">technotesgr</span>
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Achievements Gallery */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-coral-accent dark:text-coral-light mb-4">
                Some cool moments
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievementImages.map((imageSrc, i) => (
                  <div
                    key={imageSrc}
                    className="aspect-square overflow-hidden rounded-2xl border border-coral-accent/25 dark:border-gray-700 bg-coral-wash dark:bg-gray-700/40"
                  >
                    <img
                      src={imageSrc}
                      alt={`Επίτευγμα ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Personal Card Gallery */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-coral-accent dark:text-coral-light mb-4">
                Προσωπική κάρτα
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personalCardImages.map((imageSrc, i) => (
                  <div
                    key={imageSrc}
                    className="aspect-[16/10] overflow-hidden rounded-2xl border border-coral-accent/25 dark:border-gray-700 bg-white dark:bg-gray-900"
                  >
                    <img
                      src={imageSrc}
                      alt={`Προσωπική εικόνα ${i + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              {[
                {
                  label: 'Επίδοση Πανελλαδικών',
                  value: '19.000 μόρια',
                  icon: <Target className="w-5 h-5 text-coral-accent" />,
                },
                {
                  label: 'Βαθμός Πληροφορικής',
                  value: '99/100',
                  icon: <BookOpenCheck className="w-5 h-5 text-coral-accent" />,
                },
                {
                  label: 'Αποστολή',
                  value: 'Προσβάσιμη γνώση',
                  icon: <Users className="w-5 h-5 text-coral-accent" />,
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeInUp}
                  className="rounded-2xl border border-coral-accent/25 bg-white/80 dark:bg-gray-800/80 p-5 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                  </div>
                  <p className="text-xl font-black text-coral-accent">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Story Section */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.div className="text-coral-accent" variants={fadeInUp}>
                  <BookOpenCheck className="w-9 h-9" />
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-coral-accent dark:text-coral-light"
                  variants={fadeInUp}
                >
                  Η ιστορία μου
                </motion.h2>
              </motion.div>

              <motion.div
                className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.p variants={fadeIn}>
                  Είμαι η Ελένη και είμαι φοιτήτρια του τμήματος Πληροφορικής και Τηλεπικοινωνιών
                  του Εθνικού και Καποδιστριακού Πανεπιστημίου Αθηνών. Στις πανελλήνιες του 2024
                  συγκέντρωσα 19.000 μόρια και συγκεκριμένα στην πληροφορική πέτυχα 99/100. Επίσης,
                  κατάγομαι από ένα μικρό χωριό της Φθιώτιδας.
                </motion.p>

                <motion.p variants={fadeIn}>
                  Όταν ήμουν μαθήτρια Γ' Λυκείου, κατάλαβα πόσο δύσκολο μπορεί να είναι να βρεις
                  οργανωμένο και ποιοτικό υλικό μελέτης. Αυτή η εμπειρία με ώθησε να δημιουργήσω μια
                  πλατφόρμα που θα έκανε τη μελέτη πιο εύκολη και αποτελεσματική. Επίσης, η
                  εξαιρετική καθηγήτρια που με ανέλαβε στις πανελλήνιες, με ενέπνευσε να ακολουθήσω
                  αυτόν τον τομέα. Δεν μου άρεσε καθόλου η πληροφορική στην αρχή. Όμως, η κυρία{' '}
                  <a
                    href="https://www.vrisko.gr/details/21a516312h3ja01e0bd_4d_26h3j0jc0#:~:text=E%20%2D%20%CE%9C%CE%91%CE%98%CE%97%CE%A3%CE%97%20%2D%20e%2D%CE%BC%CE%AC%CE%B8%CE%B7%CF%83%CE%B7%20(%CE%A4%CF%83%CF%8E%CE%BD%CE%BF%CF%85%20%CE%95%CE%BB%CE%AD%CE%BD%CE%B7%20%CE%91.)&text=%CE%9C%CE%B1%CE%B8%CE%AE%CE%BC%CE%B1%CF%84%CE%B1%20%CE%A0%CF%81%CE%BF%CE%B3%CF%81%CE%B1%CE%BC%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CE%BC%CE%BF%CF%8D%2C%20%CE%A6%CF%81%CE%BF%CE%BD%CF%84%CE%B9%CF%83%CF%84%CE%AE%CF%81%CE%B9%CE%B1%20%CE%9C%CE%AD%CF%83%CE%B7%CF%82%20%CE%95%CE%BA%CF%80%CE%B1%CE%AF%CE%B4%CE%B5%CF%85%CF%83%CE%B7%CF%82,%CE%A6%CE%98%CE%99%CE%A9%CE%A4%CE%99%CE%A4%CE%91%CE%A3%20%2C%206976681079%20%7C%20vrisko.gr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral-accent dark:text-coral-light font-bold hover:underline"
                  >
                    Λένα Τσώνου
                  </a>{' '}
                  με έκανε να την αγαπήσω!
                </motion.p>

                <motion.p variants={fadeIn}>
                  Το technotesgr δεν είναι απλά μια ιστοσελίδα. Είναι μια συνεχής προσπάθεια να
                  γίνει η εκπαίδευση πιο δομημένη, πρακτική και προσβάσιμη για κάθε μαθητή.
                </motion.p>
                <motion.p variants={fadeIn}>
                  Αυτή η σελίδα δεν θα μπορούσε να γίνει χωρίς τον{' '}
                  <a
                    href="https://github.com/mgiannopoulos24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-coral-accent dark:text-coral-light hover:underline"
                  >
                    deathwish
                  </a>{' '}
                  και την{' '}
                  <a
                    href="https://github.com/a-reynbaw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-coral-accent dark:text-coral-light hover:underline"
                  >
                    a‑reynbaw
                  </a>
                  .
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              className="bg-gradient-to-br from-coral-wash to-coral-light/20 dark:from-gray-800/80 dark:to-purple-900/30 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-12 border border-coral-accent/25 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.div className="text-coral-accent" variants={fadeInUp}>
                  <Target className="w-9 h-9" />
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-coral-accent dark:text-coral-light"
                  variants={fadeInUp}
                >
                  Η δουλειά μου
                </motion.h2>
              </motion.div>

              <motion.p
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg"
                variants={fadeIn}
              >
                Πέρα από το technotesgr, ασχολούμαι ενεργά με την εκπαίδευση. Στείλε μου στο
                Instagram μήνυμα αν θέλεις να μάθεις περισσότερα.
                <a
                  href="https://www.instagram.com/technotesgr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral-accent dark:text-coral-light font-bold hover:underline"
                >
                  {' '}
                  @technotesgr
                </a>
              </motion.p>
            </motion.div>

            {/* Fun Facts */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.div className="text-coral-accent" variants={fadeInUp}>
                  <Lightbulb className="w-9 h-9" />
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-coral-accent dark:text-coral-light"
                  variants={fadeInUp}
                >
                  Fun Facts About Me
                </motion.h2>
              </motion.div>

              <motion.ul
                className="space-y-4"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
              >
                {funFactsData.map((fact, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-base sm:text-lg"
                    variants={fadeIn}
                    whileHover={{
                      x: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <span className="flex-shrink-0 w-2 h-2 bg-coral-accent rounded-full mt-2" />
                    <span>{fact}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Timeline */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-coral-accent dark:text-coral-light mb-8">
                Timeline 2022 - Σήμερα
              </h2>

              <div className="space-y-5">
                {timelineData.map((item, idx) => (
                  <motion.div
                    key={`${item.period}-${idx}`}
                    className="relative pl-6 sm:pl-8 pb-4 border-l-2 border-coral-accent/30"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <span className="absolute -left-[7px] sm:-left-[9px] top-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-coral-accent" />
                    <p className="text-sm font-bold text-coral-accent mb-1">{item.period}</p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
