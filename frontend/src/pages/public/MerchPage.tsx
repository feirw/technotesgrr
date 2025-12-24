import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  Clock, 
  BookOpen 
} from 'lucide-react';

const MerchPage: React.FC = () => {
  // Αντικατάστησε το link με το δικό σου Vinted προφίλ
  const vintedLink = "https://www.vinted.gr/member/YOUR_PROFILE_ID";

  return (
    <div className="min-h-screen bg-[#fff5f7] dark:bg-gray-900 overflow-x-hidden text-gray-800 dark:text-gray-100">
      
      {/* 🌸 Hero Section */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent">
              Η Ατζέντα των <br /> Αριστούχων 
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
              Δεν είναι απλά ένα ημερολόγιο. Είναι ο προσωπικός σου οδηγός για τις Πανελλήνιες.
            </p>
            
            <motion.a
              href={vintedLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-pink-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-pink-500/40 transition-all"
            >
              <ShoppingBag />
              Βρες την στο Vinted
            </motion.a>
          </motion.div>

          {/* 📦 The Agenda Box Animation */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-pink-300 rounded-full blur-[120px] opacity-40 animate-pulse" />
            
            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-[2.5rem] shadow-2xl border border-pink-100 dark:border-gray-700 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-tr from-pink-50 to-pink-200 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center border-2 border-dashed border-pink-300">
                
                {/* Visual Placeholder for the Agenda */}
                <img
                  src="/images/fro.jpg"
                  alt="Logo"
                  className="w-85 drop-shadow-2xl"
                />
                

               
              </div>
            </div>

     
          </motion.div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="py-20 px-6 bg-white/60 dark:bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 italic text-pink-600">Γιατί είναι απαραίτητη;</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Calendar className="text-pink-500" />, 
                title: "Πρόγραμμα Σχολείων-Φροντιστηρίων", 
                desc: "Πινακάκια για να τα γεμίσεις με τις ώρες σου." 
              },
              { 
                icon: <Clock className="text-pink-500" />, 
                title: "Ημερομηνίες Διαγωνισμάτων Σχολείο-Φροντιστήριο", 
                desc: "Για να είσαι πάντα συνεπής και να κάνεις έγκαιρα τις επαναλήψεις σου." 
              },
              { 
                icon: <BookOpen className="text-pink-500" />, 
                title: "Tips για τις πανελλήνιες", 
                desc: "Χρήσιμες συμβουλές για την διαχείριση της αγχωτικής καθημερινότητας." 
              },
              { 
                icon: <CheckCircle2 className="text-pink-500" />, 
                title: "Daily Journal", 
                desc: "Λειτουργεί και ως ημερολόγιο για να καταγράφεις τις σκέψεις σου." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-pink-50 dark:border-gray-700 text-center"
              >
                <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛒 Call to Action */}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-pink-500 to-rose-400 p-12 rounded-[3rem] text-white shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
            <ShoppingBag size={200} />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10 italic">
            Βάλε τις Πανελλήνιες σε μια τάξη...Σήμερα!
          </h2>
          <p className="text-xl text-pink-50 mb-10 relative z-10 opacity-90 font-medium">
            Κάνε την δική σου πριν εξαντληθούν τα αποθέματα!Αγοράζοντάς την,εξασφαλίζεις και 24/7 καθοδήγηση για το διάβασμά σου από εμένα.Στείλε μου στο instagram!
          </p>
          
          <motion.a
            href={vintedLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 bg-white text-pink-600 px-12 py-5 rounded-2xl font-black text-2xl shadow-xl relative z-10 transition-all"
          >
            ΑΓΟΡΑ ΤΩΡΑ
          </motion.a>

          
        </motion.div>
      </section>

     
    </div>
  );
};

export default MerchPage;