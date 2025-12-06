import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// 🎁 MERCH PAGE - COMING SOON
// ═══════════════════════════════════════════════════════════════

const MerchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Animated Gift Icon */}
          <motion.div
            className="text-9xl mb-8 inline-block"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            🎁
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-600 via-rose-500 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Coming Soon
          </motion.h1>

          {/* Subtitle placeholder */}
          <motion.p
            className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          ></motion.p>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Ετοιμάζουμε κάτι ξεχωριστό! Σύντομα θα βρεις εδώ οικονομικά σχολικά είδη εμπνευσμένα από
            την Πληροφορική των Πανελληνίων.
            <br />
            <span className="text-pink-600 dark:text-pink-400 font-semibold"></span>
          </motion.p>

          {/* Animated Dots */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Τετράδια και custom σημειοματάρια
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ιδανικά για οργανωτικούς μαθητές που θέλουν να παρακολουθούν την πρόοδο τους.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Στυλό, Μολύβια και κασετίνες
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Όλα όσα χρειάζεσαι για να γράψεις με στυλ στις εξετάσεις σου
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Αυτοκόλλητα, Ντοσιέ και posters
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Για να προσαρμόσεις τον χώρο σου και να μελετάς με έμπνευση
              </p>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.p
            className="mt-8 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          ></motion.p>
        </div>
      </div>
    </div>
  );
};

export default MerchPage;

