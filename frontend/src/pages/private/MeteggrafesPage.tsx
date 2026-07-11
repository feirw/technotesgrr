import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';
import type { FaqSection } from '@/data/panelliniesFaq';
import { FaqAccordionItem } from '@/components/other/FaqAccordionItem';

const METEGGRAFES_FAQ: FaqSection[] = [
  {
    title: 'Αντιστοιχίες Τμημάτων',
    items: [
      {
        question: 'Πώς ξέρω ποια τμήματα είναι «αντίστοιχα» για μετεγγραφή;',
        answer:
          'Η μετεγγραφή σε άλλο τμήμα επιτρέπεται μόνο αν το τμήμα προορισμού θεωρείται «αντίστοιχο» με το τμήμα σου, σύμφωνα με τον επίσημο πίνακα αντιστοιχιών του Υπουργείου Παιδείας για το ακαδημαϊκό έτος 2026-2027.',
        link: '/antistoixies-sxolon',
        linkLabel: 'Δες τις Αντιστοιχίες Σχολών',
      },
    ],
  },
  {
    title: 'Μετεγγραφές',
    items: [
      {
        question: 'Πότε γίνονται οι αιτήσεις;',
        answer:
          'Οι αιτήσεις υποβάλλονται ηλεκτρονικά μέσω της πλατφόρμας του Υπουργείου Παιδείας, συνήθως τους μήνες Σεπτέμβριο ή Οκτώβριο κάθε έτους, με τις ακριβείς ημερομηνίες να ανακοινώνονται από το Υπουργείο.',
      },
      {
        question: 'Πώς υπολογίζονται τα μόρια;',
        answer:
          'Τα μόρια προκύπτουν από συνδυασμό κοινωνικοοικονομικών κριτηρίων (εισόδημα, προστατευόμενα μέλη) και ακαδημαϊκών επιδόσεων (μόρια εισαγωγής πανελλαδικών), σύμφωνα με την εγκύκλιο του Υπουργείου.',
      },
      {
        question: 'Πόσες φορές μπορώ να κάνω αίτηση;',
        answer: 'Μία φορά ανά ακαδημαϊκό έτος και μόνο για μία κατηγορία μετεγγραφής.',
      },
      {
        question: 'Τι γίνεται αν απορριφθεί η αίτησή μου;',
        answer: 'Υπάρχει δυνατότητα ένστασης εντός της προθεσμίας που ορίζεται στην ανακοίνωση.',
      },
      {
        question: 'Τι είναι η «Μετακίνηση»;',
        answer:
          'Εάν δεν πληροίτε τις προϋποθέσεις για απευθείας μετεγγραφή σε αντίστοιχο Τμήμα, έχετε το δικαίωμα να αιτηθείτε μετακίνηση σε συναφές Τμήμα του ίδιου επιστημονικού πεδίου.',
      },
      {
        question: 'Τι κάνω αφού εγκριθεί η αίτησή μου;',
        answer:
          'Πρέπει να παρακολουθείτε τις ανακοινώσεις του νέου Ιδρύματος, ώστε να αποστείλετε τα απαιτούμενα δικαιολογητικά στη Γραμματεία του Τμήματος Υποδοχής και να ολοκληρώσετε την εγγραφή σας.',
      },
      {
        question: 'Πού βρίσκω τις επίσημες ανακοινώσεις και τα ΦΕΚ;',
        answer: 'Στην ιστοσελίδα του Υπουργείου Παιδείας και στο Εθνικό Τυπογραφείο.',
      },
      {
        question: 'Ποια είναι τα κριτήρια μετεγγραφής φοιτητών;',
        answer: 'Αναλυτική παρουσίαση των κοινωνικοοικονομικών και ακαδημαϊκών κριτηρίων μοριοδότησης.',
        link: 'https://izipen.gr/blog/metengrafes-foititon-kritiria',
        linkLabel: 'Διάβασε στο izipen.gr',
      },
      {
        question: 'Πού βρίσκω τις βάσεις μετεγγραφών;',
        answer: 'Οι μοριοδοτικές βάσεις μετεγγραφών ανά τμήμα για το ακαδημαϊκό έτος 2025-2026.',
        link: 'https://www.aboutcareer.gr/post/%CE%B2%CE%AC%CF%83%CE%B5%CE%B9%CF%82-%CE%BC%CE%B5%CF%84%CE%B5%CE%B3%CE%B3%CF%81%CE%B1%CF%86%CF%8E%CE%BD-2025-2026',
        linkLabel: 'Βάσεις Μεταγραφών — aboutcareer.gr',
      },
      {
        question: 'Είναι σταθερές κάθε χρόνο οι βάσεις των κοινωνικοοικονομικών μορίων για τις μετεγγραφές (π.χ. 2, 4, 6 μόρια);',
        answer:
          'Όχι, οι βάσεις των μορίων του τελευταίου εισαγόμενου αλλάζουν κάθε χρόνο. Διαμορφώνονται δυναμικά ανάλογα με τον ανταγωνισμό, τον αριθμό των αιτήσεων για το κάθε τμήμα και τα κοινωνικοοικονομικά κριτήρια των ίδιων των υποψηφίων. Αν οι αιτήσεις σε ένα τμήμα είναι λιγότερες από τις διαθέσιμες θέσεις (το 15% των εισακτέων), τότε γίνονται δεκτοί όλοι οι υποψήφιοι και η βάση των κριτηρίων «κλειδώνει» στο μηδέν (0).',
      },
      {
        question: 'Τι ισχύει για τη βάση της μετεγγραφής;',
        answer:
          'Για λόγους δικαιοσύνης και εξορθολογισμού, το δικαίωμα μετεγγραφής ισχύει όταν η διαφορά στη βάση εισαγωγής μεταξύ των δύο σχολών – εκείνης που εισήχθη ο φοιτητής ή η φοιτήτρια και εκείνης που επιθυμεί να μετεγγραφεί – δεν έχουν μεταξύ τους διαφορά μεγαλύτερη από 2.750 μόρια.',
      },
      {
        question: 'Πώς ελέγχω αν συγκεντρώνω τα μόρια της βάσης μετεγγραφής;',
        answer:
          'Πρέπει να ελέγξεις τη διαφορά ανάμεσα στη βάση εισαγωγής του Τμήματος που σε ενδιαφέρει και στα μόρια που συγκέντρωσες κατά την εισαγωγή σου στο Τμήμα επιτυχίας σου. Αν η διαφορά αυτή είναι έως 2.750 μόρια, τότε μπορείς να υποβάλεις αίτηση.',
      },
      
    ],
  },
];

