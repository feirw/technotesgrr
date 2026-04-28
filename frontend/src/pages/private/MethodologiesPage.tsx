import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { METHODOLOGY_TOPICS, type MethodologyTopicId } from '@/data/methodologies';

const preClass =
  'mt-3 rounded-xl bg-slate-900/95 text-slate-100 p-4 text-sm font-mono leading-relaxed overflow-x-auto border border-slate-700/80';

/** Τίτλος πρώτου υποκομματίου μέσα σε θεματική ενότητα (χωρίς πάνω γραμμή). */
const subTitleClass =
  'scroll-mt-4 mt-8 first:mt-0 text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white inline-flex items-center gap-2.5 before:h-7 before:w-1 before:shrink-0 before:rounded-full before:bg-[#ff6b7a]';

/** Τίτλοι επαναλαμβανόμενων παραδειγμάτων — διαχωρισμός με κενό και ήπια γραμμή. */
const blockTitleClass =
  'scroll-mt-4 mt-0 border-t border-[#ff8f8e]/25 dark:border-gray-600/45 pt-10 text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white first:border-t-0 first:pt-0 inline-flex items-center gap-2.5 before:h-7 before:w-1 before:shrink-0 before:rounded-full before:bg-[#ff8f8e]/90';

const ekfonisiClass = 'mt-2 text-gray-700 dark:text-gray-300 leading-relaxed';
const mainSectionTitleClass =
  'text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white pb-3 mb-1 border-b border-[#ff8f8e]/35 dark:border-gray-600/60';

const MethodologiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('t') || '';
  const active: MethodologyTopicId = useMemo(() => {
    const ok = METHODOLOGY_TOPICS.some((x) => x.id === raw);
    return ok ? (raw as MethodologyTopicId) : 'oso';
  }, [raw]);

  useEffect(() => {
    if (raw && !METHODOLOGY_TOPICS.some((x) => x.id === raw)) {
      setSearchParams({ t: 'oso' }, { replace: true });
    }
  }, [raw, setSearchParams]);

  const setTopic = (id: MethodologyTopicId) => setSearchParams({ t: id }, { replace: true });

  return (
    <div className="min-h-[100dvh] bg-[#fff5f4] dark:bg-gray-950 px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-[#ff6b7a] dark:text-[#ffb0a4] tracking-tight">
            Μεθοδολογίες
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Σύντομη θεωρία και πρότυπα σε ψευδογλώσσα (ΓΛΩΣΣΑ): δομή ακολουθίας, Αν, επαναλήψεις, πίνακες, μετατροπές
            και τυπικές εφαρμογές χρέωσης — όπως στο σχολικό βιβλίο Πληροφορικής.
          </p>
        </motion.header>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-4 mb-12 sm:mb-14 max-w-4xl mx-auto">
          {METHODOLOGY_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setTopic(topic.id)}
              className={`min-h-11 px-2.5 sm:px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all touch-manipulation text-center max-w-[11.5rem] sm:max-w-none leading-snug ${
                active === topic.id
                  ? 'bg-[#ff6b7a] text-white border-[#ff6b7a] shadow-lg scale-[1.02]'
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 border-[#ff8f8e]/40 dark:border-gray-600 hover:border-[#ff6b7a]/60 hover:bg-rose-50/80 dark:hover:bg-gray-700'
              }`}
            >
              {topic.menuLabel}
            </button>
          ))}
        </div>

        <motion.article
          key={active}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-[#ff8f8e]/30 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-xl p-6 sm:p-9 sm:pb-10"
        >
          {active === 'oso' && <SectionOso />}
          {active === 'mexris_otou' && <SectionMexris />}
          {active === 'gia' && <SectionGia />}
          {active === 'metatropes' && <SectionMetatropes />}
          {active === 'pinakes_1d' && <SectionPinakes1D />}
          {active === 'pinakes_2d' && <SectionPinakes2D />}
          {active === 'metatropes_an' && <SectionMetatropesAn />}
          {active === 'klimakoti_xreosi' && <SectionKlimakotiXreosi />}
          {active === 'kanoniki_xreosi' && <SectionKanonikiXreosi />}
          {active === 'akolouthia' && <SectionAkolouthia />}
        </motion.article>
      </div>
    </div>
  );
};

