import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import SliderCard from '../components/SliderCard.jsx';
import { Instagram, Music2 } from 'lucide-react';
import technotesLogo from '../assets/technotes_logo.png';

const BACKEND_URL = 'http://localhost:8001';

const reviewsData = [
  {
    name: 'Μαρία Παπαδοπούλου',
    rating: 5,
    description:
      'Οι σημειώσεις είναι εξαιρετικές! Με βοήθησαν πάρα πολύ να κατανοήσω την ύλη της πληροφορικής. Το quiz είναι διασκεδαστικό και εκπαιδευτικό!',
  },
  {
    name: 'Γιάννης Κωνσταντίνου',
    rating: 5,
    description:
      'Φανταστικό site! Οι flashcards με βοήθησαν να επαναλάβω γρήγορα όλες τις έννοιες. Τώρα νιώθω πιο σίγουρος για τις πανελλαδικές!',
  },
  {
    name: 'Ελένη Δημητρίου',
    rating: 4,
    description:
      'Πολύ καλή πλατφόρμα για προετοιμασία! Οι οπτικοποιήσεις των αλγορίθμων είναι πολύ χρήσιμες. Συνιστώ ανεπιφύλακτα!',
  },
  {
    name: 'Νίκος Αντωνίου',
    rating: 5,
    description: 'Οι ερωτήσεις είναι πολύ καλά δομημένες και με προετοιμάζουν σωστά.',
  },
  {
    name: 'Αγγελική Βασιλείου',
    rating: 5,
    description:
      'Εξαιρετικό εργαλείο μελέτης! Τα παιχνίδια οπτικοποίησης με βοήθησαν να καταλάβω καλύτερα τους αλγορίθμους. Ευχαριστώ πολύ!',
  },
];

const featuresData = [
  {
    title: 'Σημειώσεις',
    desc: 'Σημειώσεις που καλύπτουν σε βάθος όλη την θεωρία και τις μεθοδολογίες της ύλης',
  },
  {
    title: 'Quiz',
    desc: 'Τεστάρετε τις γνώσεις σας σε όλη την θεωρία του ΑΕΠΠ',
  },
  {
    title: 'Flashcards',
    desc: 'Επαναλάβετε γρήγορα και εύκολα τις βασικές έννοιες της θεωρίας',
  },
];

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      await response.json();
      setContactSuccess(true);
      setContactForm({ firstName: '', lastName: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Υπήρξε ένα πρόβλημα κατά την αποστολή της φόρμας.');
    }
    setContactSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#fff2f2] text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#ffa9a9] to-[#ffdada] text-white py-20 shadow-inner">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-lg backdrop-blur-md flex items-center justify-center shadow-md">
              <img
                src={technotesLogo}
                alt="Technotesgr Logo"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">Technotesgr</h1>
          <p className="text-xl sm:text-2xl mb-6">
            Οι καλύτερες σημειώσεις για ΑΕΠΠ - Πανελλαδικές Εξετάσεις
          </p>
          {nickname ? (
            <p className="text-lg font-semibold opacity-90">Καλώς ήρθες ξανά, {nickname}!</p>
          ) : (
            <p className="text-lg opacity-90">Πληροφορική Γ' Γενικού Λυκείου</p>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">Τι προσφέρουμε</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuresData.map((feat, i) => (
              <div
                key={i}
                className="group bg-white/60 dark:bg-[#1f1f1f]/70 backdrop-blur-md rounded-xl shadow-md p-6 text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-[#ffa9a9]/50"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white group-hover:text-[#ff7b7b] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <SliderCard
        title="Τι λένε οι μαθητές μας"
        data={reviewsData}
        containerClassName="bg-white/60 backdrop-blur-md"
        renderCard={(review) => (
          <div className="bg-[#fff2f2] rounded-xl p-8 text-center h-full flex flex-col justify-center">
            <div className="mb-4">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold">{review.name}</h3>
            </div>
            <p className="text-gray-600 italic">"{review.description}"</p>
          </div>
        )}
        sliderSettings={{ autoplaySpeed: 4000, pauseOnHover: true }}
      />

      <footer className="bg-white/80 backdrop-blur-md border-t border-[#ffdada] mt-16">
        <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Σχετικά με εμάς 🎓</h3>
            <p className="text-gray-600 text-sm">
              Το <strong>technotesgr</strong> δημιουργήθηκε για να βοηθήσει τους μαθητές της Γ'
              Λυκείου να προετοιμαστούν αποτελεσματικά για τις Πανελλαδικές Πληροφορικής,
              προσφέροντας σημειώσεις, quiz και διαδραστικά εργαλεία.
            </p>
          </div>

          {/* Quick Links */}
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

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Επικοινωνία 📬</h3>
            <div className="space-y-2 text-sm">
              <a
                href="https://www.instagram.com/technotesgr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00000] hover:underline hover:text-[#ff4d4d] font-medium"
              >
                👉 Instagram: @technotesgr
              </a>
              <br />
              <a
                href="https://www.tiktok.com/@technotesgr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00000] hover:underline hover:text-[#ff4d4d] font-medium"
              >
                👉 TikTok: @technotesgr
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white/60 backdrop-blur-md py-4 border-t border-[#ffdada]">
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
