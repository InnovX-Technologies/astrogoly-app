import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Star, Heart, Sun, Moon, Shield, Zap,
    Users, BarChart3, Globe, Sparkles,
    ArrowRight, CheckCircle2, MessageSquare
} from 'lucide-react';
import './Home.css';

const Home = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} className="text-gold" />
                        <span>Most Trusted Astrology Platform of 2024</span>
                    </div>
                    <h1>Unlock the Secrets<br /> <span className="text-gradient">of Your Destiny</span></h1>
                    <p>
                        Ancient Vedic Wisdom meets modern AI precision. Explore your past, master your present, and manifest your future with the world's most detailed astrological engine.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/kundli" className="btn-primary">
                            <span>Get Free Kundli</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/tarot" className="btn-outline">Read Tarot</Link>
                    </div>

                    <div className="hero-trust">
                        <div className="trust-item">
                            <div className="avatars">
                                <img src="https://i.pravatar.cc/40?u=1" alt="User" />
                                <img src="https://i.pravatar.cc/40?u=2" alt="User" />
                                <img src="https://i.pravatar.cc/40?u=3" alt="User" />
                            </div>
                            <span>10,000+ Happy Seekers</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="cosmic-ring"></div>
                    <div className="cosmic-ring-inner"></div>
                    <div className="floating-icons">
                        <Sun className="float-icon sun" size={32} />
                        <Moon className="float-icon moon" size={28} />
                        <Star className="float-icon star" size={24} />
                    </div>
                </div>
                <div className="hero-background">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="stars-overlay"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <StatItem icon={<BarChart3 />} count="1.2M+" label="Charts Generated" />
                        <StatItem icon={<Users />} count="500K+" label="Monthly Visitors" />
                        <StatItem icon={<Globe />} count="180+" label="Countries Supported" />
                        <StatItem icon={<Star />} count="4.9/5" label="User Rating" />
                    </div>
                </div>
            </section>

            {/* Main Services */}
            <section className="services container">
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
            <section className="why-choose-us">
                <div className="container choose-grid">
                    <div className="choose-content">
                        <span className="sub-title">Why AstroMania?</span>
                        <h2>The Science of Stars,<br /> Simplified for You</h2>
                        <div className="feature-list">
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
                    <div className="choose-image">
                        <div className="image-wrapper glass-panel">
                            <img src="https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=800" alt="Astrology" />
                            <div className="floating-card top">
                                <CheckCircle2 size={16} className="text-green" />
                                <span>Precise Lagna Calculation</span>
                            </div>
                            <div className="floating-card bottom">
                                <Sparkles size={16} className="text-gold" />
                                <span>AI Predictions Enabled</span>
                            </div>
                        </div>
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
