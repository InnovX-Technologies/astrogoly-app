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
    const [dayOffset, setDayOffset] = useState(0); // -1: Yest, 0: Today, 1: Tom
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

            // Directly query the local AI Astrology API
            // This relies 100% on the server generating fresh data via Gemini
            const response = await axios.get(`http://localhost:3001/api/horoscope`, {
                params: {
                    sign: selectedSign.name,
                    date: targetDate.toISOString(),
                    category: category
                }
            });

            if (response.data && response.data.data) {
                const aiData = response.data.data;
                // We expect valid JSON from the AI
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
                    setPrediction({ error: "AI is currently tuning into the cosmos..." });
                }
            } else {
                setPrediction({ error: "No signal from the stars." });
            }
        } catch (error) {
            console.error("AI Fetch Error:", error);
            // Explicit error state - NO FALBACKS
            setPrediction({ error: "Failed to connect to AI. Please ensure API Key is valid and server is running." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container horoscopes-page">
            <div className="horoscope-header">
                <h1>Horoscope - Daily, Weekly, Monthly & Yearly Predictions</h1>
                <p>Horoscopes provide detailed astrological predictions, helping you understand the influences of planets on your life.</p>
            </div>

            {/* Period Tabs */}
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

            {/* Zodiac Grid */}
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

            {/* Date Display */}
            <div className="date-display">
                <h2>{currentDate}</h2>
            </div>

            {/* Daily Controls */}
            {period === 'Daily' && (
                <div className="day-tabs">
                    <button className={`day-btn ${dayOffset === -1 ? 'active' : ''}`} onClick={() => setDayOffset(-1)}>Yesterday</button>
                    <button className={`day-btn ${dayOffset === 0 ? 'active' : ''}`} onClick={() => setDayOffset(0)}>Today</button>
                    <button className={`day-btn ${dayOffset === 1 ? 'active' : ''}`} onClick={() => setDayOffset(1)}>Tomorrow</button>
                </div>
            )}

            {/* Category Tabs */}
            <div className="category-tabs">
                {categories.map(c => (
                    <button
                        key={c.id}
                        className={`category-btn ${category === c.id ? 'active' : ''}`}
                        onClick={() => setCategory(c.id)}
                    >
                        <span className="cat-icon">{c.icon}</span> {c.label}
                    </button>
                ))}
            </div>

            {/* Prediction Content */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Consulting the stars...</p>
                </div>
            ) : (
                prediction ? (
                    !prediction.error ? (
                        <div className="prediction-content glass-panel fade-in">
                            <div className="prediction-text">
                                <p className="main-desc" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                    {prediction.description}
                                </p>

                                <div className="info-row">
                                    <span className="label">Colors of the day:</span>
                                    <span className="value">{prediction.color}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Lucky Numbers of the day:</span>
                                    <span className="value">{prediction.luckyNumbers}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Lucky Alphabets you will be in sync with:</span>
                                    <span className="value">{prediction.luckyAlphabets}</span>
                                </div>
                                <div className="info-row highlight">
                                    <span className="label">Cosmic Tip:</span>
                                    <span className="value">{prediction.cosmicTip}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Tips for Singles:</span>
                                    <span className="value">{prediction.singleTip}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Tips for Couples:</span>
                                    <span className="value">{prediction.coupleTip}</span>
                                </div>
                            </div>

                            <div className="luck-meter">
                                <div className="circle-chart" style={{ '--percentage': prediction.luckScore }}>
                                    <svg viewBox="0 0 36 36" className="circular-chart">
                                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle" strokeDasharray={`${prediction.luckScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <text x="18" y="20.35" className="percentage">{prediction.luckScore}%</text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="error-message glass-panel">
                            <h3>{prediction.error}</h3>
                            <p>Please check your server configuration and API keys.</p>
                        </div>
                    )
                ) : null
            )}
        </div>
    );
};

export default Horoscopes;
