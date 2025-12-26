import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Clock, Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(timer);
        };
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Kundli', path: '/kundli' },
        { name: 'Matchmaking', path: '/matchmaking' },
        { name: 'Horoscopes', path: '/horoscopes' },
        { name: 'Tarot', path: '/tarot' },
        { name: 'Chat', path: '/chat' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            {/* Top Info Bar */}
            <div className={`top-info-bar ${isScrolled ? 'hidden' : ''}`}>
                <div className="container info-bar-content">
                    <div className="info-item">
                        <Clock size={12} className="text-gold" />
                        <span>Siderial Transit: Sun in Sagittarius</span>
                    </div>
                    <div className="info-item">
                        <Moon size={12} className="text-gold" />
                        <span>Moon Phase: Waxing Gibbous</span>
                    </div>
                    <div className="info-time">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>
            </div>

            <div className="container nav-container">
                <Link to="/" className="logo">
                    <div className="logo-sparkle-wrapper">
                        <Sparkles className="logo-icon" />
                        <div className="sparkle-glow"></div>
                    </div>
                    <div className="logo-text">
                        <span className="brand-name">Astrogoly</span><br></br>
                        <span className="brand-tagline">Vedic Wisdom</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="nav-main">
                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={location.pathname === link.path ? 'active' : ''}
                                >
                                    {link.name}
                                    <div className="link-indicator"></div>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="nav-actions">
                        <button className="theme-toggle" onClick={toggleTheme} title="Switch Theme">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="btn-nav-premium">
                            <Zap size={14} />
                            <span>Premium</span>
                        </button>
                    </div>
                </div>

                <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu glass-panel">
                        <div className="mobile-brand">
                            <Sparkles className="text-gold" />
                            <span>Astrogoly Menu</span>
                        </div>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={location.pathname === link.path ? 'active' : ''}
                            >
                                <span className="m-link-text">{link.name}</span>
                                {location.pathname === link.path && <div className="m-active-dot"></div>}
                            </Link>
                        ))}
                        <button className="btn-primary w-full mt-4">Upgrade to Premium</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
