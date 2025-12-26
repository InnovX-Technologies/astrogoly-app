import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Heart, Users, Calendar, Sparkles, Star } from 'lucide-react';
import './ComplimentaryServices.css';

const ComplimentaryServices = () => {
    const services = [
        {
            id: 'horoscope',
            title: "Today's Horoscope",
            description: 'Daily predictions for all zodiac signs',
            icon: <Sun size={32} />,
            color: '#FF9800',
            link: '/horoscopes',
            isFree: true
        },
        {
            id: 'kundli',
            title: 'Free Kundli',
            description: 'Get your detailed birth chart',
            icon: <Star size={32} />,
            color: '#9C27B0',
            link: '/kundli',
            isFree: true
        },
        {
            id: 'matching',
            title: 'Kundli Matching',
            description: 'Check compatibility with partner',
            icon: <Heart size={32} />,
            color: '#E91E63',
            link: '/matchmaking',
            isFree: true
        },
        {
            id: 'compatibility',
            title: 'Compatibility',
            description: 'Zodiac sign compatibility',
            icon: <Users size={32} />,
            color: '#00BCD4',
            link: '/matchmaking',
            isFree: true
        },
        {
            id: 'panchang',
            title: 'Panchang',
            description: 'Daily Hindu calendar',
            icon: <Calendar size={32} />,
            color: '#4CAF50',
            link: '/panchang',
            isFree: true
        },
        {
            id: 'tarot',
            title: 'Tarot Reading',
            description: 'Get instant tarot guidance',
            icon: <Sparkles size={32} />,
            color: '#673AB7',
            link: '/tarot',
            isFree: true
        }
    ];

    return (
        <section className="complimentary-services-section">
            <div className="container">
                <div className="section-header">
                    <h2>Complimentary Astrology Services</h2>
                    <p>Explore our free tools and services to discover your cosmic path</p>
                </div>

                <div className="complimentary-grid">
                    {services.map(service => (
                        <Link
                            key={service.id}
                            to={service.link}
                            className="complimentary-card"
                        >
                            {service.isFree && (
                                <div className="free-badge">FREE</div>
                            )}
                            <div
                                className="complimentary-icon"
                                style={{ backgroundColor: `${service.color}20`, color: service.color }}
                            >
                                {service.icon}
                            </div>
                            <h4>{service.title}</h4>
                            <p>{service.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ComplimentaryServices;
