import React, { useState } from 'react';
import './Horoscopes.css';

const zodiacData = [
    { name: "Aries", dates: "Mar 21 - Apr 19", element: "Fire", symbol: "♈" },
    { name: "Taurus", dates: "Apr 20 - May 20", element: "Earth", symbol: "♉" },
    { name: "Gemini", dates: "May 21 - Jun 20", element: "Air", symbol: "♊" },
    { name: "Cancer", dates: "Jun 21 - Jul 22", element: "Water", symbol: "♋" },
    { name: "Leo", dates: "Jul 23 - Aug 22", element: "Fire", symbol: "♌" },
    { name: "Virgo", dates: "Aug 23 - Sep 22", element: "Earth", symbol: "♍" },
    { name: "Libra", dates: "Sep 23 - Oct 22", element: "Air", symbol: "♎" },
    { name: "Scorpio", dates: "Oct 23 - Nov 21", element: "Water", symbol: "♏" },
    { name: "Sagittarius", dates: "Nov 22 - Dec 21", element: "Fire", symbol: "♐" },
    { name: "Capricorn", dates: "Dec 22 - Jan 19", element: "Earth", symbol: "♑" },
    { name: "Aquarius", dates: "Jan 20 - Feb 18", element: "Air", symbol: "♒" },
    { name: "Pisces", dates: "Feb 19 - Mar 20", element: "Water", symbol: "♓" },
];

const Horoscopes = () => {
    const [selectedSign, setSelectedSign] = useState(null);

    return (
        <div className="container horoscopes-page">
            <div className="horoscope-header">
                <h1>Daily Horoscopes</h1>
                <p>Select your sign to get your cosmic insights for today.</p>
            </div>

            <div className="zodiac-grid">
                {zodiacData.map((sign) => (
                    <div
                        key={sign.name}
                        className="zodiac-card glass-panel"
                        onClick={() => setSelectedSign(sign)}
                    >
                        <div className="zodiac-symbol">{sign.symbol}</div>
                        <h3>{sign.name}</h3>
                        <span className="dates">{sign.dates}</span>
                    </div>
                ))}
            </div>

            {selectedSign && (
                <div className="modal-overlay" onClick={() => setSelectedSign(null)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedSign(null)}>&times;</button>
                        <div className="modal-header">
                            <div className="zodiac-symbol-large">{selectedSign.symbol}</div>
                            <div>
                                <h2>{selectedSign.name}</h2>
                                <p className="element-badge">{selectedSign.element}</p>
                            </div>
                        </div>
                        <div className="horoscope-text">
                            <h3>Today's Prediction</h3>
                            <p>
                                The stars are aligning in your favor today. A sudden opportunity at work or a message from an old friend might bring a smile to your face.
                                However, with the Moon transiting your house of finance, be cautious with impulsive spending.
                            </p>
                            <div className="lucky-stats">
                                <div>
                                    <span>Lucky Number</span>
                                    <strong>{(selectedSign.name.length * 2) % 9 + 1}</strong>
                                </div>
                                <div>
                                    <span>Lucky Color</span>
                                    <strong>{selectedSign.element === "Fire" ? "Red" : selectedSign.element === "Water" ? "Blue" : selectedSign.element === "Air" ? "Yellow" : "Green"}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Horoscopes;
