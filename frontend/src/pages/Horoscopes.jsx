import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Horoscopes.css';

const zodiacSigns = [
    { name: "Aries", symbol: "♈", date: "Mar 21 - Apr 19" },
    { name: "Taurus", symbol: "♉", date: "Apr 20 - May 20" },
    { name: "Gemini", symbol: "♊", date: "May 21 - Jun 20" },
    { name: "Cancer", symbol: "♋", date: "Jun 21 - Jul 22" },
    { name: "Leo", symbol: "♌", date: "Jul 23 - Aug 22" },
    { name: "Virgo", symbol: "♍", date: "Aug 23 - Sep 22" },
    { name: "Libra", symbol: "♎", date: "Sep 23 - Oct 22" },
    { name: "Scorpio", symbol: "♏", date: "Oct 23 - Nov 21" },
    { name: "Sagittarius", symbol: "♐", date: "Nov 22 - Dec 21" },
    { name: "Capricorn", symbol: "♑", date: "Dec 22 - Jan 19" },
    { name: "Aquarius", symbol: "♒", date: "Jan 20 - Feb 18" },
    { name: "Pisces", symbol: "♓", date: "Feb 19 - Mar 20" },
];

const categories = [
    { id: 'personal', label: 'Personal', icon: '🧘' },
    { id: 'health', label: 'Health', icon: '❤️' },
    { id: 'profession', label: 'Profession', icon: '💼' },
    { id: 'emotions', label: 'Emotions', icon: '💖' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'luck', label: 'Luck', icon: '🐞' },
];

const Horoscopes = () => {
    const [period, setPeriod] = useState('Daily');
    const [selectedSign, setSelectedSign] = useState(zodiacSigns[0]);
    const [dayOffset, setDayOffset] = useState(0);
    const [category, setCategory] = useState('personal');
    const [currentDate, setCurrentDate] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(date.toLocaleDateString('en-US', options));

        fetchHoroscopeData();
    }, [dayOffset, selectedSign, period, category]);

    const fetchHoroscopeData = async () => {
        setLoading(true);
        setPrediction(null);

        try {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + dayOffset);

            const response = await axios.get(`/api/horoscope`, {
                params: {
                    sign: selectedSign.name,
                    date: targetDate.toISOString(),
                    category: category
                }
            });

            if (response.data && response.data.data) {
                const aiData = response.data.data;
                if (aiData.lucky_color) {
                    setPrediction({
                        description: aiData.horoscope_data,
                        color: aiData.lucky_color,
                        luckyNumbers: aiData.lucky_numbers,
                        luckyAlphabets: aiData.lucky_alphabets,
                        cosmicTip: aiData.cosmic_tip,
                        singleTip: aiData.single_tip,
                        coupleTip: aiData.couple_tip,
                        luckScore: aiData.lucky_score
                    });
                } else {
                    setPrediction({ error: "Focusing cosmic energies..." });
                }
            } else {
                setPrediction({ error: "Stars are shy today." });
            }
        } catch (error) {
            console.error("AI Fetch Error:", error);
            setPrediction({ error: "Failed to connect to the cosmos. Ensure server is active." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="horoscopes-page">
            <div className="container">
                <header className="horoscope-header">
                    <h1>Celestial Forecast</h1>
                    <p>Daily, Weekly, Monthly & Yearly AI Predictions tailored to your zodiac's unique energy signature.</p>
                </header>

                <div className="period-tabs">
                    {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(p => (
                        <button
                            key={p}
                            className={`period-btn ${period === p ? 'active' : ''}`}
                            onClick={() => setPeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="h-zodiac-grid">
                    {zodiacSigns.map(sign => (
                        <div
                            key={sign.name}
                            className={`h-zodiac-card ${selectedSign.name === sign.name ? 'active' : ''}`}
                            onClick={() => setSelectedSign(sign)}
                        >
                            <div className="h-zodiac-icon">{sign.symbol}</div>
                            <span>{sign.name}</span>
                        </div>
                    ))}
                </div>

                <div className="prediction-area">
                    <div className="date-display" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2>{currentDate}</h2>
                    </div>

                    {period === 'Daily' && (
                        <div className="day-tabs" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
                            <button className={`period-btn ${dayOffset === -1 ? 'active' : ''}`} onClick={() => setDayOffset(-1)}>Yesterday</button>
                            <button className={`period-btn ${dayOffset === 0 ? 'active' : ''}`} onClick={() => setDayOffset(0)}>Today</button>
                            <button className={`period-btn ${dayOffset === 1 ? 'active' : ''}`} onClick={() => setDayOffset(1)}>Tomorrow</button>
                        </div>
                    )}

                    <div className="category-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center', marginBottom: '4rem' }}>
                        {categories.map(c => (
                            <button
                                key={c.id}
                                className={`period-btn ${category === c.id ? 'active' : ''}`}
                                onClick={() => setCategory(c.id)}
                            >
                                <span style={{ marginRight: '8px' }}>{c.icon}</span> {c.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '5rem' }}>
                            <div className="spinner" style={{ width: '60px', height: '60px', border: '4px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Consulting the celestial patterns for {selectedSign.name}...</p>
                        </div>
                    ) : (
                        prediction ? (
                            !prediction.error ? (
                                <div className="prediction-content fade-in">
                                    <div className="prediction-text">
                                        <div className="info-row main-desc-box">
                                            <span className="label">Cosmic Overview</span>
                                            <p className="value">{prediction.description}</p>
                                        </div>

                                        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                                            <div className="info-row">
                                                <span className="label">Fortunate Colors</span>
                                                <p className="value">{prediction.color}</p>
                                            </div>
                                            <div className="info-row">
                                                <span className="label">Lucky Numbers</span>
                                                <p className="value">{prediction.luckyNumbers}</p>
                                            </div>
                                            <div className="info-row">
                                                <span className="label">Astral Sync Alphabets</span>
                                                <p className="value">{prediction.luckyAlphabets}</p>
                                            </div>
                                        </div>

                                        <div className="info-row highlight-box" style={{ background: 'var(--primary-glow)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                                            <span className="label" style={{ color: 'var(--accent-gold)' }}>Cosmic Tip</span>
                                            <p className="value" style={{ fontStyle: 'italic', fontWeight: '700' }}>{prediction.cosmicTip}</p>
                                        </div>
                                    </div>

                                    <div className="luck-meter">
                                        <h3>Luck Resonance</h3>
                                        <div className="circle-chart">
                                            <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '200px', height: '200px' }}>
                                                <path className="circle-bg" stroke="var(--glass-border)" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path className="circle" stroke="var(--primary)" strokeWidth="2.5" strokeDasharray={`${prediction.luckScore}, 100`} fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <text x="18" y="21" className="percentage" style={{ fill: 'var(--text-main)', fontSize: '0.6rem', fontWeight: '900' }} textAnchor="middle">{prediction.luckScore}%</text>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="error-message glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                                    <h3 style={{ color: '#ff6b6b' }}>{prediction.error}</h3>
                                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>The universe is currently realigning. Please try again in a few moments.</p>
                                </div>
                            )
                        ) : null
                    )}
                </div>
            </div>
        </div>
    );
};

export default Horoscopes;
