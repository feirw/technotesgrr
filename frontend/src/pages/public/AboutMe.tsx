import React from 'react';
import { MenuIconImg } from '@/data/menuIcons';

const HP = '/images/home%20page';
const ABOUT_SECTION_ICONS = {
  story: `${HP}/18.png`,
  work: `${HP}/19.png`,
  funFacts: `${HP}/20.png`,
} as const;

interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

const funFactsData: string[] = [
  'Λατρεύω να μιλάω και να μεταδίδω την γνώση μου στους άλλους.',
  'Πηγαίνω συνέχεια σε events σχετικά με την τεχνολογία και την εκπαίδευση.',
  'Διαβάζω συνεχώς για νέες τεχνολογίες και εφαρμογές τους στην διδακτική.',
  'Ονειρεύομαι να ανοίξω το δικό μου διαδικτυακό φροντιστήριο.',
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
  '/images/eg5.jpg?v=20260608',
  '/images/eg6.jpg',
];

const personalCardImages = ['/images/c2.png', '/images/c3.png'];

const cardClass =
  'bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 border border-[#f07f97]/25 dark:border-white/10';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <section className="pt-10 sm:pt-12 pb-4 sm:pb-6">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 tracking-tight text-white drop-shadow-sm">
            Γεια σου! Είμαι η Ελένη
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
            δημιουργός του <span className="font-bold">technotesgr</span>
          </p>
        </div>
      </section>

      <section className="pt-2 pb-16 md:pt-4 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
            <div className={cardClass}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#f07f97] dark:text-[#ff97b2] mb-4">
                Some cool moments
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievementImages.map((imageSrc, i) => (
                  <div
                    key={imageSrc}
                    className="aspect-square overflow-hidden rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48]"
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
            </div>

            <div className={cardClass}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personalCardImages.map((imageSrc, i) => (
                  <div
                    key={imageSrc}
                    className="aspect-[16/10] overflow-hidden rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48]"
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
            </div>

            <div className={cardClass}>
              <div className="flex items-center gap-4 mb-6">
                <MenuIconImg src={ABOUT_SECTION_ICONS.story} className="w-9 h-9" />
                <h2 className="text-3xl md:text-4xl font-bold text-[#f07f97] dark:text-[#ff97b2]">
                  Η ιστορία μου
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed text-base sm:text-lg">
                <p>
                  Είμαι η Ελένη και είμαι φοιτήτρια του τμήματος Πληροφορικής και Τηλεπικοινωνιών
                  του Εθνικού και Καποδιστριακού Πανεπιστημίου Αθηνών. Στις πανελλήνιες του 2024
                  συγκέντρωσα 19.000 μόρια και συγκεκριμένα στην πληροφορική πέτυχα 99/100. Επίσης,
                  κατάγομαι από ένα μικρό χωριό της Φθιώτιδας.
                </p>
                <p>
                  Όταν ήμουν μαθήτρια Γ' Λυκείου, κατάλαβα πόσο δύσκολο μπορεί να είναι να βρεις
                  οργανωμένο και ποιοτικό υλικό μελέτης. Αυτή η εμπειρία με ώθησε να δημιουργήσω μια
                  πλατφόρμα που θα έκανε τη μελέτη πιο εύκολη και αποτελεσματική. Επίσης, η
                  εξαιρετική καθηγήτρια που με ανέλαβε στις πανελλήνιες, με ενέπνευσε να ακολουθήσω
                  αυτόν τον τομέα. Δεν μου άρεσε καθόλου η πληροφορική στην αρχή. Όμως, η κυρία{' '}
                  <a
                    href="https://www.vrisko.gr/details/21a516312h3ja01e0bd_4d_26h3j0jc0#:~:text=E%20%2D%20%CE%9C%CE%91%CE%98%CE%97%CE%A3%CE%97%20%2D%20e%2D%CE%BC%CE%AC%CE%B8%CE%B7%CF%83%CE%B7%20(%CE%A4%CF%83%CF%8E%CE%BD%CE%BF%CF%85%20%CE%95%CE%BB%CE%AD%CE%BD%CE%B7%20%CE%91.)&text=%CE%9C%CE%B1%CE%B8%CE%AE%CE%BC%CE%B1%CF%84%CE%B1%20%CE%A0%CF%81%CE%BF%CE%B3%CF%81%CE%B1%CE%BC%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CE%BC%CE%BF%CF%8D%2C%20%CE%A6%CF%81%CE%BF%CE%BD%CF%84%CE%B9%CF%83%CF%84%CE%AE%CF%81%CE%B9%CE%B1%20%CE%9C%CE%AD%CF%83%CE%B7%CF%82%20%CE%95%CE%BA%CF%80%CE%B1%CE%AF%CE%B4%CE%B5%CF%85%CF%83%CE%B7%CF%82,%CE%A6%CE%98%CE%99%CE%A9%CE%A4%CE%99%CE%A4%CE%91%CE%A3%20%2C%206976681079%20%7C%20vrisko.gr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f07f97] dark:text-[#ff97b2] font-bold hover:underline"
                  >
                    Λένα Τσώνου
                  </a>{' '}
                  με έκανε να την αγαπήσω!
                </p>
                <p>
                  Το technotesgr δεν είναι απλά μια ιστοσελίδα. Είναι μια συνεχής προσπάθεια να
                  γίνει η εκπαίδευση πιο δομημένη, πρακτική και προσβάσιμη για κάθε μαθητή.
                </p>
                <p>
                  Αυτή η σελίδα δεν θα μπορούσε να γίνει χωρίς τον{' '}
                  <a
                    href="https://github.com/mgiannopoulos24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#f07f97] dark:text-[#ff97b2] hover:underline"
                  >
                    deathwish
                  </a>{' '}
                  και την{' '}
                  <a
                    href="https://github.com/a-reynbaw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#f07f97] dark:text-[#ff97b2] hover:underline"
                  >
                    a‑reynbaw
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center gap-4 mb-6">
                <MenuIconImg src={ABOUT_SECTION_ICONS.work} className="w-9 h-9" />
                <h2 className="text-3xl md:text-4xl font-bold text-[#f07f97] dark:text-[#ff97b2]">
                  Η δουλειά μου
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-base sm:text-lg">
                Πέρα από το technotesgr, ασχολούμαι ενεργά με την εκπαίδευση. Στείλε μου στο
                Instagram μήνυμα αν θέλεις να μάθεις περισσότερα.
                <a
                  href="https://www.instagram.com/technotesgr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f07f97] dark:text-[#ff97b2] font-bold hover:underline"
                >
                  {' '}
                  @technotesgr
                </a>
              </p>
            </div>

            <div className={cardClass}>
              <div className="flex items-center gap-4 mb-6">
                <MenuIconImg src={ABOUT_SECTION_ICONS.funFacts} className="w-9 h-9" />
                <h2 className="text-3xl md:text-4xl font-bold text-[#f07f97] dark:text-[#ff97b2]">
                  Fun Facts About Me
                </h2>
              </div>
              <ul className="space-y-4">
                {funFactsData.map((fact, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-200 text-base sm:text-lg"
                  >
                    <span className="flex-shrink-0 w-2 h-2 bg-[#f07f97] dark:bg-[#ff97b2] rounded-full mt-2" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={cardClass}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#f07f97] dark:text-[#ff97b2] mb-8">
                Timeline 2022 - Σήμερα
              </h2>
              <div className="space-y-5">
                {timelineData.map((item, idx) => (
                  <div
                    key={`${item.period}-${idx}`}
                    className="relative pl-6 sm:pl-8 pb-4 border-l-2 border-[#f07f97]/30 dark:border-[#ff97b2]/30"
                  >
                    <span className="absolute -left-[7px] sm:-left-[9px] top-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#f07f97] dark:bg-[#ff97b2]" />
                    <p className="text-sm font-bold text-[#f07f97] dark:text-[#ff97b2] mb-1">
                      {item.period}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
