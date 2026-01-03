import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Star, Heart, Sun, Moon, Shield, Zap,
    Users, BarChart3, Globe, Sparkles,
    ArrowRight, CheckCircle2, MessageSquare, Search
} from 'lucide-react';
import FloatingCTA from '../components/FloatingCTA';
import TrustBadges from '../components/TrustBadges';
import MainServices from '../components/MainServices';
import ComplimentaryServices from '../components/ComplimentaryServices';
import InTheNews from '../components/InTheNews';
import './Home.css';

const Home = () => {
    const [scrolled, setScrolled] = useState(false);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        // Intersection Observer for Animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const toggleLang = (lang) => {
        // Placeholder for language toggle logic
        console.log("Language switched to", lang);
    };

    return (
        <div className="home-page">
            <div className="portal-container main-grid">
                {/* --- Left Column: Hero Banner & Content --- */}
                <div className="main-content">
                    {/* Hero Banner */}
                    <div className="hero-banner-wrap">
                        <div className="hero-bg-pattern"></div>
                        <h1 className="hero-main-text">aryabhatta se kalam tak -<br />main hoon innovative indian.</h1>

                        {/* Placeholder Figures */}
                        <div className="hero-figures">
                            {['Aryabhatta', 'Varahamihira', 'Ramanujan', 'CV Raman', 'Kalam', 'Vivekananda'].map((name, i) => (
                                <div key={i} className="figure-placeholder" title={name}>
                                    {name[0]}
                                </div>
                            ))}
                        </div>

                        <button className="know-more-btn">Know More</button>
                    </div>

                    {/* Stats or Text below banner */}
                    <div style={{ marginTop: '2rem' }}>
                        <TrustBadges />
                    </div>
                </div>

                {/* --- Right Column: Sidebar --- */}
                <div className="sidebar">
                    {/* Card 1: Brihat Kundli */}
                    <div className="sidebar-card">
                        <h3>Buy Brihat Kundli</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>250+ Pages of detailed life predictions</p>
                        <button className="buy-btn">BUY NOW</button>
                    </div>

                    {/* Card 2: AI Astrologer */}
                    <div className="sidebar-card">
                        <h3>AI Astrologers</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>World's smartest astrologers available 24/7</p>
                        <div className="ai-avatar-group">
                            <img src="https://i.pravatar.cc/100?u=10" alt="Bot 1" />
                            <img src="https://i.pravatar.cc/100?u=20" alt="Bot 2" />
                            <img src="https://i.pravatar.cc/100?u=30" alt="Bot 3" />
                        </div>
                        <button className="buy-btn" style={{ background: '#ffcc01', color: '#333', marginTop: '1rem' }}>First Chat Free</button>
                    </div>

                    {/* Card 3: Apps */}
                    <div className="sidebar-card">
                        <h3>Astrogoly on Mobile</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <div style={{ padding: '0.5rem', background: '#eee', borderRadius: '4px' }}>Android</div>
                            <div style={{ padding: '0.5rem', background: '#eee', borderRadius: '4px' }}>iOS</div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Main Services - Chat, Talk, Shop, Pooja */}
            <MainServices />

            {/* Stats Section */}
            <section className="stats-section animate-on-scroll">
                <div className="container">
                    <div className="stats-grid">
                        <StatItem icon={<BarChart3 />} count="1.2M+" label="Charts Generated" />
                        <StatItem icon={<Users />} count="500K+" label="Monthly Visitors" />
                        <StatItem icon={<Globe />} count="180+" label="Countries Supported" />
                        <StatItem icon={<Star />} count="4.9/5" label="User Rating" />
                    </div>
                </div>
            </section>

            {/* Complimentary Services */}
            <ComplimentaryServices />

            {/* Main Services */}
            <section className="services container animate-on-scroll">
                <div className="section-header">
                    <span className="sub-title">Our Sacred Services</span>
                    <h2>Expert Guidance for Every Path</h2>
                    <p>Discover deep insights into your life through our specialized astrological tools.</p>
                </div>
                <div className="services-grid">
                    <ServiceCard
                        to="/kundli"
                        icon={<Star size={32} color="#ffd700" />}
                        title="Kundli Generation"
                        desc="Detailed Shodashvarga analysis with 16 divisional charts and Vimshottari Dasha."
                        features={['Birth Chart', '16 Divisional Charts', 'Life Predictions']}
                    />
                    <ServiceCard
                        to="/matchmaking"
                        icon={<Heart size={32} color="#ff6b6b" />}
                        title="Matchmaking"
                        desc="Determine spiritual and physical compatibility using the ancient Guna Milan system."
                        features={['Compatibility Score', 'Conflict Analysis', 'Remedies']}
                    />
                    <ServiceCard
                        to="/horoscopes"
                        icon={<Sun size={32} color="#ffa500" />}
                        title="AI Horoscope"
                        desc="Daily, Weekly, and Monthly predictions powered by advanced planetary physics and Gemini AI."
                        features={['Personalized Scope', 'Lucky Elements', 'Cosmic Tips']}
                    />
                    <ServiceCard
                        to="/tarot"
                        icon={<Moon size={32} color="#e0aaff" />}
                        title="Tarot Reading"
                        desc="Gain clarity on specific questions with our interactive 3-card and Celtic Cross spreads."
                        features={['Major Arcana', 'Minor Arcana', 'Instant Guidance']}
                    />
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose-us" style={{ background: 'transparent', textAlign: 'center', paddingTop: '4rem' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', color: '#333', marginBottom: '0.5rem' }}>Why Trust Astrogoly?</h2>
                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>Your satisfaction and privacy are our top priorities</p>

                    <div className="feature-list" style={{ flexDirection: 'row', gap: '2rem', justifyContent: 'center' }}>
                        {/* Features preserved but styled for layout */}
                        <FeatureItem
                            icon={<Zap className="text-gold" />}
                            title="Real-time Calculations"
                            desc="Our engine uses NASA-grade JPL ephemeris for 99.9% calculation accuracy."
                        />
                        <FeatureItem
                            icon={<Shield className="text-gold" />}
                            title="Data Privacy"
                            desc="Your birth details are encrypted and never shared. Your privacy is our priority."
                        />
                        <FeatureItem
                            icon={<MessageSquare className="text-gold" />}
                            title="AI Insights"
                            desc="Modern interpretations combined with classical Vedic wisdom for practical advice."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials container">
                <div className="section-header">
                    <h2>What Our Seekers Say</h2>
                </div>
                <div className="testimonials-grid">
                    <TestimonialCard
                        name="Priya Sharma"
                        role="Software Engineer"
                        quote="The level of detail in the 16 divisional charts is unmatched. I finally understood my career path clearly."
                    />
                    <TestimonialCard
                        name="David Chen"
                        role="Entrepreneur"
                        quote="The daily AI horoscope is surprisingly accurate. It's become a part of my morning routine."
                    />
                    <TestimonialCard
                        name="Anita Roy"
                        role="Yoga Teacher"
                        quote="Beautiful UI and very easy to use. The matchmaking report helped us understand our strengths as a couple."
                    />
                </div>
            </section>

            {/* In The News */}
            <InTheNews />

            {/* Newsletter */}
            <section className="newsletter container">
                <div className="newsletter-card glass-panel">
                    <div className="newsletter-content">
                        <h2>Subscribe to Cosmic Guidance</h2>
                        <p>Receive weekly planetary insights and cosmic tips directly in your inbox.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email address" className="input-field" />
                            <button type="submit" className="btn-primary">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <TrustBadges />

            {/* Floating CTA */}
            <FloatingCTA />
        </div>
    );
};

