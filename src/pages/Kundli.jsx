import React, { useState } from 'react';
import { Compass, Calendar, Clock, MapPin, Loader2, Info, User, Sparkles } from 'lucide-react';
import './Kundli.css';

const Kundli = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        latitude: '',
        longitude: '',
        city: ''
    });
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeVarga, setActiveVarga] = useState('d1');
    const [activeDashaSystem, setActiveDashaSystem] = useState('vimshottari');
    const [expandedDasha, setExpandedDasha] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchCoordinates = async () => {
        if (!formData.city) return;
        setLoading(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.city)}&limit=1`);
            const data = await res.json();
            if (data && data[0]) {
                setFormData(prev => ({
                    ...prev,
                    latitude: data[0].lat,
                    longitude: data[0].lon
                }));
            }
        } catch (err) {
            console.error("Geocoding error:", err);
            setError("Could not find coordinates for this city. Please enter them manually.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

            const response = await fetch('http://localhost:3001/api/birth-chart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setChartData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="kundli-container">
            <div className="container">
                <header className="kundli-header">
                    <h1>Personalized Vedic Kundli</h1>
                    <p>Comprehensive Shodashvarga Analysis with Precise Sidereal Calculations</p>
                </header>

                <div className="kundli-layout">
                    {/* Input Section */}
                    <aside className="kundli-sidebar">
                        <form onSubmit={handleSubmit} className="kundli-form">
                            <div className="form-group">
                                <label><User size={16} className="label-icon" /> Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><MapPin size={16} className="label-icon" /> City / Location</label>
                                <div className="input-row">
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="City name..."
                                    />
                                    <button type="button" onClick={fetchCoordinates} className="btn-geo">
                                        <Compass size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="form-group">
                                    <label><Calendar size={16} className="label-icon" /> Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="input-field" required />
                                </div>
                                <div className="form-group">
                                    <label><Clock size={16} className="label-icon" /> Time</label>
                                    <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="input-field" required />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="form-group">
                                    <label className="text-xs">Lat</label>
                                    <input type="text" name="latitude" value={formData.latitude} onChange={handleInputChange} className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label className="text-xs">Lon</label>
                                    <input type="text" name="longitude" value={formData.longitude} onChange={handleInputChange} className="input-field" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-generate">
                                {loading ? <Loader2 className="spinner" /> : 'GENERATE KUNDLI'}
                            </button>

                            {error && <p className="error-text">{error}</p>}
                        </form>
                    </aside>

                    {/* Results Section */}
                    <main className="results-area">
                        {!chartData && !loading && (
                            <div className="empty-state">
                                <Info className="empty-icon" />
                                <p>Enter birth details to visualize the complete Shodashvarga configuration</p>
                            </div>
                        )}

                        {loading && (
                            <div className="empty-state">
                                <Loader2 size={48} className="spinner" style={{ color: '#d69e2e' }} />
                            </div>
                        )}

                        {chartData && (
                            <div className="results-grid">
                                {/* AI Summary Section */}
                                {chartData.aiSummary && (
                                    <div className="result-card ai-summary-card">
                                        <div className="ai-header">
                                            <Sparkles className="text-gold" size={24} />
                                            <h2 className="card-title">Cosmic Interpretation</h2>
                                        </div>
                                        <div className="ai-content">
                                            {chartData.aiSummary.split('\n').map((para, i) => (
                                                para.trim() && <p key={i}>{para}</p>
                                            ))}
                                        </div>
                                        <div className="ai-footer">
                                            <Info size={14} />
                                            <span>AI insights based on your unique planetary configuration.</span>
                                        </div>
                                    </div>
                                )}

                                {/* Varga Explorer Selector */}
                                <div className="varga-explorer-panel">
                                    <div className="explorer-header">
                                        <div className="varga-title-group">
                                            <h2 className="varga-title">Varga Explorer</h2>
                                            <p className="varga-subtitle">Divisional Chart Analysis</p>
                                        </div>
                                        <div className="varga-tabs">
                                            {chartData.vargas && Object.keys(chartData.vargas).map(key => (
                                                <button
                                                    key={key}
                                                    onClick={() => setActiveVarga(key)}
                                                    className={`varga-tab ${activeVarga === key ? 'active' : ''}`}
                                                >
                                                    {key.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="explorer-content">
                                        {chartData.vargas && chartData.vargas[activeVarga] ? (
                                            <>
                                                <div className="main-chart-card">
                                                    <h3 className="chart-name-display">{chartData.vargas[activeVarga].name}</h3>
                                                    <div className="chart-wrapper">
                                                        <NorthIndianChart houses={chartData.vargas[activeVarga].houses} />
                                                    </div>
                                                </div>

                                                <div className="varga-details">
                                                    <div className="result-card info-card">
                                                        <h3 className="card-title"><Calendar size={18} /> Panchang</h3>
                                                        <div className="panchang-grid">
                                                            <div className="detail-item"><span>Vara</span> <strong>{chartData.panchang.vara}</strong></div>
                                                            <div className="detail-item"><span>Tithi</span> <strong>{chartData.panchang.tithi}</strong></div>
                                                            <div className="detail-item"><span>Nakshatra</span> <strong>{chartData.panchang.nakshatra}</strong></div>
                                                            <div className="detail-item"><span>Yoga</span> <strong>{chartData.panchang.yoga}</strong></div>
                                                            <div className="detail-item"><span>Karana</span> <strong>{chartData.panchang.karana}</strong></div>
                                                            <div className="detail-item"><span>Lagna</span> <strong>{chartData.lagna.name}</strong></div>
                                                        </div>
                                                    </div>

                                                    <div className="result-card planetary-card">
                                                        <h3 className="card-title"><Compass size={18} /> Planets</h3>
                                                        <div className="planets-grid-mini">
                                                            {Object.entries(chartData.planets).map(([name, data]) => (
                                                                <div key={name} className="planet-mini-row">
                                                                    <span className="p-short-name">{name.substring(0, 2)}</span>
                                                                    <div className="p-mini-data">
                                                                        <span className="p-mini-sign">{data.rashi.name}</span>
                                                                        <span className="p-mini-deg">{data.rashi.formatted}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="secondary-charts">
                                    <div className="result-card sub-chart">
                                        <h3 className="card-title">Chandra Kundali</h3>
                                        <div className="chart-wrapper-small">
                                            <NorthIndianChart houses={chartData.chandraHouses} />
                                        </div>
                                    </div>
                                    <div className="result-card sub-chart">
                                        <h3 className="card-title">Surya Kundali</h3>
                                        <div className="chart-wrapper-small">
                                            <NorthIndianChart houses={chartData.suryaHouses} />
                                        </div>
                                    </div>
                                </div>

                                {/* Dashas Section */}
                                <div className="result-card dasha-explorer-card">
                                    <div className="explorer-header">
                                        <h3 className="card-title">Dasha Timeline</h3>
                                        <div className="varga-tabs dasha-tabs">
                                            {['vimshottari', 'yogini', 'chara'].map(system => (
                                                <button
                                                    key={system}
                                                    onClick={() => {
                                                        setActiveDashaSystem(system);
                                                        setExpandedDasha(null);
                                                    }}
                                                    className={`varga-tab ${activeDashaSystem === system ? 'active' : ''}`}
                                                >
                                                    {system.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="dasha-timeline-grid">
                                        {chartData.dashas[activeDashaSystem].map((dasha, i) => (
                                            <div key={i} className="dasha-node">
                                                <div
                                                    className={`dasha-node-main ${expandedDasha === i ? 'expanded' : ''}`}
                                                    onClick={() => setExpandedDasha(expandedDasha === i ? null : i)}
                                                >
                                                    <div className="node-icon">{dasha.planet.substring(0, 1)}</div>
                                                    <div className="node-content">
                                                        <span className="node-planet">{dasha.planet}</span>
                                                        <span className="node-date">{new Date(dasha.start).getFullYear()} - {new Date(dasha.end).getFullYear()}</span>
                                                    </div>
                                                    {activeDashaSystem === 'vimshottari' && <span className="node-plus">{expandedDasha === i ? '−' : '+'}</span>}
                                                </div>

                                                {expandedDasha === i && dasha.sub && (
                                                    <div className="node-sub-list">
                                                        {dasha.sub.map((sub, si) => (
                                                            <div key={si} className="node-sub-item">
                                                                <span>{sub.planet}</span>
                                                                <small>{new Date(sub.start).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</small>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

const NorthIndianChart = ({ houses }) => {
    const getAbbr = (name) => {
        const map = {
            'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
            'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke'
        };
        return map[name] || name.substring(0, 2);
    };

    return (
        <svg viewBox="0 0 400 400" className="chart-svg">
            <defs>
                <filter id="goldGlow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <style>{`
                .chart-line { stroke: var(--primary); stroke-width: 2.5; fill: none; opacity: 0.8; }
                .chart-line-inner { stroke: var(--accent-gold); stroke-width: 0.8; fill: none; opacity: 0.3; }
                .house-num { fill: var(--accent-gold); font-size: 18px; font-weight: 900; filter: drop-shadow(0 0 5px var(--primary-glow)); }
                .planet-tag { fill: #fff; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; }
                .planet-deg-small { fill: var(--text-muted); font-size: 9px; font-weight: 600; }
            `}</style>

            <rect x="0" y="0" width="400" height="400" className="chart-line" />
            <line x1="0" y1="0" x2="400" y2="400" className="chart-line" />
            <line x1="400" y1="0" x2="0" y2="400" className="chart-line" />
            <line x1="200" y1="0" x2="0" y2="200" className="chart-line" />
            <line x1="0" y1="200" x2="200" y2="400" className="chart-line" />
            <line x1="200" y1="400" x2="400" y2="200" className="chart-line" />
            <line x1="400" y1="200" x2="200" y2="0" className="chart-line" />

            {houses.map((house, i) => {
                const houseNum = i + 1;
                const center = getHouseCenter(houseNum);
                const planets = house.planets || [];
                const planetCount = planets.length;

                const cols = planetCount > 3 ? 2 : 1;
                const rows = Math.ceil(planetCount / cols);
                const planetHeight = 22;
                const numberHeight = 24;
                const totalHeight = (rows * planetHeight) + numberHeight + 8;

                const isSideTriangle = [3, 5, 9, 11].includes(houseNum);
                const xBase = isSideTriangle ? (houseNum === 3 || houseNum === 5 ? center.x + 10 : center.x - 10) : center.x;

                return (
                    <g key={i}>
                        {planets.map((p, pi) => {
                            const colIndex = pi % cols;
                            const rowIndex = Math.floor(pi / cols);
                            const xOffset = cols > 1 ? (colIndex === 0 ? -22 : 22) : 0;
                            const y = center.y - (totalHeight / 2) + (rowIndex * planetHeight) + 14;

                            return (
                                <g key={pi}>
                                    <text x={xBase + xOffset} y={y} className="planet-tag" textAnchor="middle">
                                        {getAbbr(p.name)}
                                    </text>
                                    <text x={xBase + xOffset} y={y + 9} className="planet-deg-small" textAnchor="middle">
                                        {Math.floor(p.degree)}°
                                    </text>
                                </g>
                            );
                        })}

                        <text
                            x={xBase}
                            y={center.y + (totalHeight / 2) - 4}
                            className="house-num"
                            textAnchor="middle"
                        >
                            {house.rashi + 1}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

const getHouseCenter = (houseNum) => {
    const centers = {
        1: { x: 200, y: 100 },
        2: { x: 100, y: 40 },
        3: { x: 40, y: 100 },
        4: { x: 100, y: 200 },
        5: { x: 40, y: 300 },
        6: { x: 100, y: 360 },
        7: { x: 200, y: 300 },
        8: { x: 300, y: 360 },
        9: { x: 360, y: 300 },
        10: { x: 300, y: 200 },
        11: { x: 360, y: 100 },
        12: { x: 300, y: 40 }
    };
    return centers[houseNum];
};

export default Kundli;