/* ═══════════════════════════════════════════════════════════════
   📦 ORIGINAL CODE - COMMENTED OUT FOR FUTURE USE (TYPESCRIPT)
   ═══════════════════════════════════════════════════════════════

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  inStock: boolean;
  featured: boolean;
}

// ═══════════════════════════════════════════════════════════════
// 🛍️ DUMMY PRODUCTS DATA
// ═══════════════════════════════════════════════════════════════

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: '🎁 Starter Pack - Νέος Μαθητής',
    description: 'Το ιδανικό πακέτο για μαθητές που ξεκινούν την Πληροφορική! Περιλαμβάνει: Τετράδιο Algorithm Notes, Set στυλών Debug Edition, Stickers pack CS Classics και mousepad Binary Dreams.',
    price: '35.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: '🎁 Premium Pack - Επιτυχία',
    description: 'Το πλήρες πακέτο για σοβαρή προετοιμασία! Περιλαμβάνει: Hoodie "Syntax Error", T-Shirt "Recursion Master", Τετράδιο premium, Κούπα "Coffee && Code" και αφίσα Sorting Algorithms.',
    price: '89.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: '🎁 Study Essential Pack',
    description: 'Όλα τα απαραίτητα για αποδοτική μελέτη! Περιλαμβάνει: 2 Τετράδια Algorithm Notes, Set στυλών, Mousepad και αφίσα με αλγορίθμους ταξινόμησης για το γραφείο σου.',
    price: '45.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    name: '🎁 Fashionista Coder Pack',
    description: 'Για όσους αγαπούν το στυλ και τον κώδικα! Περιλαμβάνει: Φούτερ "Code & Conquer", T-Shirt "Recursion Master", Stickers pack και τσάντα tote με θέμα αλγορίθμους.',
    price: '65.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    id: 5,
    name: '🎁 Ultimate Bundle - Πανελλήνιες',
    description: 'Το απόλυτο πακέτο για τις Πανελλήνιες! Περιλαμβάνει: Hoodie premium, 3 T-Shirts, 5 Τετράδια, Set στυλών, Mousepad, Κούπα, 2 Αφίσες και bonus stickers pack.',
    price: '149.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    id: 6,
    name: '🎁 Coffee & Code Pack',
    description: 'Για τους λάτρεις του καφέ και του προγραμματισμού! Περιλαμβάνει: 2 Κούπες "Coffee && Code", Coasters set, Τετράδιο και mousepad με θέμα καφέ και αλγορίθμους.',
    price: '38.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    id: 7,
    name: '🎁 Classroom Hero Pack',
    description: 'Έτοιμος για κάθε μάθημα! Περιλαμβάνει: 3 Τετράδια με διαφορετικά θέματα, 2 Set στυλών, Φάκελο εργασιών, Bookmarks set και stickers για διακόσμηση.',
    price: '42.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    id: 8,
    name: '🎁 Desk Decor Pack',
    description: 'Διακόσμησε το γραφείο σου με στυλ! Περιλαμβάνει: 3 Αφίσες αλγορίθμων A2, Mousepad premium, Desk organizer, Plant pot με θέμα κώδικα και LED πινακίδα.',
    price: '55.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop',
    inStock: false,
    featured: false,
  },
  {
    id: 9,
    name: '🎁 Mini Pack - Γρήγορο Δώρο',
    description: 'Το τέλειο μικρό δώρο για κάθε περίσταση! Περιλαμβάνει: Τετράδιο pocket size, Set 2 στυλών, Stickers pack και bookmark με αλγορίθμους.',
    price: '18.00',
    category: 'Gift Pack',
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=400&fit=crop',
    inStock: true,
    featured: false,
  },
];

// ═══════════════════════════════════════════════════════════════
// 🛒 PRODUCT DETAILS MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
            aria-label="Κλείσιμο"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="grid md:grid-cols-2 gap-6 p-8">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                    Εξαντλημένο
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-sm font-semibold mb-3">
                  {product.category}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-bold text-pink-600 dark:text-pink-400">
                    €{product.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    (συμπ. ΦΠΑ)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={!product.inStock}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    product.inStock
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Προσθήκη στο Καλάθι
                    </span>
                  ) : (
                    'Μη Διαθέσιμο'
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Συνέχεια Αγορών
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🎴 PRODUCT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, index }) => {
  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 dark:from-gray-700 dark:to-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {product.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              Εξαντλημένο
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              €{product.price}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            disabled={!product.inStock}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              product.inStock
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 hover:shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.inStock ? 'Αγορά' : 'Sold Out'}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-500 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🏪 MAIN MERCH PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

const MerchPageFull: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [showCartNotification, setShowCartNotification] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

  const stats = {
    totalProducts: PRODUCTS.length,
    inStock: PRODUCTS.filter((p) => p.inStock).length,
    featuredPacks: PRODUCTS.filter((p) => p.featured).length,
  };

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <AnimatePresence>
        {showCartNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-[200] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Προστέθηκε στο καλάθι!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-pink-500 to-rose-500 text-white py-16 px-6">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-black mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            🎁 Gift Packs Πληροφορικής
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-blue-100 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Έτοιμα πακέτα δώρων για μαθητές & σπουδαστές!
          </motion.p>
          <motion.p
            className="text-md md:text-lg text-blue-200 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Από starter packs μέχρι premium bundles - όλα με θέμα την Πληροφορική!
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div>
              <div className="text-4xl font-bold">{stats.totalProducts}</div>
              <div className="text-blue-100">Gift Packs</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.inStock}</div>
              <div className="text-blue-100">Διαθέσιμα</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.featuredPacks}</div>
              <div className="text-blue-100">Featured</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{cart.length}</div>
              <div className="text-blue-100">Στο Καλάθι</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-pink-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Αναζήτηση gift pack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Βρέθηκαν <span className="font-bold text-pink-600">{filteredProducts.length}</span>{' '}
            gift packs
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredProducts.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Δεν βρέθηκαν gift packs
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Δοκίμασε να αλλάξεις την αναζήτηση
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={() => handleCardClick(product)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white py-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🎁 Το Τέλειο Δώρο για Μαθητές!
          </h2>
          <p className="text-lg text-pink-100 mb-6">
            Κάθε gift pack έχει σχεδιαστεί για να εμπνεύσει και να βοηθήσει μαθητές στην πορεία τους προς την επιτυχία!
          </p>
          <button className="bg-white text-pink-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-all hover:scale-105 shadow-lg">
            Βρες το Ιδανικό Pack
          </button>
        </motion.div>
      </div>
    </div>
  );
};
*/
