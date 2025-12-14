import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import './Matchmaking.css';

const Matchmaking = () => {
    const [formData, setFormData] = useState({
        boyName: '',
        boyDate: '',
        girlName: '',
        girlDate: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            // Mock score generation
            const score = Math.floor(Math.random() * (36 - 18 + 1)) + 18; // Random score between 18 and 36
            setResult({
                score: score,
                total: 36,
                verdict: score > 25 ? "Excellent Match" : "Average Match"
            });
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="container matchmaking-page">
            <div className="match-header">
                <h1>Matchmaking</h1>
                <p>Check compatibility using the ancient Ashta Koota system.</p>
            </div>

            {!result ? (
                <div className="glass-panel form-container-wide">
                    {loading ? (
                        <div className="loading-state">
                            <Heart className="heart-beat-icon" size={48} color="#ff6b6b" />
                            <p>Calculating planetary compatibility...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid-cols-2">
                                <div className="partner-section">
                                    <h3>Boy's Details</h3>
                                    <input
                                        type="text" placeholder="Name"
                                        value={formData.boyName}
                                        onChange={e => setFormData({ ...formData, boyName: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="date"
                                        value={formData.boyDate}
                                        onChange={e => setFormData({ ...formData, boyDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="partner-section">
                                    <h3>Girl's Details</h3>
                                    <input
                                        type="text" placeholder="Name"
                                        value={formData.girlName}
                                        onChange={e => setFormData({ ...formData, girlName: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="date"
                                        value={formData.girlDate}
                                        onChange={e => setFormData({ ...formData, girlDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-action">
                                <button type="submit" className="btn-primary">Match Horoscope</button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                <div className="result-container glass-panel">
                    <h2>Match Report</h2>
                    <div className="score-circle">
                        <div className="score-inner">
                            <span className="score-value">{result.score}</span>
                            <span className="score-total">/ 36</span>
                        </div>
                        <svg className="progress-ring" width="160" height="160">
                            <circle
                                className="progress-ring__circle"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="8"
                                fill="transparent"
                                r="70"
                                cx="80"
                                cy="80"
                            />
                            <circle
                                className="progress-ring__circle fill"
                                stroke={result.score > 24 ? "#4caf50" : "#ffcc00"}
                                strokeWidth="8"
                                fill="transparent"
                                r="70"
                                cx="80"
                                cy="80"
                                style={{ strokeDashoffset: 440 - (440 * result.score) / 36 }}
                            />
                        </svg>
                    </div>
                    <div className="verdict">
                        <h3>{result.verdict}</h3>
                        <p>
                            {result.score > 24
                                ? "Great mental and spiritual compatibility. A harmonious union is predicted."
                                : "There are some differences. Understanding and patience will be key."}
                        </p>
                    </div>
                    <button onClick={() => setResult(null)} className="btn-outline">Check Another</button>
                </div>
            )}
        </div>
    );
};

export default Matchmaking;