const RESOURCE_LINKS = [
  {
    href: '/antistoixies-sxolon',
    label: 'Αντιστοιχίες Σχολών 2026-2027',
    hint: 'Ποια τμήματα είναι «αντίστοιχα» μεταξύ τους',
    internal: true,
  },
  {
    href: 'https://izipen.gr/blog/metengrafes-foititon-kritiria',
    label: 'Κριτήρια μετεγγραφής φοιτητών',
    hint: 'izipen.gr',
    internal: false,
  },
  {
    href: 'https://www.aboutcareer.gr/post/%CE%B2%CE%AC%CF%83%CE%B5%CE%B9%CF%82-%CE%BC%CE%B5%CF%84%CE%B5%CE%B3%CE%B3%CF%81%CE%B1%CF%86%CF%8E%CE%BD-2025-2026',
    label: 'Βάσεις Μετεγγραφών 2025-2026',
    hint: 'aboutcareer.gr',
    internal: false,
  },
];

const MeteggrafesPage: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f07f97] via-[#f07f97] to-[#e06d88] text-white py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-2xl bg-white/20 mb-4">
            <MenuIconImg src={MENU_ICONS.meteggrafes} className="w-14 h-14" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight">Μετεγγραφές</h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Ό,τι χρειάζεται να ξέρεις για αιτήσεις, κριτήρια, αντιστοιχίες και μετακίνηση
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RESOURCE_LINKS.map((resource) =>
            resource.internal ? (
              <Link
                key={resource.href}
                to={resource.href}
                className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] hover:bg-[#fff5f8] dark:hover:bg-white/5 px-4 py-3.5 shadow-sm transition-colors"
              >
                <p className="font-bold text-sm text-gray-900 dark:text-white leading-snug">{resource.label}</p>
                <p className="mt-1 text-xs text-[#f07f97] dark:text-[#ff97b2] font-semibold flex items-center gap-1">
                  {resource.hint}
                  <ArrowRight className="w-3 h-3" aria-hidden />
                </p>
              </Link>
            ) : (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] hover:bg-[#fff5f8] dark:hover:bg-white/5 px-4 py-3.5 shadow-sm transition-colors"
              >
                <p className="font-bold text-sm text-gray-900 dark:text-white leading-snug">{resource.label}</p>
                <p className="mt-1 text-xs text-[#f07f97] dark:text-[#ff97b2] font-semibold flex items-center gap-1">
                  {resource.hint}
                  <ExternalLink className="w-3 h-3" aria-hidden />
                </p>
              </a>
            ),
          )}
        </section>

        {METEGGRAFES_FAQ.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-4 drop-shadow-sm">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <FaqAccordionItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  link={item.link}
                  linkLabel={item.linkLabel}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </motion.div>
  );
};

export default MeteggrafesPage;
