import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Εισάγουμε το Link για πλοήγηση
import { useAppContext } from '../contexts/AppContext'; // 1. Εισάγουμε το hook για το context
import SliderCard from '../components/SliderCard.jsx';
import { Instagram, Youtube } from 'lucide-react';
import technotesLogo from '../assets/technotes_logo.jpg';

const BACKEND_URL = 'http://localhost:8001';

// Τα δεδομένα για τα reviews παραμένουν τοπικά σε αυτή τη σελίδα.
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
    description:
      'Το leaderboard με κίνητρο να συνεχίσω να εξασκούμαι! Οι ερωτήσεις είναι πολύ καλά δομημένες και με προετοιμάζουν σωστά.',
  },
  {
    name: 'Αγγελική Βασιλείου',
    rating: 5,
    description:
      'Εξαιρετικό εργαλείο μελέτης! Τα παιχνίδια οπτικοποίησης με βοήθησαν να καταλάβω καλύτερα τους αλγορίθμους. Ευχαριστώ πολύ!',
  },
];

const HomePage = () => {
  // 2. Παίρνουμε τα δεδομένα που χρειαζόμαστε από το context
  const { nickname, leaderboard, loadingLeaderboard } = useAppContext();

  // Η κατάσταση για τη φόρμα επικοινωνίας παραμένει τοπική, γιατί δεν χρειάζεται σε άλλες σελίδες.
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-400 to-pink-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-pink-200 rounded-lg flex items-center justify-center">
              <img
                src={technotesLogo}
                alt="Technotesgr Logo"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Technotesgr</h1>
          <p className="text-lg sm:text-xl mb-8">
            Οι καλύτερες σημειώσεις για ΑΕΠΠ - Πανελλαδικές Εξετάσεις
          </p>
          {/* 3. Εξατομικευμένο μήνυμα αν ο χρήστης έχει συνδεθεί */}
          {nickname ? (
            <p className="text-base sm:text-lg opacity-90 font-semibold">
              Καλώς ήρθες ξανά, {nickname}!
            </p>
          ) : (
            <p className="text-base sm:text-lg opacity-90">Πληροφορική Γ' Γενικού Λυκείου</p>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-12">
            Τι προσφέρουμε
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Σημειώσεις</h3>
              <p className="text-gray-600">
                Σημειώσεις που καλύπτουν σε βάθος όλη την θεωρία και τις μεθοδολογίες της ύλης
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Quiz</h3>
              <p className="text-gray-600">Τεστάρετε τις γνώσεις σας σε όλη την θεωρία του ΑΕΠΠ</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Leaderboard</h3>
              <p className="text-gray-600">Ανταγωνιστείτε με άλλους μαθητές!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ΝΕΑ ΕΝΟΤΗΤΑ: Leaderboard Preview */}
      <div className="pb-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-12">
            Top Παίκτες
          </h2>
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
            {loadingLeaderboard ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : leaderboard.length === 0 ? (
              <p className="text-center text-gray-500">
                Κανείς δεν έχει παίξει ακόμα. Γίνε ο πρώτος!
              </p>
            ) : (
              <div className="space-y-4">
                {leaderboard.slice(0, 3).map((entry, index) => (
                  <div
                    key={entry.nickname}
                    className="flex items-center justify-between p-3 bg-pink-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl font-bold text-pink-600 w-8 text-center">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="font-semibold text-gray-800">{entry.nickname}</span>
                    </div>
                    <span className="font-bold text-gray-700">{entry.total_points} πόντοι</span>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-6">
              <Link to="/leaderboard" className="text-pink-600 font-semibold hover:underline">
                Δες ολόκληρη την κατάταξη →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <SliderCard
        title="Τι λένε οι μαθητές μας"
        data={reviewsData}
        containerClassName="bg-white"
        renderCard={(review, index) => (
          <div className="bg-pink-50 rounded-xl p-8 text-center h-full flex flex-col justify-center">
            <div className="mb-4">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{review.name}</h3>
            </div>
            <p className="text-gray-600 italic">"{review.description}"</p>
          </div>
        )}
        sliderSettings={{ autoplaySpeed: 4000, pauseOnHover: true }}
      />

      {/* Contact Section */}
      <div className="py-16 bg-pink-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-12">
            Επικοινωνία
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <p className="text-center text-gray-600 mb-8">
                Έχετε ερωτήσεις ή προτάσεις; Στείλτε μας μήνυμα και θα επικοινωνήσουμε μαζί σας!
              </p>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="flex text-sm font-medium text-gray-700 mb-2"
                    >
                      Όνομα *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={contactForm.firstName}
                      onChange={handleContactInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      placeholder="Το όνομά σας"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="flex text-sm font-medium text-gray-700 mb-2"
                    >
                      Επώνυμο *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={contactForm.lastName}
                      onChange={handleContactInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      placeholder="Το επώνυμό σας"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="flex text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="flex text-sm font-medium text-gray-700 mb-2">
                    Μήνυμα *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-none"
                    placeholder="Γράψτε το μήνυμά σας εδώ..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
                    disabled={contactSubmitting}
                  >
                    {contactSubmitting ? 'Αποστολή...' : 'Αποστολή Μηνύματος'}
                  </button>
                </div>
              </form>
              {contactSuccess && (
                <div className="mt-4 text-center text-green-600">
                  <p className="font-semibold">Το μήνυμά σας εστάλη επιτυχώς!</p>
                  <p className="text-sm">Θα επικοινωνήσουμε μαζί σας σύντομα.</p>
                </div>
              )}
              {/* Social media links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Ή επικοινωνήστε μαζί μας στα social media
                  </h3>
                  <div className="flex justify-center space-x-6">
                    <a
                      href="#"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <Instagram size={20} /> <span className="font-medium">@technotesgr</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <Youtube size={20} /> <span className="font-medium">@technotesgr</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
