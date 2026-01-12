import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook, Twitter, Instagram, Youtube,
    Mail, Phone, MapPin, ExternalLink,
    Sparkles, ShieldCheck
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <Link to="/" className="f-logo">
                        <Sparkles className="text-gold" />
                        <span>AstroNexa</span>
                    </Link>
                    <p>
                        Empowering lives through ancient Vedic wisdom and modern computational precision. Your ultimate destination for celestial guidance since 2024.
                    </p>
                    <div className="social-links">
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Youtube size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h3>Astrology Tools</h3>
                        <ul>
                            <li><Link to="/kundli">Premium Kundli</Link></li>
                            <li><Link to="/matchmaking">Guna Milan</Link></li>
                            <li><Link to="/horoscopes">Daily AI Horoscope</Link></li>
                            <li><Link to="/tarot">Tarot Reading</Link></li>
                        </ul>
                    </div>

                    <div className="link-group">
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="#">Zodiac Guide</a></li>
                            <li><a href="#">Planetary Transits</a></li>
                            <li><a href="#">Nakshatra Meanings</a></li>
                            <li><a href="#">Vedic Glossary</a></li>
                        </ul>
                    </div>

                    <div className="link-group">
                        <h3>Contact Info</h3>
                        <ul className="contact-list">
                            <li><Mail size={16} /> <span>contact@innovxtechnologies.com</span></li>
                            <li><Phone size={16} /> <span>+91 9876543210</span></li>
                            <li><MapPin size={16} /> <span>Pune, Maharashtra, IN</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container b-content">
                    <p>© 2026 AstroNexa. All rights reserved to InnovX Technologies.</p>
                    <div className="b-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <div className="secure-badge">
                            <ShieldCheck size={14} className="text-green" />
                            <span>SSL Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