function SectionOso() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Όσο … επανάλαβε</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Η δομή <strong>Όσο</strong> ελέγχει <em>πριν</em> από κάθε επανάληψη: αν η συνθήκη είναι αληθής, εκτελούνται οι
        εντολές του σώματος. Όταν γίνει ψευδής, η ροή συνεχίζει <strong>μετά</strong> το <code>Τέλος_επανάληψης</code>.
      </p>

      <h3 className={subTitleClass}>Πρότυπο δομής</h3>
      <pre className={preClass}>{`Όσο <συνθήκη> επανάλαβε
  <εντολές>
Τέλος_επανάληψης`}</pre>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Προσοχή: αν η συνθήκη είναι ψευδής από την αρχή, το σώμα δεν εκτελείται ούτε μία φορά (σε αντίθεση με το
        «Μέχρις_ότου» όταν η συνθήκη ελέγχεται στο τέλος).
      </p>

      <div className="mt-10 space-y-0 text-gray-800 dark:text-gray-100">
        <h3 className={blockTitleClass}>Επαναληπτική είσοδος αγνώστου πλήθους</h3>
        <p className={ekfonisiClass}>
          Επαναληπτική είσοδος αγνώστου πλήθους δεδομένων (στοιχείων), με την εντολή «ΟΣΟ…ΕΠΑΝΑΛΑΒΕ». Πρώτη εντολή:{' '}
          <code>ΔΙΑΒΑΣΕ Χ</code>.
        </p>
        <pre className={preClass}>{`ΟΣΟ Χ <> 0 ΕΠΑΝΑΛΑΒΕ
	ΔΙΑΒΑΣΕ Χ
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`}</pre>

        <h3 className={blockTitleClass}>Ονόματα μέχρι «ΤΕΛΟΣ»</h3>
        <p className={ekfonisiClass}>
          Παράδειγμα: Να γράψετε τμήμα προγράμματος σε ΓΛΩΣΣΑ το οποίο να διαβάζει επαναληπτικά ονόματα μέχρι να δοθεί
          ως όνομα το ΤΕΛΟΣ.
        </p>
        <pre className={preClass}>{`ΔΙΑΒΑΣΕ ΟΝΟΜΑ
ΟΣΟ ΟΝΟΜΑ <> ' ΤΕΛΟΣ ' ΕΠΑΝΑΛΑΒΕ
	ΔΙΑΒΑΣΕ ΟΝΟΜΑ
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`}</pre>

        <h3 className={blockTitleClass}>Συγκεκριμένο πλήθος εγγραφών (120 μαθητές)</h3>
        <p className={ekfonisiClass}>
          Παράδειγμα:Να γραφεί τμήμα προγράμματος που θα διαβάζει και θα εμφανίζει τα ονόματα 120 μαθητών της Γ Λυκείου καθώς και τον
          Γενικό Βαθμό Πρόσβασης (ΓΒΠ) του καθενός.
        </p>
        <pre className={preClass}>{`Ι <- 1  ! αντί για Ι θα μπορούσαμε να βάλουμε κ μαθητές
ΟΣΟ Ι <= 120 ΕΠΑΝΑΛΑΒΕ
     ΔΙΑΒΑΣΕ όνομα, βαθμό
     ΓΡΑΨΕ όνομα, βαθμό
     Ι <- Ι + 1
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`}</pre>

        <h3 className={blockTitleClass}>Διαδοχικοί αριθμοί 1 έως 15</h3>
        <p className={ekfonisiClass}>
          Παράδειγμα: Να γραφεί τμήμα προγράμματος που θα
          εμφανίζει τους ακέραιους αριθμούς από το 1 έως το 15.
        </p>
        <pre className={preClass}>{`Ι <-1
ΟΣΟ Ι <= 15 ΕΠΑΝΑΛΑΒΕ
     ΓΡΑΨΕ Ι
     Ι <- Ι + 1
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`}</pre>

        <h3 className={blockTitleClass}>Άθροισμα αριθμών</h3>
        <p className={ekfonisiClass}>
          Παράδειγμα: Να γραφεί κύριο πρόγραμμα που θα διαβάζει
          συνεχώς αριθμούς, μέχρι να διαβαστεί ο αριθμός μηδέν. Θα εκτυπωθεί το άθροισμα όλων των αριθμών που
          διαβάστηκαν.
        </p>
        <p className={`${ekfonisiClass} text-sm font-semibold text-gray-600 dark:text-gray-400`}>Λύση:</p>
        <pre className={preClass}>{`ΑΡΧΗ
     άθροισμα <- 0 ! μηδενισμός της μεταβλητής που θα χρησιμοποιηθεί για το άθροισμα
     ΔΙΑΒΑΣΕ Χ ! διάβασμα των αριθμών
     ΟΣΟ Χ <> 0 ΕΠΑΝΑΛΑΒΕ
          άθροισμα <- άθροισμα + Χ 
          ΔΙΑΒΑΣΕ Χ
     ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ
     ΓΡΑΨΕ άθροισμα ! εκτύπωση του αθροίσματος
ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`}</pre>

        <h3 className={blockTitleClass}>Άθροισμα άρτιων</h3>
        <p className={ekfonisiClass}>
          Παράδειγμα: Να γράψετε τμήμα προγράμματος σε ΓΛΩΣΣΑ το οποίο να διαβάζει επαναληπτικά αριθμούς μέχρι να δοθεί
          το 0. Να υπολογίζει και να εμφανίζει το άθροισμα των άρτιων.
        </p>
        <pre className={preClass}>{`άθροισμα <- 0 ! μηδενισμός της μεταβλητής που θα χρησιμοποιηθεί για το άθροισμα
     ΔΙΑΒΑΣΕ Χ ! διάβασμα των αριθμών
     ΟΣΟ Χ <> 0 ΕΠΑΝΑΛΑΒΕ
ΑΝ Χ mod 2 = 0 ΤΟΤΕ
     			άθροισμα <- άθροισμα + Χ
ΤΕΛΟΣ_ΑΝ
          ΔΙΑΒΑΣΕ Χ
     ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ
     ΓΡΑΨΕ άθροισμα 
ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`}</pre>

        <h3 className={blockTitleClass}>Πλήθος αριθμών που διαβάζονται</h3>
        <p className={ekfonisiClass}>
          Παράδειγμα: Να γράψετε τμήμα προγράμματος σε ΓΛΩΣΣΑ το οποίο να διαβάζει αριθμούς μέχρι να δοθεί το 0. Να υπολογίζει και να εμφανίζει
          πόσοι αριθμοί διαβάστηκαν.
        </p>
        <pre className={preClass}>{`πλήθος <- 0
ΔΙΑΒΑΣΕ Χ
ΟΣΟ Χ <> 0 ΕΠΑΝΑΛΑΒΕ
    πλήθος <- πλήθος + 1
    ΔΙΑΒΑΣΕ Χ
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ
ΓΡΑΨΕ πλήθος`}</pre>

        <h3 className={blockTitleClass}>Μέσος όρος — άγνωστο πλήθος</h3>
        <p className={ekfonisiClass}>
          Παράδειγμα: Να γραφεί κύριο πρόγραμμα σε ΓΛΩΣΣΑ που θα διαβάζει συνεχώς
          θετικούς αριθμούς, μέχρι να δοθεί ένας αρνητικός ή μηδενικός αριθμός. Θα βρίσκει και θα εμφανίζει τον μέσο όρο
          όλων των αριθμών που διαβάστηκαν.
        </p>
        <p className={`${ekfonisiClass} text-sm font-semibold text-gray-600 dark:text-gray-400`}>Λύση:</p>
        <pre className={preClass}>{`ΑΡΧΗ
πλήθος ← 0
sum ← 0
ΔΙΑΒΑΣΕ αριθμός
ΟΣΟ αριθμός > 0 ΕΠΑΝΑΛΑΒΕ
    πλήθος ← πλήθος + 1
    sum ← sum + αριθμός
    ΔΙΑΒΑΣΕ αριθμός
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ
ΑΝ πλήθος <> 0 ΤΟΤΕ      !Έλεγχος εάν έχει δοθεί έστω και ένας αριθμός
    μέσος_όρος ← sum / πλήθος  !υπολογισμός του μέσου όρου
    ΓΡΑΨΕ μέσος_όρος
ΑΛΛΙΩΣ
    ΓΡΑΨΕ 'Δεν έχει διαβαστεί κανένας αριθμός'
ΤΕΛΟΣ_ΑΝ
ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`}</pre>

        <h3 className={blockTitleClass}>Μέσος όρος — γνωστό πλήθος (15 αριθμοί)</h3>
        <p className={ekfonisiClass}>
          Να γραφεί κύριο πρόγραμμα σε ΓΛΩΣΣΑ που θα διαβάζει
          15 θετικούς αριθμούς. Θα βρίσκει και θα εμφανίζει τον μέσο όρο των αριθμών που διαβάστηκαν.
        </p>
        <p className={`${ekfonisiClass} text-sm font-semibold text-gray-600 dark:text-gray-400`}>Λύση:</p>
        <pre className={preClass}>{`ΑΡΧΗ
sum ← 0
I <- 1
ΔΙΑΒΑΣΕ αριθμός
ΟΣΟ I <= 15 ΕΠΑΝΑΛΑΒΕ
    	sum ← sum + αριθμός
   	 ΔΙΑΒΑΣΕ αριθμός
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ
μέσος_όρος ← sum / 15  !υπολογισμός του μέσου όρου
    ΓΡΑΨΕ μέσος_όρος
ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`}</pre>

        <h3 className={blockTitleClass}>Μέσος όρος θετικών (κριτήριο)</h3>
        <p className={ekfonisiClass}>
          Να γραφεί κύριο πρόγραμμα σε ΓΛΩΣΣΑ που θα
          διαβάζει συνεχώς θετικούς αριθμούς, μέχρι να δοθεί το 0. Θα βρίσκει και θα εμφανίζει τον μέσο όρο όλων των
          θετικών αριθμών που διαβάστηκαν.
        </p>
        <p className={`${ekfonisiClass} text-sm font-semibold text-gray-600 dark:text-gray-400`}>Λύση:</p>
        <pre className={preClass}>{`ΑΡΧΗ
πλήθος ← 0
sum ← 0
ΔΙΑΒΑΣΕ αριθμός
ΟΣΟ αριθμός <> 0 ΕΠΑΝΑΛΑΒΕ
	ΑΝ αριθμός > 0 ΤΟΤΕ
    		πλήθος ← πλήθος + 1
   		sum ← sum + αριθμός
	ΤΕΛΟΣ_ΑΝ
    	ΔΙΑΒΑΣΕ αριθμός
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ
ΑΝ πλήθος <> 0 ΤΟΤΕ      !Έλεγχος εάν έχει δοθεί έστω και ένας αριθμός
    μέσος_όρος ← sum / πλήθος  !υπολογισμός του μέσου όρου
    ΓΡΑΨΕ μέσος_όρος
ΑΛΛΙΩΣ
    ΓΡΑΨΕ 'Δεν έχει διαβαστεί κανένας θετικος αριθμός'
ΤΕΛΟΣ_ΑΝ
ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`}</pre>
      </div>
    </>
  );
}

