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

                                {/* Varga Selector */}
                                <div className="varga-explorer-panel">
                                    <div className="explorer-header">
                                        <h2 className="varga-title">Varga Explorer</h2>
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
                                                <div className="result-card main-chart-card">
                                                    <h3 className="card-title">{chartData.vargas[activeVarga].name}</h3>
                                                    <div className="chart-wrapper">
                                                        <NorthIndianChart houses={chartData.vargas[activeVarga].houses} />
                                                    </div>
                                                </div>

                                                <div className="varga-details">
                                                    <div className="result-card info-card">
                                                        <h3 className="card-title">Detailed Panchang</h3>
                                                        <div className="panchang-mini">
                                                            <div className="detail-row"><span>Vara (Day)</span> <span>{chartData.panchang.vara}</span></div>
                                                            <div className="detail-row"><span>Tithi</span> <span>{chartData.panchang.tithi}</span></div>
                                                            <div className="detail-row"><span>Nakshatra</span> <span>{chartData.panchang.nakshatra}</span></div>
                                                            <div className="detail-row"><span>Yoga</span> <span>{chartData.panchang.yoga}</span></div>
                                                            <div className="detail-row"><span>Karana</span> <span>{chartData.panchang.karana}</span></div>
                                                            <div className="detail-row"><span>Lagna</span> <span>{chartData.lagna.name} ({Math.floor(chartData.lagna.degree)}°)</span></div>
                                                            <div className="detail-row"><span>Ayanamsa</span> <span>{chartData.metadata.ayanamsa}° (Lahiri)</span></div>
                                                        </div>
                                                    </div>

                                                    <div className="result-card planetary-card">
                                                        <h3 className="card-title">Planetary Positions</h3>
                                                        <div className="planets-scroll-mini">
                                                            {Object.entries(chartData.planets).map(([name, data]) => (
                                                                <div key={name} className="planet-row-detailed">
                                                                    <div className="p-header">
                                                                        <span className="p-name">{name} {data.isRetrograde ? <span className="retro-tag">(R)</span> : ''}</span>
                                                                        <span className="p-sign-small">{data.rashi.name}</span>
                                                                    </div>
                                                                    <div className="p-sub-details">
                                                                        <span className="p-deg-val">{data.rashi.formatted}</span>
                                                                        <span className="p-nak-val">{data.nakshatra.name} - {data.nakshatra.pada} Pada</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="empty-state">
                                                <p>Varga data not found. Please try generating the chart again.</p>
                                            </div>
                                        )}
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
                                        <h3 className="card-title">Chronological Life Periods (Dashas)</h3>
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
                                            <div key={i} className="dasha-group">
                                                <div
                                                    className={`dasha-item-main ${expandedDasha === i ? 'expanded' : ''}`}
                                                    onClick={() => setExpandedDasha(expandedDasha === i ? null : i)}
                                                >
                                                    <div className="dasha-info">
                                                        <span className="d-planet">{dasha.planet}</span>
                                                        <span className="d-dates">
                                                            {new Date(dasha.start).toLocaleDateString()} - {new Date(dasha.end).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {activeDashaSystem === 'vimshottari' && <span className="expand-icon">{expandedDasha === i ? '−' : '+'}</span>}
                                                </div>

                                                {/* Antardashas (Sub-periods) */}
                                                {expandedDasha === i && dasha.sub && (
                                                    <div className="antardasha-list">
                                                        {dasha.sub.map((sub, si) => (
                                                            <div key={si} className="sub-period-row">
                                                                <span className="sub-p-name">{sub.planet}</span>
                                                                <span className="sub-p-dates">
                                                                    {new Date(sub.start).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} to {new Date(sub.end).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                                                </span>
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
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <style>{`
                .chart-line { stroke: rgba(212, 175, 55, 0.4); stroke-width: 1.5; fill: none; }
                .house-num { fill: #f6e05e; font-size: 16px; font-weight: 800; filter: url(#glow); }
                .planet-tag { fill: #ffffff; font-size: 11px; font-weight: 600; }
                .planet-deg-small { fill: rgba(255,255,255,0.6); font-size: 9px; }
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
                const planets = house.planets;
                const planetCount = planets.length;

                // Wrapping Logic:
                // If more than 3 planets, we use 2 columns
                const cols = planetCount > 3 ? 2 : 1;
                const rows = Math.ceil(planetCount / cols);

                const planetHeight = 18;
                const numberHeight = 22;
                const totalHeight = (rows * planetHeight) + numberHeight + 5;

                // Exception for very narrow triangles at corners
                const isSideTriangle = [3, 5, 9, 11].includes(houseNum);
                const xBase = isSideTriangle ? (houseNum === 3 || houseNum === 5 ? center.x + 8 : center.x - 8) : center.x;

                return (
                    <g key={i}>
                        {planets.map((p, pi) => {
                            const colIndex = pi % cols;
                            const rowIndex = Math.floor(pi / cols);

                            // Horizontal offset if multi-column
                            const xOffset = cols > 1 ? (colIndex === 0 ? -18 : 18) : 0;
                            const y = center.y - (totalHeight / 2) + (rowIndex * planetHeight) + 12;

                            return (
                                <g key={pi}>
                                    <text x={xBase + xOffset} y={y} className="planet-tag" textAnchor="middle">
                                        {getAbbr(p.name)}
                                    </text>
                                    <text x={xBase + xOffset} y={y + 8} className="planet-deg-small" textAnchor="middle">
                                        {Math.floor(p.degree)}°
                                    </text>
                                </g>
                            );
                        })}

                        {/* House Number (at the bottom of the cluster) */}
                        <text
                            x={xBase}
                            y={center.y + (totalHeight / 2) - 3}
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
