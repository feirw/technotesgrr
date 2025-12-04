import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';

// Motion variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const AboutPage = () => {
  const { isDark } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-rose-300 dark:bg-rose-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: 0.2,
            }}
            className="mb-8"
          ></motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 bg-clip-text text-transparent">
              Σχετικά με εμένα
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Γεια σου! Είμαι η Ελένη, δημιουργός του{' '}
            <span className="font-bold text-pink-600 dark:text-pink-400">technotesgr</span>
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto space-y-16">
            {/* Story Section */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50"
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
                <motion.div
                  className="text-4xl"
                  variants={fadeInUp}
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  📖
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                  variants={fadeInUp}
                >
                  Η ιστορία μου
                </motion.h2>
              </motion.div>

              <motion.div
                className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.p variants={fadeIn}>
                  Είμαι η Ελένη και είμαι φοιτήτρια του τμήματος Πληροφορικής και Τηλεπικοινωνιών
                  του Εθνικού και Καποδιστριακού Πανεπιστημίου Αθηνών. Στις πανελλήνιες του 2024
                  συγκέντρωσα 19.000 μόρια και συγκεκριμένα στην πληροφορική πέτυχα 99/100.Επίσης,
                  κατάγομαι από ένα μικρό χωριό της Φθιώτιδας.
                </motion.p>

                <motion.p variants={fadeIn}>
                  Όταν ήμουν μαθήτρια Γ' Λυκείου, κατάλαβα πόσο δύσκολο μπορεί να είναι να βρεις
                  οργανωμένο και ποιοτικό υλικό μελέτης. Αυτή η εμπειρία με ώθησε να δημιουργήσω μια
                  πλατφόρμα που θα έκανε τη μελέτη πιο εύκολη και αποτελεσματική.Επίσης , η
                  εξαιρετική καθηγήτρια που με ανέλαβε στις πανελλήνιες, με ενέπνευσε να ακολουθήσω
                  αυτόν τον τομέα. Δεν μου άρεσε καθόλου η πληροφορική στην αρχή. Όμως, η κυρία{' '}
                  <a
                    href="https://www.vrisko.gr/details/21a516312h3ja01e0bd_4d_26h3j0jc0#:~:text=E%20%2D%20%CE%9C%CE%91%CE%98%CE%97%CE%A3%CE%97%20%2D%20e%2D%CE%BC%CE%AC%CE%B8%CE%B7%CF%83%CE%B7%20(%CE%A4%CF%83%CF%8E%CE%BD%CE%BF%CF%85%20%CE%95%CE%BB%CE%AD%CE%BD%CE%B7%20%CE%91.)&text=%CE%9C%CE%B1%CE%B8%CE%AE%CE%BC%CE%B1%CF%84%CE%B1%20%CE%A0%CF%81%CE%BF%CE%B3%CF%81%CE%B1%CE%BC%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CE%BC%CE%BF%CF%8D%2C%20%CE%A6%CF%81%CE%BF%CE%BD%CF%84%CE%B9%CF%83%CF%84%CE%AE%CF%81%CE%B9%CE%B1%20%CE%9C%CE%AD%CF%83%CE%B7%CF%82%20%CE%95%CE%BA%CF%80%CE%B1%CE%AF%CE%B4%CE%B5%CF%85%CF%83%CE%B7%CF%82,%CE%A6%CE%98%CE%99%CE%A9%CE%A4%CE%99%CE%94%CE%91%CE%A3%20%2C%206976681079%20%7C%20vrisko.gr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 dark:text-pink-400 font-bold"
                  >
                    Λένα Τσώνου
                  </a>{' '}
                  με έκανε να την αγαπήσω!
                </motion.p>

                <motion.p variants={fadeIn}>
                  Το technotesgr δεν είναι απλά μια ιστοσελίδα - είναι το όνειρό μου να κάνω την
                  εκπαίδευση πιο προσβάσιμη για όλους!
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-800/80 dark:to-purple-900/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-pink-200/50 dark:border-gray-700/50"
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
                <motion.div
                  className="text-4xl"
                  variants={fadeInUp}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  🎯
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                  variants={fadeInUp}
                >
                  Η δουλειά μου
                </motion.h2>
              </motion.div>

              <motion.p
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                variants={fadeIn}
              >
                Πέρα από το technotesgr, ασχολούμαι ενεργά με την εκπαίδευση και παραδίδω ιδιαίτερα
                μαθήματα πληροφορικής σε μαθητές Β' και Γ' λυκείου. Στείλε μου στο instagram μήνυμα
                αν θέλεις να μάθεις περισσότερα!
                <a
                  href="https://www.instagram.com/technotesgr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 dark:text-pink-400 font-bold"
                >
                {' '}@technotesgr
                </a>
              </motion.p>
            </motion.div>

            {/* Skills/Values Section */}
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              {[
                {
                  icon: '💡',
                  title: 'Καινοτομία',
                  desc: 'Χρησιμοποιώ σύγχρονες τεχνολογίες για να δημιουργώ διαδραστικά εργαλεία μάθησης.',
                },
                {
                  icon: '❤️',
                  title: 'Πάθος',
                  desc: 'Λατρεύω την εκπαίδευση και τον προγραμματισμό, και θέλω να τα μοιραστώ με τον κόσμο.',
                },
                {
                  icon: '🤝',
                  title: 'Κοινότητα',
                  desc: 'Πιστεύω στη δύναμη της κοινότητας και της συνεργασίας για καλύτερα αποτελέσματα.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-700/50 text-center group"
                  variants={fadeInUp}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.div
                    className="text-5xl mb-4 inline-block"
                    whileHover={{
                      scale: 1.3,
                      rotate: 360,
                      transition: { duration: 0.5 },
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Fun Facts */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50"
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
                <motion.div
                  className="text-4xl"
                  variants={fadeInUp}
                  animate={{
                    rotate: [0, -20, 20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  ✨
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
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
                {[
                  'Λατρεύω να μιλάω και να μεταδίδω την γνώση μου στους άλλους.',
                  'Πηγαίνω συνέχεια σε events σχετικά με την τεχνολογία και την εκπαίδευση.',
                  'Διαβάζω συνεχώς για νέες τεχνολογίες και frameworks.',
                  'Ονειρεύομαι να γίνω καθηγήτρια πληροφορικής.',
                  'Μου αρέσει να τρωω γλυκά όσο προγραμματίζω!',
                ].map((fact, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-lg"
                    variants={fadeIn}
                    whileHover={{
                      x: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <span className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-2" />
                    <span>{fact}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative Bottom Section */}
      <section className="py-12 bg-gradient-to-r from-pink-100/40 to-rose-100/40 dark:from-gray-800/40 dark:to-purple-900/30">
        <div className="container mx-auto px-6 text-center">
          <motion.p
            className="text-gray-700 dark:text-gray-300 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ευχαριστώ που διαβάσατε για εμένα! 🙏
          </motion.p>
          <motion.p
            className="text-pink-600 dark:text-pink-400 font-bold mt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Made with{' '}
            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ♡
            </motion.span>
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
