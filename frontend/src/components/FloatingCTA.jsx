import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, X, Sparkles } from 'lucide-react';
import './FloatingCTA.css';

const FloatingCTA = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Show after 3 seconds
        const timer = setTimeout(() => {
            if (!isDismissed) {
                setIsVisible(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [isDismissed]);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
    };

    if (!isVisible) return null;

    return (
        <div className="floating-cta">
            <button className="floating-cta-close" onClick={handleDismiss}>
                <X size={16} />
            </button>
            <Link to="/kundli" className="floating-cta-content">
                <div className="floating-cta-icon">
                    <Gift size={24} />
                    <Sparkles className="floating-sparkle" size={16} />
                </div>
                <div className="floating-cta-text">
                    <span className="floating-cta-title">Get Your FREE Kundli!</span>
                    <span className="floating-cta-subtitle">Limited Time Offer</span>
                </div>
            </Link>
        </div>
    );
};

export default FloatingCTA;