function SectionMexris() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Μέχρις_ότου … επανάλαβε</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Στο <strong>Μέχρις_ότου</strong> οι εντολές εκτελούνται <em>τουλάχιστον μία φορά</em>· μετά από κάθε επανάληψη
        ελέγχεται η συνθήκη. Όταν η συνθήκη γίνει <strong>αληθής</strong>, η επανάληψη τελειώνει (στη ΓΛΩΣΣΑ: έξοδος
        όταν ικανοποιείται η συνθήκη του «Μέχρις_ότου» — συμφωνίζει με το σχολικό βιβλίο σου).
      </p>
      <h3 className={subTitleClass}>Πρότυπο δομής</h3>
      <pre className={preClass}>{`Επανάλαβε
  <εντολές>
Μέχρις_ότου <συνθήκη>`}</pre>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Συνήθως η συνθήκη εκφράζει το «θέλω να σταματήσω όταν…». Βεβαιώσου ότι κάποια μεταβλητή μέσα στο σώμα
        αλλάζει ώστε να μην «κολλάει» ατέρμων βρόχος.
      </p>
    </>
  );
}

function SectionGia() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Για … από … μέχρι … με_βήμα … επανάλαβε</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Η <strong>Για</strong> χρησιμοποιείται όταν ξέρεις πόσες φορές (ή με ποιο βήμα) θα επαναληφθεί μια διαδικασία.
        Ο μετρητής παίρνει αρχική τιμή, συγκρίνεται με το «μέχρι» και αυξάνεται/μειώνεται κατά το βήμα.
      </p>
      <h3 className={subTitleClass}>Πρότυπο (θετικό βήμα)</h3>
      <pre className={preClass}>{`Για i από 1 μέχρι 10 με_βήμα 1 επανάλαβε
  <εντολές>
Τέλος_επανάληψης`}</pre>
      <h3 className={blockTitleClass}>Πρότυπο (αρνητικό βήμα)</h3>
      <pre className={preClass}>{`Για k από 20 μέχρι 0 με_βήμα -2 επανάλαβε
  <εντολές>
Τέλος_επανάληψης`}</pre>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Το βήμα μπορεί να είναι θετικό ή αρνητικό· πρέπει να «φτάνεις» νόμιμα από την αρχική στη τελική τιμή (αλλιώς
        ο βρόχος μπορεί να μην εκτελεστεί καθόλου).
      </p>
    </>
  );
}

