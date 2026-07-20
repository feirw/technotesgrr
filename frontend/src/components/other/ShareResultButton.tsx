import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Loader2, Check, AlertCircle } from 'lucide-react';
import {
  buildShareCaption,
  generateShareImageBlob,
  shareOrDownloadImage,
  type ShareCardData,
} from '@/utils/shareImage';

type Status = 'idle' | 'generating' | 'shared' | 'downloaded' | 'error';

interface ShareResultButtonProps {
  data: ShareCardData;
  className?: string;
  label?: string;
}

const STATUS_LABEL: Record<Status, string | null> = {
  idle: null,
  generating: 'Δημιουργία εικόνας...',
  shared: 'Έτοιμο για μοίρασμα!',
  downloaded: 'Η εικόνα κατέβηκε — ανέβασέ τη ως Story!',
  error: 'Κάτι πήγε στραβά, δοκίμασε ξανά.',
};

const ShareResultButton: React.FC<ShareResultButtonProps> = ({
  data,
  className = '',
  label = 'Μοιράσου το στο Instagram',
}) => {
  const [status, setStatus] = useState<Status>('idle');

  const handleShare = async () => {
    if (status === 'generating') return;
    setStatus('generating');
    try {
      const blob = await generateShareImageBlob(data);
      const filename = data.kind === 'quiz' ? 'technotesgr-quiz-score.png' : 'technotesgr-streak.png';
      const outcome = await shareOrDownloadImage(blob, filename, buildShareCaption(data));
      if (outcome === 'cancelled') {
        setStatus('idle');
        return;
      }
      setStatus(outcome);
      window.setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error('Error generating share image:', err);
      setStatus('error');
      window.setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const statusText = STATUS_LABEL[status];

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        onClick={() => void handleShare()}
        disabled={status === 'generating'}
        whileHover={status === 'generating' ? {} : { scale: 1.05 }}
        whileTap={status === 'generating' ? {} : { scale: 0.95 }}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f07f97] to-[#e06d88] hover:from-[#e06d88] hover:to-[#d75a76] text-white font-bold px-5 py-3 shadow-lg transition-colors disabled:opacity-70 ${className}`}
      >
        {status === 'generating' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : status === 'shared' || status === 'downloaded' ? (
          <Check className="w-5 h-5" />
        ) : status === 'error' ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <Instagram className="w-5 h-5" />
        )}
        {statusText ?? label}
      </motion.button>
    </div>
  );
};

export default ShareResultButton;
