import React, { useState } from 'react';
import { Heart, Star, ShieldCheck, Info, CheckCircle2, AlertCircle } from 'lucide-react';
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
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3001/api/matchmaking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    boyDate: formData.boyDate,
                    girlDate: formData.girlDate
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setResult(data);
        } catch (err) {
            setError("Failed to calculate compatibility. Please check dates.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="matchmaking-container">
            <div className="container">
                <header className="match-header">
                    <h1>Celestial Compatibility</h1>
                    <p>Ancient Ashta Koota Guna Milan for Spiritual Harmony</p>
                </header>

                <div className="match-layout">
                    {!result ? (
                        <div className="form-wrapper glass-panel">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="heart-animation">
                                        <Heart size={64} className="heart-icon" />
                                        <div className="pulse"></div>
                                    </div>
                                    <p>Analyzing planetary alignments for {formData.boyName} & {formData.girlName}...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="match-form">
                                    <div className="partners-grid">
                                        <div className="partner-card">
                                            <div className="card-top boy">
                                                <div className="avatar-placeholder">♂</div>
                                                <h3>Groom's Details</h3>
                                            </div>
                                            <div className="card-body">
                                                <div className="form-group">
                                                    <label>Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.boyName}
                                                        onChange={e => setFormData({ ...formData, boyName: e.target.value })}
                                                        placeholder="Enter name"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Birth Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.boyDate}
                                                        onChange={e => setFormData({ ...formData, boyDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="match-vs">
                                            <div className="vs-circle">VS</div>
                                        </div>

                                        <div className="partner-card">
                                            <div className="card-top girl">
                                                <div className="avatar-placeholder">♀</div>
                                                <h3>Bride's Details</h3>
                                            </div>
                                            <div className="card-body">
                                                <div className="form-group">
                                                    <label>Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.girlName}
                                                        onChange={e => setFormData({ ...formData, girlName: e.target.value })}
                                                        placeholder="Enter name"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Birth Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.girlDate}
                                                        onChange={e => setFormData({ ...formData, girlDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-footer">
                                        <button type="submit" className="btn-match">
                                            <span>Check Compatibility</span>
                                            <Heart size={18} />
                                        </button>
                                        {error && <p className="error-msg"><AlertCircle size={14} /> {error}</p>}
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="match-result-view">
                            <div className="result-main glass-panel">
                                <div className="result-header">
                                    <div className="score-viz">
                                        <div className="score-circle">
                                            <span className="s-val">{result.totalScore}</span>
                                            <span className="s-max">/ 36</span>
                                        </div>
                                        <svg className="ring" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" />
                                            <circle cx="50" cy="50" r="45" className="fill" style={{ strokeDashoffset: 283 - (283 * result.totalScore) / 36 }} />
                                        </svg>
                                    </div>
                                    <div className="verdict-info">
                                        <h2 className={result.totalScore >= 18 ? "success" : "warning"}>{result.verdict}</h2>
                                        <p>Comprehensive report for {formData.boyName} & {formData.girlName}</p>
                                    </div>
                                </div>

                                <div className="guna-breakdown">
                                    <h3>Ashta Koota Analysis</h3>
                                    <div className="guna-grid">
                                        {result.details.map((guna, idx) => (
                                            <div key={idx} className="guna-item">
                                                <div className="g-meta">
                                                    <span className="g-name">{guna.name}</span>
                                                    <span className="g-score">{guna.score} / {guna.max}</span>
                                                </div>
                                                <div className="g-bar">
                                                    <div className="g-fill" style={{ width: `${(guna.score / guna.max) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="result-actions">
                                    <button onClick={() => setResult(null)} className="btn-outline">New Match</button>
                                    <button className="btn-primary">Download PDF Report</button>
                                </div>
                            </div>

                            <aside className="match-info-sidebar">
                                <div className="info-card glass-panel">
                                    <h3><Info size={18} /> Significance</h3>
                                    <ul>
                                        <li><strong>18-24:</strong> Recommended for a stable union.</li>
                                        <li><strong>25-32:</strong> Excellent spiritual compatibility.</li>
                                        <li><strong>33-36:</strong> Rare heavenly alignment.</li>
                                    </ul>
                                </div>
                                <div className="info-card glass-panel">
                                    <h3><ShieldCheck size={18} /> Verified Analysis</h3>
                                    <p>Our algorithm follows classical Brihat Parashara Hora Shastra guidelines for maximum accuracy.</p>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Matchmaking;