function SectionMetatropes() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Μετατροπές δομών επανάληψης</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Οι τρεις δομές (Όσο, Μέχρις_ότου, Για) είναι ισοδύναμες: μπορείς να ξαναγράψεις έναν αλγόριθμο σε άλλη μορφή
        κρατώντας ίδια λογική. Χρησιμοποίησε βοηθητικές μεταβλητές όταν χρειάζεται (π.χ. μετρητής για να γίνει «Για»).
      </p>
      <h3 className={subTitleClass}>Τύποι ισοδυναμίας</h3>
      <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300 list-disc pl-5">
        <li>
          <strong>Όσο → Για:</strong> όταν ο αριθμός επαναλήψεων είναι γνωστός ή προκύπτει από αρχική/τελική τιμή και
          βήμα.
        </li>
        <li>
          <strong>Μέχρις_ότου → Όσο:</strong> μεταφορά συνθήκης και εντολών ώστε ο έλεγχος να γίνεται στην αρχή του
          βρόχου (προσοχή στην «τουλάχιστον μία φορά»).
        </li>
        <li>
          <strong>Για → Όσο:</strong> βρόχος με μετρητή που αλλάζει στο τέλος του σώματος και συνθήκη που μιμείται το
          «μέχρι» και το «βήμα».
        </li>
      </ul>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Στις εξετάσεις ζητούν συχνά «γράψτε ισοδύναμο με …»· κράτα πάντα ισοδυναμία συνθηκών και ακριβή ενημέρωση
        μεταβλητών.
      </p>
    </>
  );
}

