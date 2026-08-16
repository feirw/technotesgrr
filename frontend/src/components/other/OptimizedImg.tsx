import React from 'react';

function toWebpSrc(src: string): string {
  const [path, query] = src.split('?');
  const webp = path.replace(/\.(jpe?g|png)$/i, '.webp');
  return query ? `${webp}?${query}` : webp;
}

type OptimizedImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

/** Serves WebP when available, with original JPG/PNG as fallback. */
export const OptimizedImg: React.FC<OptimizedImgProps> = ({
  src,
  alt = '',
  loading = 'lazy',
  decoding = 'async',
  className,
  ...rest
}) => (
  <picture>
    <source type="image/webp" srcSet={toWebpSrc(src)} />
    <img src={src} alt={alt} loading={loading} decoding={decoding} className={className} {...rest} />
  </picture>
);
