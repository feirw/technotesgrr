import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Calendar,
  CheckCircle2,
  Sparkles,
  Clock,
  BookOpen,
} from 'lucide-react';

const MerchPage: React.FC = () => {
  const instagramLink = 'https://instagram.com/technotesgr';

  return (
    <div className="min-h-screen bg-coral-wash dark:bg-[#3a2658] overflow-x-hidden text-gray-800 dark:text-gray-100">
      {/* 🌸 Hero Section */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 text-coral-accent dark:text-coral-light">
              Η Ατζέντα των <br /> Αριστούχων
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
              Δεν είναι απλά ένα ημερολόγιο. Είναι ο προσωπικός σου οδηγός για τις Πανελλήνιες.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-coral-wash text-coral-strong dark:bg-coral-accent/15 dark:text-coral-light font-bold text-sm border border-coral-accent/25"
            >
              <Sparkles className="w-4 h-4" />
              Coming Soon το καλοκαίρι (έντυπη έκδοση)
            </motion.div>

            <motion.a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-coral-accent hover:bg-coral-strong text-white rounded-2xl font-black text-xl shadow-2xl shadow-coral-accent/35 transition-colors"
            >
              <ShoppingBag />
              Digital έκδοση διαθέσιμη τώρα (στείλε μου στο instagram)
              
            </motion.a>
          </motion.div>

          {/* 📦 The Agenda Box Animation */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-coral-light/50 rounded-full blur-[120px] opacity-50 animate-pulse" />

            <div className="relative bg-white dark:bg-[#2d1c48] p-4 rounded-[2.5rem] shadow-2xl border border-coral-accent/15 dark:border-white/15 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-tr from-coral-wash to-coral-light/40 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center border-2 border-dashed border-coral-accent/35">
                {/* Visual Placeholder for the Agenda */}
                <img src="/images/ag1.jpg" alt="Logo" className="w-85 drop-shadow-2xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/*images of the agenda*/}
      <section className="py-20 px-6 bg-red dark:bg-purple/5 backdrop-blur-lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 text-coral-accent dark:text-coral-light">
            Μερικές σελίδες από την Ατζέντα!{' '}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              image: '/images/ag2.jpg',
            },
            {
              image: '/images/ag3.jpg',
            },
            {
              image: '/images/ag4.jpg',
            },
            {
              image: '/images/ag5.jpg',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-[#2d1c48] p-8 rounded-3xl shadow-lg border border-coral-accent/15 dark:border-white/15 text-center"
            >
              <img src={feature.image} alt={`Image ${i + 1}`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="py-20 px-6 bg-white/60 dark:bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-coral-accent dark:text-coral-light">Γιατί σου είναι απαραίτητη;</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calendar className="text-coral-accent" />,
                title: 'Πρόγραμμα Σχολείων-Φροντιστηρίων',
                desc: 'Πινακάκια για να τα γεμίσεις με τις ώρες σου.',
              },
              {
                icon: <Clock className="text-coral-accent" />,
                title: 'Ημερομηνίες Διαγωνισμάτων Σχολείο-Φροντιστήριο',
                desc: 'Για να είσαι πάντα συνεπής και να κάνεις έγκαιρα τις επαναλήψεις σου.',
              },
              {
                icon: <BookOpen className="text-coral-accent" />,
                title: 'Tips για τις πανελλήνιες',
                desc: 'Χρήσιμες συμβουλές για την διαχείριση της αγχωτικής καθημερινότητας.',
              },
              {
                icon: <CheckCircle2 className="text-coral-accent" />,
                title: 'Daily Journal',
                desc: 'Λειτουργεί και ως ημερολόγιο για να καταγράφεις τις σκέψεις σου.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-[#2d1c48] p-8 rounded-3xl shadow-lg border border-coral-accent/15 dark:border-white/15 text-center"
              >
                <div className="w-16 h-16 bg-coral-wash dark:bg-coral-accent/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MerchPage;
