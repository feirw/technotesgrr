import type { Career } from './careers';

export const ARTS_CAREERS: Career[] = [
  // Interior Design
  { title: 'Interior Designer', description: 'Σχεδιάζει λειτουργικούς και αισθητικά άρτιους εσωτερικούς χώρους.', section: 'Interior Design' },
  { title: 'Interior Architect', description: 'Σχεδιάζει και αναδιαμορφώνει εσωτερικούς χώρους κτιρίων.', section: 'Interior Design' },
  { title: 'Residential Interior Designer', description: 'Εξειδικεύεται σε κατοικίες.', section: 'Interior Design' },
  { title: 'Commercial Interior Designer', description: 'Σχεδιάζει καταστήματα, γραφεία και εμπορικούς χώρους.', section: 'Interior Design' },
  { title: 'Hospitality Interior Designer', description: 'Σχεδιάζει ξενοδοχεία και χώρους φιλοξενίας.', section: 'Interior Design' },
  { title: 'Healthcare Interior Designer', description: 'Σχεδιάζει νοσοκομεία και κλινικές.', section: 'Interior Design' },
  { title: 'Office Designer', description: 'Σχεδιάζει σύγχρονους χώρους εργασίας.', section: 'Interior Design' },
  { title: 'Retail Designer', description: 'Δημιουργεί εμπορικά καταστήματα και βιτρίνες.', section: 'Interior Design' },

  // Product & Furniture Design
  { title: 'Furniture Designer', description: 'Σχεδιάζει έπιπλα.', section: 'Product & Furniture Design' },
  { title: 'Product Designer', description: 'Δημιουργεί νέα προϊόντα.', section: 'Product & Furniture Design' },
  { title: 'Lighting Designer', description: 'Σχεδιάζει φωτισμό εσωτερικών και εξωτερικών χώρων.', section: 'Product & Furniture Design' },
  { title: 'Kitchen Designer', description: 'Σχεδιάζει κουζίνες.', section: 'Product & Furniture Design' },
  { title: 'Bathroom Designer', description: 'Σχεδιάζει χώρους μπάνιου.', section: 'Product & Furniture Design' },

  // Δημιουργικός Σχεδιασμός
  { title: 'Exhibition Designer', description: 'Σχεδιάζει εκθέσεις και μουσεία.', section: 'Δημιουργικός Σχεδιασμός' },
  { title: 'Set Designer', description: 'Δημιουργεί σκηνικά για θέατρο και κινηματογράφο.', section: 'Δημιουργικός Σχεδιασμός' },
  { title: 'Stage Designer', description: 'Σχεδιάζει σκηνές εκδηλώσεων.', section: 'Δημιουργικός Σχεδιασμός' },
  { title: 'Event Space Designer', description: 'Σχεδιάζει χώρους εκδηλώσεων.', section: 'Δημιουργικός Σχεδιασμός' },

  // Ψηφιακό Design (αρχιτεκτονικό)
  { title: '3D Designer', description: 'Δημιουργεί τρισδιάστατα μοντέλα χώρων.', section: 'Ψηφιακό Design' },
  { title: 'CAD Designer', description: 'Σχεδιάζει τεχνικά σχέδια σε CAD.', section: 'Ψηφιακό Design' },
  { title: 'BIM Specialist', description: 'Διαχειρίζεται ψηφιακά μοντέλα κτιρίων.', section: 'Ψηφιακό Design' },
  { title: 'Visualization Artist', description: 'Δημιουργεί φωτορεαλιστικές απεικονίσεις έργων.', section: 'Ψηφιακό Design' },

  // Graphic Design
  { title: 'Graphic Designer', description: 'Δημιουργεί έντυπο και ψηφιακό οπτικό υλικό.', section: 'Graphic Design' },
  { title: 'Visual Designer', description: 'Σχεδιάζει οπτικές ταυτότητες και ψηφιακές εφαρμογές.', section: 'Graphic Design' },
  { title: 'Brand Designer', description: 'Δημιουργεί λογότυπα και εταιρικές ταυτότητες.', section: 'Graphic Design' },
  { title: 'Logo Designer', description: 'Σχεδιάζει λογότυπα.', section: 'Graphic Design' },
  { title: 'Packaging Designer', description: 'Σχεδιάζει συσκευασίες προϊόντων.', section: 'Graphic Design' },
  { title: 'Publication Designer', description: 'Σχεδιάζει βιβλία, περιοδικά και έντυπα.', section: 'Graphic Design' },

  // Digital Design
  { title: 'UI Designer', description: 'Σχεδιάζει το περιβάλλον εφαρμογών και ιστοσελίδων.', section: 'Digital Design' },
  { title: 'UX Designer', description: 'Βελτιώνει την εμπειρία χρήστη σε ψηφιακά προϊόντα.', section: 'Digital Design' },
  { title: 'UX Researcher', description: 'Μελετά τις ανάγκες και τη συμπεριφορά των χρηστών.', section: 'Digital Design' },
  { title: 'Interaction Designer', description: 'Σχεδιάζει τις αλληλεπιδράσεις στις εφαρμογές.', section: 'Digital Design' },
  { title: 'Web Designer', description: 'Σχεδιάζει ιστοσελίδες.', section: 'Digital Design' },
  { title: 'App Designer', description: 'Σχεδιάζει εφαρμογές κινητών.', section: 'Digital Design' },

  // Motion Graphics
  { title: 'Motion Graphics Designer', description: 'Δημιουργεί κινούμενα γραφικά.', section: 'Motion Graphics' },
  { title: 'Animator', description: 'Δημιουργεί animations.', section: 'Motion Graphics' },
  { title: '2D Animator', description: 'Δημιουργεί δισδιάστατα animations.', section: 'Motion Graphics' },
  { title: '3D Artist', description: 'Δημιουργεί τρισδιάστατα γραφικά.', section: 'Motion Graphics' },
  { title: 'VFX Artist', description: 'Δημιουργεί ψηφιακά οπτικά εφέ.', section: 'Motion Graphics' },

  // Marketing & Branding
  { title: 'Creative Director', description: 'Καθοδηγεί δημιουργικές ομάδες.', section: 'Marketing & Branding' },
  { title: 'Art Director', description: 'Επιβλέπει τον οπτικό σχεδιασμό έργων.', section: 'Marketing & Branding' },
  { title: 'Brand Manager', description: 'Διαχειρίζεται την εικόνα ενός brand.', section: 'Marketing & Branding' },
  { title: 'Creative Strategist', description: 'Σχεδιάζει δημιουργικές καμπάνιες.', section: 'Marketing & Branding' },
  { title: 'Marketing Designer', description: 'Δημιουργεί υλικό marketing.', section: 'Marketing & Branding' },

  // Content Creation
  { title: 'Content Creator', description: 'Δημιουργεί ψηφιακό περιεχόμενο.', section: 'Content Creation' },
  { title: 'Social Media Designer', description: 'Σχεδιάζει περιεχόμενο για social media.', section: 'Content Creation' },
  { title: 'Illustrator', description: 'Δημιουργεί εικονογραφήσεις.', section: 'Content Creation' },
  { title: 'Infographic Designer', description: 'Δημιουργεί ενημερωτικά γραφήματα.', section: 'Content Creation' },

  // Gaming & Entertainment
  { title: 'Game Artist', description: 'Δημιουργεί γραφικά για παιχνίδια.', section: 'Gaming & Entertainment' },
  { title: 'Concept Artist', description: 'Σχεδιάζει χαρακτήρες και κόσμους παιχνιδιών.', section: 'Gaming & Entertainment' },
  { title: 'Environment Artist', description: 'Δημιουργεί ψηφιακά περιβάλλοντα.', section: 'Gaming & Entertainment' },
  { title: 'Character Designer', description: 'Σχεδιάζει χαρακτήρες.', section: 'Gaming & Entertainment' },

  // Media
  { title: 'Video Editor', description: 'Επεξεργάζεται βίντεο.', section: 'Media' },
  { title: 'Multimedia Designer', description: 'Δημιουργεί πολυμεσικό περιεχόμενο.', section: 'Media' },
  { title: 'Broadcast Designer', description: 'Δημιουργεί τηλεοπτικά γραφικά.', section: 'Media' },

  // Επιχειρηματικότητα
  { title: 'Freelance Designer', description: 'Παρέχει ανεξάρτητες υπηρεσίες σχεδιασμού.', section: 'Επιχειρηματικότητα' },
  { title: 'Design Studio Owner', description: 'Δημιουργεί δικό του δημιουργικό γραφείο.', section: 'Επιχειρηματικότητα' },
  { title: 'Creative Agency Founder', description: 'Ιδρύει διαφημιστική ή δημιουργική εταιρεία.', section: 'Επιχειρηματικότητα' },

  // Εκπαίδευση & Έρευνα
  { title: 'University Professor', description: 'Διδάσκει και ερευνά στον χώρο του design.', section: 'Εκπαίδευση & Έρευνα' },
  { title: 'Lecturer', description: 'Διδάσκει στην τριτοβάθμια εκπαίδευση.', section: 'Εκπαίδευση & Έρευνα' },
  { title: 'Researcher', description: 'Διεξάγει έρευνα στις τέχνες και τον σχεδιασμό.', section: 'Εκπαίδευση & Έρευνα' },
];