function SectionPinakes1D() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Μονοδιάστατοι πίνακες</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Ένας <strong>μονοδιάστατος πίνακας</strong> αποθηκεύει πολλές τιμές ίδιου τύπου με δείκτη (θέση) 1…Ν ή 0…Ν−1
        ανάλογα με τη σύμβαση του βιβλίου σου.
      </p>
      <h3 className={subTitleClass}>Δήλωση πίνακα και μεταβλητής δείκτη</h3>
      <pre className={preClass}>{`Δεδομένα // ή μεταβλητές
  Πίνακας : πραγματικός[50]
Μεταβλητές
  i : ακέραιος`}</pre>
      <h3 className={blockTitleClass}>Διάσχιση και διάβασμα στοιχείων</h3>
      <pre className={preClass}>{`Για i από 1 μέχρι 50 με_βήμα 1 επανάλαβε
  Διάβασε Πίνακας[i]
Τέλος_επανάληψης`}</pre>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Διάσχιση: συνήθως «Για i από 1 μέχρι Ν» για σάρωση όλων των στοιχείων. Προσοχή σε δείκτες εκτός ορίων.
      </p>
    </>
  );
}

function SectionAkolouthia() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Δομή ακολουθίας</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Η <strong>δομή ακολουθίας</strong> είναι η απλούστερη μορφή ελέγχου ροής: οι εντολές εκτελούνται{' '}
        <strong>διαδοχικά</strong>, μία μετά την άλλη, από πάνω προς τα κάτω, χωρίς επανάληψη και χωρίς επιλογή
        (Αν) στη βασική της μορφή.
      </p>
      <h3 className={subTitleClass}>Παράδειγμα κώδικα</h3>
      <pre className={preClass}>{`Αλγόριθμος Παράδειγμα
Δεδομένα // τι δέχεται ο αλγόριθμος
Αποτελέσματα // τι επιστρέφει
Αρχή
  Διάβασε x
  y <- x + 1
  Γράψε y
Τέλος`}</pre>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Κάθε γραμμή ολοκληρώνεται πριν ξεκινήσει η επόμενη. Ανάθεση (<code>&lt;-</code>), είσοδος/έξοδος, αριθμητικές
        πράξεις ακολουθούν αυστηρά τη σειρά που τις έγραψες.
      </p>
    </>
  );
}

