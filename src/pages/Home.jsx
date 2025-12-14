import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Sun, Moon } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <div className="container hero-content">
                    <h1>Unlock the Secrets<br />of the Universe</h1>
                    <p>
                        Your destiny is written in the stars. Explore your past, present, and future with our premium astrological services.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/kundli" className="btn-primary">Get Free Kundli</Link>
                        <Link to="/tarot" className="btn-outline">Read Tarot</Link>
                    </div>
                </div>
                <div className="hero-background">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                </div>
            </section>

            <section className="services container">
                <h2>Our Services</h2>
                <div className="services-grid">
                    <ServiceCard
                        to="/kundli"
                        icon={<Star size={32} color="#ffd700" />}
                        title="Kundli Generation"
                        desc="Detailed birth chart analysis and predictions based on Vedic Astrology."
                    />
                    <ServiceCard
                        to="/matchmaking"
                        icon={<Heart size={32} color="#ff6b6b" />}
                        title="Matchmaking"
                        desc="Check compatibility with your partner using Ashta Koota Guna Milan."
                    />
                    <ServiceCard
                        to="/horoscopes"
                        icon={<Sun size={32} color="#ffa500" />}
                        title="Daily Horoscope"
                        desc="Insights for all 12 zodiac signs updated daily."
                    />
                    <ServiceCard
                        to="/tarot"
                        icon={<Moon size={32} color="#e0aaff" />}
                        title="Tarot Reading"
                        desc="Interactive tarot card reading for guidance and clarity."
                    />
                </div>
            </section>
        </div>
    );
};

const ServiceCard = ({ to, icon, title, desc }) => (
    <Link to={to} className="service-card glass-panel">
        <div className="icon-wrapper">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </Link>
);

export default Home;
