import React from 'react';
import Slider, { Settings } from 'react-slick';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// --- Types ---

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
}

interface SliderCardProps<T> {
  title: string;
  data: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  sliderSettings?: Settings;
  containerClassName?: string;
  titleClassName?: string;
}

// --- Constants ---

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

// --- Sub-Components ---

const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg"
    style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
    whileHover={{ scale: 1.1, x: -4 }}
    whileTap={{ scale: 0.9 }}
    aria-label="Previous"
  >
    <ChevronLeft className="w-6 h-6 text-white" />
  </motion.button>
);

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg"
    style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
    whileHover={{ scale: 1.1, x: 4 }}
    whileTap={{ scale: 0.9 }}
    aria-label="Next"
  >
    <ChevronRight className="w-6 h-6 text-white" />
  </motion.button>
);

// --- Main Component ---

// Using a generic component <T,> to infer the type of data items
const SliderCard = <T,>({
  title,
  data,
  renderCard,
  sliderSettings = {},
  containerClassName = '',
  titleClassName = '',
}: SliderCardProps<T>) => {
  const defaultSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false },
      },
    ],
    ...sliderSettings,
  };

  return (
    <div className={`py-16 bg-gradient-to-br from-pink-50 to-rose-50 ${containerClassName}`}>
      <div className="container mx-auto px-6">
        <motion.h2
          className={`text-4xl font-black text-center mb-12 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent ${titleClassName}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>

        <motion.div
          className="max-w-full mx-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Slider {...defaultSettings}>
            {data.map((item, index) => (
              <div key={index} className="px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-full"
                >
                  {renderCard(item, index)}
                </motion.div>
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>

      <style>{`
        .slick-dots li button:before {
          color: ${BRAND} !important;
          font-size: 12px !important;
        }
        .slick-dots li.slick-active button:before {
          color: ${BRAND_DARK} !important;
        }
      `}</style>
    </div>
  );
};

export default SliderCard;