function SectionMetatropesAn() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Μετατροπές δομής Αν</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Μπορείς να ξαναγράψεις ισοδύναμα προγράμματα αλλάζοντας τη μορφή των <strong>Αν</strong>: ένθετα Αν, αλυσίδα
        «Αν … αλλιώς_αν … αλλιώς», ή απλοποίηση λογικών συνθηκών (π.χ. κανόνες De Morgan όταν χρειάζεται).
      </p>
      <h3 className={subTitleClass}>Σκάλα Αν / αλλιώς_αν</h3>
      <pre className={preClass}>{`Αν <συν1> τότε
  <μπλοκ1>
αλλιώς_αν <συν2> τότε
  <μπλοκ2>
αλλιώς
  <μπλοκ3>
Τέλος_αν`}</pre>
      <h3 className={blockTitleClass}>Σημειώσεις για λογικούς τελεστές</h3>
      <pre className={preClass}>{`! ισοδυναμεί με «όχι»
Και / Ή — πρόσεξε τη σειρά και τις παρενθέσεις`}</pre>
      <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300 list-disc pl-5 text-sm">
        <li>
          <strong>Ένθετο Αν → αλλιώς_αν:</strong> ξεχώρισε αμοιβαία αποκλειστικές περιπτώσεις σε μία σκάλα.
        </li>
        <li>
          <strong>Διπλό Αν:</strong> βεβαιώσου ποιο «αλλιώς» δένει με ποιο «Αν» (indentation / Τέλος_αν στη ΓΛΩΣΣΑ).
        </li>
        <li>
          <strong>Ισοδυναμία συνθηκών:</strong> ίδια λογική, διαφορετική γραφή — έλεγξε με παραδείγματα ορίων (0, ίσα,
          κ.λπ.).
        </li>
      </ul>
    </>
  );
}

