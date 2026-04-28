/** Θέματα μεθοδολογίας — κοινό για σελίδα + μενού «Μάθηση». */
export const METHODOLOGY_TOPICS = [
  { id: 'oso', menuLabel: 'Όσο', title: 'Όσο … επανάλαβε' },
  { id: 'mexris_otou', menuLabel: 'Μέχρις ότου', title: 'Μέχρις_ότου … επανάλαβε' },
  { id: 'gia', menuLabel: 'Για', title: 'Για … από … μέχρι … με_βήμα … επανάλαβε' },
  {
    id: 'metatropes',
    menuLabel: 'Μετατροπές',
    title: 'Μετατροπές δομών επανάληψης',
  },
  { id: 'pinakes_1d', menuLabel: 'Πίνακες 1Δ', title: 'Μονοδιάστατοι πίνακες' },
  { id: 'pinakes_2d', menuLabel: 'Πίνακες 2Δ', title: 'Δισδιάστατοι πίνακες' },
  { id: 'metatropes_an', menuLabel: 'Μετατροπές Αν', title: 'Μετατροπές δομής Αν' },
  { id: 'klimakoti_xreosi', menuLabel: 'Κλιμακωτή χρέωση', title: 'Κλιμακωτή χρέωση' },
  { id: 'kanoniki_xreosi', menuLabel: 'Κανονική χρέωση', title: 'Κανονική χρέωση' },
  { id: 'akolouthia', menuLabel: 'Ακολουθία', title: 'Δομή ακολουθίας' },
] as const;

export type MethodologyTopicId = (typeof METHODOLOGY_TOPICS)[number]['id'];
