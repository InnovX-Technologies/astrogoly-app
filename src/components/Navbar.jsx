import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <Sparkles className="logo-icon" />
                    <span>AstroGoly</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="nav-links">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.path}
                                className={location.pathname === link.path ? 'active' : ''}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu glass-panel">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={location.pathname === link.path ? 'active' : ''}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
