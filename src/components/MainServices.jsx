import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, ShoppingBag, Sparkles } from 'lucide-react';
import './MainServices.css';

const MainServices = () => {
    const services = [
        {
            id: 'chat',
            title: 'Chat with Astrologer',
            description: 'Connect with expert astrologers via chat',
            icon: <MessageSquare size={40} />,
            color: '#FF6B9D',
            link: '/chat',
            badge: 'Most Popular'
        },
        {
            id: 'call',
            title: 'Talk to Astrologer',
            description: 'Get instant guidance over call',
            icon: <Phone size={40} />,
            color: '#4CAF50',
            link: '/chat',
            badge: 'Quick Response'
        },
        {
            id: 'shop',
            title: 'Astromall',
            description: 'Spiritual products & remedies',
            icon: <ShoppingBag size={40} />,
            color: '#2196F3',
            link: '/shop',
            badge: 'New Arrivals'
        },
        {
            id: 'pooja',
            title: 'Book A Pooja',
            description: 'Online & offline pooja services',
            icon: <Sparkles size={40} />,
            color: '#FF9800',
            link: '/pooja',
            badge: 'Verified Pandits'
        }
    ];

    return (
        <section className="main-services-section">
            <div className="container">
                <div className="main-services-grid">
                    {services.map(service => (
                        <Link
                            key={service.id}
                            to={service.link}
                            className="main-service-card"
                            style={{ '--service-color': service.color }}
                        >
                            {service.badge && (
                                <div className="service-badge">{service.badge}</div>
                            )}
                            <div
                                className="service-icon-wrapper"
                                style={{ backgroundColor: service.color }}
                            >
                                {service.icon}
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                            <div className="service-cta">
                                <span>Get Started</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MainServices;
