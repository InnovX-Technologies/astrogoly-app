import React from 'react';
import { Shield, Lock, CheckCircle2, Users, Award, Zap } from 'lucide-react';
import './TrustBadges.css';

const TrustBadges = () => {
    const badges = [
        {
            icon: <Shield size={24} />,
            title: 'Private & Confidential',
            desc: 'Your data is encrypted'
        },
        {
            icon: <CheckCircle2 size={24} />,
            title: 'Verified Calculations',
            desc: 'NASA-grade accuracy'
        },
        {
            icon: <Lock size={24} />,
            title: 'Secure Payments',
            desc: '100% safe transactions'
        },
        {
            icon: <Users size={24} />,
            title: '500K+ Users',
            desc: 'Trusted worldwide'
        },
        {
            icon: <Award size={24} />,
            title: 'Expert Astrologers',
            desc: 'Certified professionals'
        },
        {
            icon: <Zap size={24} />,
            title: 'Instant Results',
            desc: 'Real-time calculations'
        }
    ];

    return (
        <section className="trust-badges-section">
            <div className="container">
                <div className="trust-badges-header">
                    <h3>Why Trust Astrogoly?</h3>
                    <p>Your satisfaction and privacy are our top priorities</p>
                </div>
                <div className="trust-badges-grid">
                    {badges.map((badge, index) => (
                        <div key={index} className="trust-badge">
                            <div className="trust-badge-icon">
                                {badge.icon}
                            </div>
                            <div className="trust-badge-content">
                                <h4>{badge.title}</h4>
                                <p>{badge.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
