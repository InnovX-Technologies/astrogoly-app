import React, { useState, useEffect, useRef } from 'react';
import './ProgressiveImage.css';

const ProgressiveImage = ({
    src,
    placeholder,
    alt = '',
    className = '',
    onLoad,
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(placeholder || '');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        // Intersection Observer for lazy loading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px' // Start loading 50px before image enters viewport
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isInView || !src) return;

        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImageSrc(src);
            setImageLoaded(true);
            onLoad?.();
        };

        img.onerror = () => {
            console.error('Failed to load image:', src);
        };
    }, [isInView, src, onLoad]);

    return (
        <div
            ref={imgRef}
            className={`progressive-image-wrapper ${className}`}
            {...props}
        >
            <img
                src={imageSrc}
                alt={alt}
                className={`progressive-image ${imageLoaded ? 'loaded' : 'loading'}`}
                loading="lazy"
            />
            {!imageLoaded && (
                <div className="image-skeleton">
                    <div className="skeleton-shimmer"></div>
                </div>
            )}
        </div>
    );
};

export default ProgressiveImage;