function SectionKanonikiXreosi() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Κανονική χρέωση</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Στη <strong>κανονική (ενιαία) χρέωση</strong> όλη η ποσότητα (π.χ. kWh, λεπτά, kg) τιμολογείται με{' '}
        <strong>μία και μόνο τιμή μονάδας</strong>. Το συνολικό κόστος είναι γινόμενο ποσότητας × τιμή μονάδας.
      </p>
      <h3 className={subTitleClass}>Υπολογισμός κόστους</h3>
      <pre className={preClass}>{`! kWh και τιμή ανά kWh
Διάβασε kwh, timi_anakwh
synolo <- kwh * timi_anakwh
Γράψε synolo`}</pre>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Χρήσιμο ως βάση σύγκρισης με την κλιμακωτή χρέωση: εδώ δεν αλλάζει η τιμή μονάδας ανά «κλιμάκιο».
      </p>
    </>
  );
}

function SectionKlimakotiXreosi() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Κλιμακωτή χρέωση</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Στη <strong>κλιμακωτή χρέωση</strong> η τιμή μονάδας εξαρτάται από <strong>εύρο ποσότητας</strong> (π.χ. τα
        πρώτα 100 kWh φθηνότερα, τα επόμενα ακριβότερα). Στα σχολικά θέματα συνήθως αθροίζεις το κόστος{' '}
        <strong>ανά κλιμάκιο</strong> (κάθε τμήμα ποσότητας × η τιμή που ισχύει για αυτό το τμήμα).
      </p>
      <h3 className={subTitleClass}>Παράδειγμα δύο κλιμακίων</h3>
      <pre className={preClass}>{`! Παράδειγμα ιδέας: 0–100 με p1, πάνω από 100 με p2
Διάβασε kwh
synolo <- 0
Αν kwh <= 100 τότε
  synolo <- kwh * p1
αλλιώς
  synolo <- 100 * p1 + (kwh - 100) * p2
Τέλος_αν
Γράψε synolo`}</pre>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Προσαρμόσε τα όρια και τις τιμές (<code>p1</code>, <code>p2</code>, …) στο εκφωνημένο πρόβλημα. Αν υπάρχουν
        πολλά κλιμάκια, χρησιμοποίησε αλυσίδα <strong>Αν … αλλιώς_αν …</strong> ή υπολογισμό τμήμα-τμήμα με βοηθητικές
        μεταβλητές.
      </p>
    </>
  );
}

function SectionPinakes2D() {
  return (
    <>
      <h2 className={mainSectionTitleClass}>Δισδιάστατοι πίνακες</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        Ο <strong>δισδιάστατος πίνακας</strong> είναι «πίνακας από πίνακες»: δύο δείκτες (π.χ. γραμμή, στήλη). Χρησιμοποιείται
        για πίνακες τιμών, πλέγματα, εικόνες ως πίνακες εικονοστοιχείων κ.λπ.
      </p>
      <h3 className={subTitleClass}>Δήλωση πίνακα 2Δ</h3>
      <pre className={preClass}>{`Δεδομένα
  A : ακέραιος[10, 8]
Μεταβλητές
  i, j : ακέραιοι`}</pre>
      <h3 className={blockTitleClass}>Ένθετες επαναλήψεις (διάσχιση)</h3>
      <pre className={preClass}>{`Για i από 1 μέχρι 10 με_βήμα 1 επανάλαβε
  Για j από 1 μέχρι 8 με_βήμα 1 επανάλαβε
    <εντολές με A[i, j]>
  Τέλος_επανάληψης
Τέλος_επανάληψης`}</pre>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Η εσωτερική «Για» ολοκληρώνεται για κάθε τιμή της εξωτερικής· η σειρά (γραμμές πρώτα ή στήλες πρώτα) καθορίζει
        τη διάσχιση.
      </p>
    </>
  );
}

export default MethodologiesPage;
