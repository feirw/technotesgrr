import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PageMenuIcon } from '@/data/menuIcons';

const CS_CAREER_PATH_URL = 'https://cscareerpath.vercel.app/';

const cardClass =
  'bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md rounded-2xl border border-[#f07f97]/25 dark:border-white/10';

const PATHS: { title: string; text: string }[] = [
  { title: 'Frontend Engineer', text: 'Φτιάχνεις αυτό που βλέπει και αγγίζει ο χρήστης.' },
  { title: 'Backend Engineer', text: 'Χτίζεις τη μηχανή πίσω από την εφαρμογή.' },
  { title: 'Mobile Developer', text: 'Γράφεις για τη συσκευή που έχουν όλοι στην τσέπη.' },
  { title: 'Data Engineer', text: 'Χτίζεις τους σωλήνες από όπου ρέουν τα δεδομένα.' },
  { title: 'Data Scientist / Analyst', text: 'Βγάζεις απαντήσεις και αποφάσεις από τα νούμερα.' },
  { title: 'ML / AI Engineer', text: 'Φτιάχνεις συστήματα που μαθαίνουν από δεδομένα.' },
  { title: 'DevOps / Cloud Engineer', text: 'Κρατάς το σύστημα όρθιο και το deploy βαρετό.' },
  { title: 'Cybersecurity Engineer', text: 'Σκέφτεσαι σαν επιτιθέμενος για να αμυνθείς σωστά.' },
  { title: 'QA / Test Automation Engineer', text: 'Βρίσκεις τι σπάει πριν το βρει ο χρήστης.' },
  { title: 'Embedded / Systems Engineer', text: 'Γράφεις κώδικα που κουνάει πράγματα στον φυσικό κόσμο.' },
  { title: 'Product Manager (tech)', text: 'Αποφασίζεις τι αξίζει να φτιαχτεί και γιατί.' },
  { title: 'Έρευνα / Ακαδημαϊκή καριέρα', text: 'Δουλεύεις σε προβλήματα που δεν έχουν ακόμα λύση.' },
];

const CsCareerPathPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500 pb-16">
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
          <PageMenuIcon
            icon="prosanatolismosPliroforikis"
            wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3"
            className="w-9 h-9"
          />
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
            Προσανατολισμός Πληροφορικής
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Τεστ καριέρας για φοιτητές και μαθητές πληροφορικής — δες ποιες από τις 12 κατευθύνσεις σου
            ταιριάζουν.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <section className={`${cardClass} px-5 sm:px-6 py-5 sm:py-6`}>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed">
            Το <strong>CS Career Path</strong> είναι ένα ανώνυμο τεστ (χωρίς εγγραφή) που σε βοηθά να
            ανακαλύψεις ποια tech καριέρα σου ταιριάζει. Απαντάς για το πώς σκέφτεσαι και δουλεύεις, και
            βλέπεις προφίλ με roadmap για να ξεκινήσεις. Δεν είναι πρόβλεψη — είναι αφετηρία.
          </p>
        </section>

        <section className={`${cardClass} px-5 sm:px-6 py-6 text-center`}>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
            Άνοιξε το τεστ στο CS Career Path: πλήρες (60 ερωτήσεις) ή γρήγορο (20 ερωτήσεις).
          </p>
          <a
            href={CS_CAREER_PATH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f07f97] hover:bg-[#e76a85] text-white font-bold text-sm sm:text-base px-5 py-3 transition-colors"
          >
            CS Career Path
            <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
          </a>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 break-all">
            {CS_CAREER_PATH_URL}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-[#faf5ef] mb-3">
            Οι 12 κατευθύνσεις
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PATHS.map((item) => (
              <div key={item.title} className={`${cardClass} px-4 py-4`}>
                <p className="text-[13px] sm:text-sm font-black text-[#f07f97] dark:text-[#ff97b2] mb-1">
                  {item.title}
                </p>
                <p className="text-[13px] sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Την ιστοσελίδα επιμελήθηκε ο συνάδελφος{' '}
          <a
            href="https://github.com/Kostas-Gouridis"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#f07f97] hover:underline"
          >
            Κωνσταντίνος Γουρίδης
          </a>{' '}
          από το Τμήμα Εφαρμοσμένης Πληροφορικής στο ΠΑΜΑΚ.
        </p>
      </main>
    </div>
  );
};

export default CsCareerPathPage;