const ServiceCard = ({ to, icon, title, desc, features }) => (
    <Link to={to} className="service-card glass-panel">
        <div className="service-top">
            <div className="icon-wrapper">{icon}</div>
        </div>
        <div className="service-body">
            <h3>{title}</h3>
            <p>{desc}</p>
            <ul className="card-features">
                {features.map((f, i) => (
                    <li key={i}><CheckCircle2 size={14} className="text-gold" /> {f}</li>
                ))}
            </ul>
        </div>
        <div className="service-footer">
            <span>Explore More</span>
            <ArrowRight size={16} />
        </div>
    </Link>
);

const StatItem = ({ icon, count, label }) => (
    <div className="stat-item">
        <div className="stat-icon">{icon}</div>
        <div className="stat-data">
            <span className="stat-count">{count}</span>
            <span className="stat-label">{label}</span>
        </div>
    </div>
);

const FeatureItem = ({ icon, title, desc }) => (
    <div className="feature-item">
        <div className="feature-icon">{icon}</div>
        <div className="feature-text">
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    </div>
);

const TestimonialCard = ({ name, role, quote }) => (
    <div className="testimonial-card glass-panel">
        <p className="quote">"{quote}"</p>
        <div className="client-info">
            <div className="client-avatar">{name[0]}</div>
            <div className="client-meta">
                <span className="client-name">{name}</span>
                <span className="client-role">{role}</span>
            </div>
        </div>
    </div>
);

export default Home;
