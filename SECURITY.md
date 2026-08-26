# Πολιτική ασφαλείας

Αν βρεις ευπάθεια στο **technotesgr** (ιστοσελίδα ή API), πες το **ιδιωτικά**. Μην ανοίγεις δημόσιο issue και μην δημοσιεύεις exploit, keys ή προσωπικά δεδομένα μαθητών.

## Πώς να το αναφέρεις

1. **Προτιμητέο:** [GitHub private vulnerability report](https://github.com/feirw/technotesgrr/security/advisories/new)
2. Εναλλακτικά: φόρμα επικοινωνίας στο [technotes.gr](https://www.technotes.gr/#contact) — βάλε θέμα τύπου «Security» και μην βάζεις secrets στο μήνυμα αν μπορείς να τα στείλεις με άλλο ασφαλή τρόπο.

Στο report χρειάζονται:

- τι επηρεάζεται (URL, endpoint, σελίδα)
- βήματα αναπαραγωγής
- τι περίμενες vs τι γίνεται
- αντίκτυπος (π.χ. πρόσβαση σε ξένα δεδομένα, XSS, leak `.env`)
- αν έχεις ήδη PoC, περίγραψέ τον· μην τον ανεβάζεις δημόσια

Θα απαντήσουμε όσο πιο σύντομα γίνεται και θα ενημερώσουμε όταν διορθωθεί.

## Τι καλύπτεται

Παραγωγικό site (`technotes.gr` / `technotesgr.gr`) και το API, στο branch `main`.

Ενδεικτικά: XSS, CSRF, injection, leak secrets, broken auth, πρόσβαση σε ξένα quiz/progress, ανοιχτά endpoints, λάθος CORS.

## Τι δεν είναι report ασφαλείας

- κοινά bugs UI → [issue](https://github.com/feirw/technotesgrr/issues/new/choose)
- spam, phishing προς χρήστες, DoS χωρίς τεχνική περιγραφή
- θέματα σε dependencies χωρίς απόδειξη ότι μας αφορούν

## Secrets στο repo

Μην κάνεις commit `.env`, API keys, JWT secrets ή dumps βάσης. Αν διέρρευσε κάτι, πες το με private report και κάνε rotate το key.
