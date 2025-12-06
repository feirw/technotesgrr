export interface Note {
  id: number;
  title: string;
  subject: string;
  pdfUrl: string;
  price: number;
}

export const notes: Note[] = [
  {
    id: 1,
    title: 'Θεωρία και Μεθοδολογίες',
    subject: 'Πληροφορική',
    pdfUrl: '/pdfs/notes.pdf',
    price: 10,
  },
];
