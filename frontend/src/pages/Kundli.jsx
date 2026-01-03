import React, { useState } from 'react';
import { Compass, Calendar, Clock, MapPin, Loader2, Info, User, Sparkles } from 'lucide-react';
import { ChartSkeleton } from '../components/LoadingSkeleton';
import { NorthIndianChart } from '../components/NorthIndianChart';
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
    const [activeTab, setActiveTab] = useState('basic');
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

            const response = await fetch('/api/birth-chart', {
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
            {!chartData ? (
                // Centered Form View
                <div className="kundli-form-container">
                    <header className="kundli-header-centered">
                        <h1>Personalized Vedic Kundli</h1>
                        <p>Comprehensive Shodashvarga Analysis with Precise Sidereal Calculations</p>
                    </header>

                    <div className="kundli-form-wrapper">
                        <form onSubmit={handleSubmit} className="kundli-form-centered">
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
                                    <label className="text-xs">Latitude</label>
                                    <input type="text" name="latitude" value={formData.latitude} onChange={handleInputChange} className="input-field" placeholder="26.42" />
                                </div>
                                <div className="form-group">
                                    <label className="text-xs">Longitude</label>
                                    <input type="text" name="longitude" value={formData.longitude} onChange={handleInputChange} className="input-field" placeholder="84.37" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-generate">
                                {loading ? <Loader2 className="spinner" /> : 'GENERATE KUNDLI'}
                            </button>

                            {error && <p className="error-text">{error}</p>}
                        </form>
                    </div>
                </div>
            ) : (
                // Full-Width Results View
                <div className="kundli-results-view">
                    {/* Tabbed Navigation */}
                    <div className="kundli-tabs-container">
                        <div className="kundli-tabs">
                            <button
                                className={`kundli-tab ${activeTab === 'basic' ? 'active' : ''}`}
                                onClick={() => setActiveTab('basic')}
                            >
                                Basic
                            </button>
                            <button
                                className={`kundli-tab ${activeTab === 'kundli' ? 'active' : ''}`}
                                onClick={() => setActiveTab('kundli')}
                            >
                                Kundli
                            </button>
                            <button
                                className={`kundli-tab ${activeTab === 'kp' ? 'active' : ''}`}
                                onClick={() => setActiveTab('kp')}
                            >
                                KP
                            </button>
                            <button
                                className={`kundli-tab ${activeTab === 'ashtakvarga' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ashtakvarga')}
                            >
                                Ashtakvarga
                            </button>

                            <button
                                className={`kundli-tab ${activeTab === 'dasha' ? 'active' : ''}`}
                                onClick={() => setActiveTab('dasha')}
                            >
                                Dasha
                            </button>
                            <button
                                className={`kundli-tab ${activeTab === 'report' ? 'active' : ''}`}
                                onClick={() => setActiveTab('report')}
                            >
                                Free Report
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="results-content">
                        {/* Basic Tab */}
                        {activeTab === 'basic' && chartData.basicDetails && chartData.avakhada && (
                            <div className="details-comparison-card">
                                <div className="details-comparison-grid">
                                    {/* Basic Details */}
                                    <div className="details-column">
                                        <h3 className="section-title">Basic Details</h3>
                                        <div className="details-list">
                                            <div className="detail-row"><span>Name</span> <strong>{chartData.basicDetails.name}</strong></div>
                                            <div className="detail-row"><span>Date</span> <strong>{chartData.basicDetails.date}</strong></div>
                                            <div className="detail-row"><span>Time</span> <strong>{chartData.basicDetails.time}</strong></div>
                                            <div className="detail-row"><span>Place</span> <strong>{chartData.basicDetails.place}</strong></div>
                                            <div className="detail-row"><span>Latitude</span> <strong>{chartData.basicDetails.latitude}</strong></div>
                                            <div className="detail-row"><span>Longitude</span> <strong>{chartData.basicDetails.longitude}</strong></div>
                                            <div className="detail-row"><span>Timezone</span> <strong>{chartData.basicDetails.timezone}</strong></div>
                                            <div className="detail-row"><span>Sunrise</span> <strong>{chartData.basicDetails.sunrise}</strong></div>
                                            <div className="detail-row"><span>Sunset</span> <strong>{chartData.basicDetails.sunset}</strong></div>
                                            <div className="detail-row"><span>Ayanamsha</span> <strong>{chartData.basicDetails.ayanamsha}</strong></div>
                                        </div>

                                        {/* Panchang Details within Basic Details */}
                                        <h3 className="section-title">Panchang Details</h3>
                                        <div className="details-list">
                                            <div className="detail-row"><span>Tithi</span> <strong>{chartData.panchang?.tithi || chartData.avakhada?.tithi || 'N/A'}</strong></div>
                                            <div className="detail-row"><span>Karan</span> <strong>{chartData.panchang?.karana || chartData.avakhada?.karan || 'N/A'}</strong></div>
                                            <div className="detail-row"><span>Yog</span> <strong>{chartData.panchang?.yoga || chartData.avakhada?.yog || 'N/A'}</strong></div>
                                            <div className="detail-row"><span>Nakshatra</span> <strong>{chartData.panchang?.nakshatra || chartData.avakhada?.nakshatraCharan?.split('-')[0] || 'N/A'}</strong></div>
                                        </div>
                                    </div>

                                    {/* Avakhada Details */}
                                    <div className="details-column">
                                        <h3 className="section-title">Avakhada Details</h3>
                                        <div className="details-list">
                                            <div className="detail-row"><span>Varna</span> <strong>{chartData.avakhada.varna}</strong></div>
                                            <div className="detail-row"><span>Vashya</span> <strong>{chartData.avakhada.vashya}</strong></div>
                                            <div className="detail-row"><span>Yoni</span> <strong>{chartData.avakhada.yoni}</strong></div>
                                            <div className="detail-row"><span>Gan</span> <strong>{chartData.avakhada.gan}</strong></div>
                                            <div className="detail-row"><span>Nadi</span> <strong>{chartData.avakhada.nadi}</strong></div>
                                            <div className="detail-row"><span>Sign</span> <strong>{chartData.avakhada.sign}</strong></div>
                                            <div className="detail-row"><span>Sign Lord</span> <strong>{chartData.avakhada.signLord}</strong></div>
                                            <div className="detail-row"><span>Nakshatra-Charan</span> <strong>{chartData.avakhada.nakshatraCharan}</strong></div>
                                            <div className="detail-row"><span>Yog</span> <strong>{chartData.avakhada.yog}</strong></div>
                                            <div className="detail-row"><span>Karan</span> <strong>{chartData.avakhada.karan}</strong></div>
                                            <div className="detail-row"><span>Tithi</span> <strong>{chartData.avakhada.tithi}</strong></div>
                                            <div className="detail-row"><span>Yunja</span> <strong>{chartData.avakhada.yunja}</strong></div>
                                            <div className="detail-row"><span>Tatva</span> <strong>{chartData.avakhada.tatva}</strong></div>
                                            <div className="detail-row"><span>Name Alphabet</span> <strong>{chartData.avakhada.nameAlphabet}</strong></div>
                                            <div className="detail-row"><span>Paya</span> <strong>{chartData.avakhada.paya}</strong></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Kundli Tab - Varga Explorer */}
                        {activeTab === 'kundli' && chartData.vargas && (
                            <div className="kundli-tab-content">
                                <div className="varga-explorer-panel">
                                    <div className="explorer-header">
                                        <div className="varga-title-group">
                                            <h2 className="varga-title">Varga Explorer</h2>
                                            <p className="varga-subtitle">Divisional Chart Analysis</p>
                                        </div>
                                        <div className="varga-tabs">
                                            {Object.keys(chartData.vargas).map(key => (
                                                <button
                                                    key={key}
                                                    onClick={() => setActiveVarga(key)}
                                                    className={`varga-tab ${activeVarga === key ? 'active' : ''}`}
                                                >
                                                    {key.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="varga-tabs secondary-chart-tabs" style={{ marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem' }}>
                                            {[
                                                { label: 'Lagna', key: 'd1' },
                                                { label: 'Navamansa', key: 'd9' },
                                                { label: 'Chalit', key: 'chalit' },
                                                { label: 'Chandra', key: 'chandra' },
                                                { label: 'Surya', key: 'surya' }
                                            ].map(item => (
                                                <button
                                                    key={item.key}
                                                    onClick={() => setActiveVarga(item.key)}
                                                    className={`varga-tab ${activeVarga === item.key ? 'active' : ''}`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="explorer-content">
                                        {/* Dynamic Chart Rendering */}
                                        <div className="main-chart-card">
                                            <h3 className="chart-name-display">
                                                {activeVarga === 'chalit' ? 'Bhav Chalit Chart' :
                                                    activeVarga === 'chandra' ? 'Chandra Kundali (Moon Chart)' :
                                                        activeVarga === 'surya' ? 'Surya Kundali (Sun Chart)' :
                                                            (chartData.vargas[activeVarga]?.name || 'Chart')}
                                            </h3>
                                            <div className="chart-wrapper">
                                                {activeVarga === 'chalit' ? (
                                                    <NorthIndianChart bhavChalit={chartData.kp?.bhavChalit || []} />
                                                ) : activeVarga === 'chandra' ? (
                                                    <VargaChart houses={chartData.chandraHouses || []} showDegree={true} />
                                                ) : activeVarga === 'surya' ? (
                                                    <VargaChart houses={chartData.suryaHouses || []} showDegree={true} />
                                                ) : chartData.vargas[activeVarga] ? (
                                                    <VargaChart
                                                        houses={chartData.vargas[activeVarga].houses}
                                                        showDegree={['d1'].includes(activeVarga)}
                                                    />
                                                ) : (
                                                    <div>Chart data unavailable</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="varga-details">
                                            <div className="result-card info-card">
                                                <h3 className="card-title"><Calendar size={18} /> Panchang</h3>
                                                <div className="panchang-grid">
                                                    <div className="detail-item"><span>Vara</span> <strong>{chartData.panchang?.vara || 'N/A'}</strong></div>
                                                    <div className="detail-item"><span>Tithi</span> <strong>{chartData.panchang?.tithi || 'N/A'}</strong></div>
                                                    <div className="detail-item"><span>Nakshatra</span> <strong>{chartData.panchang?.nakshatra || 'N/A'}</strong></div>
                                                    <div className="detail-item"><span>Yoga</span> <strong>{chartData.panchang?.yoga || 'N/A'}</strong></div>
                                                    <div className="detail-item"><span>Karana</span> <strong>{chartData.panchang?.karana || 'N/A'}</strong></div>
                                                    <div className="detail-item"><span>Lagna</span> <strong>{chartData.lagna?.name || 'N/A'}</strong></div>
                                                </div>
                                            </div>

                                            <div className="result-card planetary-card">
                                                <h3 className="card-title"><Compass size={18} /> Planets</h3>
                                                <div className="planets-grid-mini">
                                                    {chartData.planets && Object.entries(chartData.planets).map(([name, data]) => (
                                                        <div key={name} className="planet-mini-row">
                                                            <span className="p-short-name">{name.substring(0, 2)}</span>
                                                            <div className="p-mini-data">
                                                                <span className="p-mini-sign">{data.rashi?.name || 'N/A'}</span>
                                                                <span className="p-mini-deg">{data.rashi?.formatted || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div> {/* End explorer-content */}

                                    {/* Detailed Planetary Table - Full Width */}
                                    <div className="planetary-details-section" style={{ padding: '0 2rem 2rem 2rem' }}>


                                        <div className="result-card planetary-details-table-card">
                                            <h3 className="card-title"><Compass size={18} /> Planetary Status & Details</h3>
                                            <div className="table-responsive">
                                                <table className="kp-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Planet</th>
                                                            <th>Sign</th>
                                                            <th>Sign Lord</th>
                                                            <th>Nakshatra</th>
                                                            <th>Naksh Lord</th>
                                                            <th>Degree</th>
                                                            <th>Retro(R)</th>
                                                            <th>Combust</th>
                                                            <th>Avastha</th>
                                                            <th>House</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {chartData.planets && Object.entries(chartData.planets).map(([name, data]) => {
                                                            const lagnaIdx = chartData.lagna?.index || 0;
                                                            const planetIdx = data.rashi.index;
                                                            const house = (planetIdx - lagnaIdx + 12) % 12 + 1;
                                                            return (
                                                                <tr key={name}>
                                                                    <td><strong>{name}</strong></td>
                                                                    <td>{data.rashi.name}</td>
                                                                    <td>{data.signLord || '-'}</td>
                                                                    <td>{data.nakshatra.name}</td>
                                                                    <td>{data.nakLord || '-'}</td>
                                                                    <td>{data.rashi.formatted}</td>
                                                                    <td style={{ color: data.isRetrograde ? 'red' : 'inherit' }}>{data.isRetrograde ? 'Retro' : 'Direct'}</td>
                                                                    <td style={{ color: data.isCombust ? 'red' : 'inherit' }}>{data.isCombust ? 'Yes' : 'No'}</td>
                                                                    <td>{data.avastha || '-'}</td>
                                                                    <td>{house}</td>
                                                                    <td>{data.status || '-'}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* KP Tab - Krishnamurti Paddhati System */}
                        {activeTab === 'kp' && chartData.kp && (
                            <div className="kp-system-container">
                                <div className="kp-layout">
                                    {/* Left Side - Bhav Chalit Chart */}
                                    <div className="bhav-chalit-section">
                                        <h3 className="kp-section-title">Bhav Chalit Chart</h3>
                                        <div className="bhav-chalit-chart">
                                            <NorthIndianChart bhavChalit={chartData.kp.bhavChalit} />
                                        </div>

                                        {/* Ruling Planets */}
                                        <div className="ruling-planets-section">
                                            <h4 className="kp-subsection-title">Ruling Planets</h4>
                                            <table className="kp-table ruling-table">
                                                <thead>
                                                    <tr>
                                                        <th>--</th>
                                                        <th>Sign Lord</th>
                                                        <th>Star Lord</th>
                                                        <th>Sub Lord</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Mo</td>
                                                        <td>{chartData.kp.rulingPlanets.moon.signLord}</td>
                                                        <td>{chartData.kp.rulingPlanets.moon.starLord}</td>
                                                        <td>--</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Asc</td>
                                                        <td>{chartData.kp.rulingPlanets.ascendant.signLord}</td>
                                                        <td>{chartData.kp.rulingPlanets.ascendant.starLord}</td>
                                                        <td>{chartData.kp.rulingPlanets.ascendant.subLord}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="3"><strong>Day Lord</strong></td>
                                                        <td>{chartData.kp.rulingPlanets.dayLord}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Right Side - Tables */}
                                    <div className="kp-tables-section">
                                        {/* Planets Table */}
                                        <div className="kp-table-container">
                                            <h4 className="kp-subsection-title">Planets</h4>
                                            <table className="kp-table">
                                                <thead>
                                                    <tr>
                                                        <th>Planets</th>
                                                        <th>Cusp</th>
                                                        <th>Sign</th>
                                                        <th>Sign Lord</th>
                                                        <th>Star Lord</th>
                                                        <th>Sub Lord</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {chartData.kp.planets.map((planet, i) => (
                                                        <tr key={i}>
                                                            <td><strong>{planet.planet}</strong></td>
                                                            <td>{planet.cusp}</td>
                                                            <td>{planet.sign}</td>
                                                            <td>{planet.signLord}</td>
                                                            <td>{planet.starLord}</td>
                                                            <td>{planet.subLord}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Cusps Table */}
                                        <div className="kp-table-container">
                                            <h4 className="kp-subsection-title">Cusps</h4>
                                            <table className="kp-table">
                                                <thead>
                                                    <tr>
                                                        <th>Cusp</th>
                                                        <th>Degree</th>
                                                        <th>Sign</th>
                                                        <th>Sign Lord</th>
                                                        <th>Star Lord</th>
                                                        <th>Sub Lord</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {chartData.kp.cusps.map((cusp, i) => (
                                                        <tr key={i}>
                                                            <td><strong>{cusp.cusp}</strong></td>
                                                            <td>{cusp.degree}</td>
                                                            <td>{cusp.sign}</td>
                                                            <td>{cusp.signLord}</td>
                                                            <td>{cusp.starLord}</td>
                                                            <td>{cusp.subLord}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ashtakvarga Tab - Placeholder */}
                        {activeTab === 'ashtakvarga' && <div className="placeholder-content">Ashtakvarga tab content coming soon...</div>}



                        {/* Dasha Tab - Dasha Timeline */}
                        {activeTab === 'dasha' && chartData.dashas && (
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
                                    {chartData.dashas[activeDashaSystem]?.map((dasha, i) => (
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
                        )}

                        {/* Free Report Tab - AI Summary */}
                        {activeTab === 'report' && chartData.aiSummary && (
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
                    </div>
                </div>
            )
            }
        </div >
    );
};

const VargaChart = ({ houses, showDegree = false }) => {
    const getAbbr = (name) => {
        const map = {
            'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
            'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
            'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl', 'Ascendant': 'Asc'
        };
        return map[name] || name.substring(0, 2);
    };

    const planetColors = {
        'Sun': '#D84315',      // Deep Orange
        'Moon': '#1A237E',     // Deep Indigo
        'Mars': '#B71C1C',     // Red
        'Mercury': '#1B5E20',  // Dark Green
        'Jupiter': '#F57F17',  // Dark Gold
        'Venus': '#880E4F',    // Deep Pink
        'Saturn': '#263238',   // Blue Grey
        'Rahu': '#212121',     // Almost Black
        'Ketu': '#3E2723',     // Dark Brown
        'Uranus': '#0097A7',   // Cyan Dark
        'Neptune': '#1565C0',  // Blue Dark
        'Pluto': '#455A64',     // Blue Grey Dark
        'Ascendant': '#000000' // Black
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
                .chart-line { stroke: var(--primary); stroke-width: 1.5; fill: none; opacity: 0.9; }
                .house-num { fill: var(--text-muted); font-size: 14px; font-weight: 700; opacity: 0.7; }
                .planet-tag { font-size: 11px; font-weight: 700; }
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
                const pos = getHouseCenter(i + 1);
                const planets = house.planets || [];
                const planetCount = planets.length;

                // Identify triangles to force early crowding logic
                // Indices are 1-based here (house numbers)
                // Triangles: 2, 3, 5, 6, 8, 9, 11, 12
                const isTriangle = [2, 3, 5, 6, 8, 9, 11, 12].includes(i + 1);
                const isCrowded = planetCount > 3 || (planetCount > 2 && isTriangle);

                return (
                    <g key={i}>
                        {planets.map((p, pi) => {
                            let xOff = 0;
                            let dy = 13;
                            let yOff = 0;

                            if (isCrowded) {
                                const col = pi % 2;
                                const row = Math.floor(pi / 2);
                                xOff = col === 0 ? -16 : 16;
                                yOff = row * dy;
                            } else {
                                yOff = pi * dy;
                            }

                            const rows = isCrowded ? Math.ceil(planetCount / 2) : planetCount;
                            const totalHeight = (rows * dy);
                            const y = pos.y - (totalHeight / 2) + yOff + (dy / 2);

                            const pColor = planetColors[p.name] || '#333';

                            return (
                                <g key={pi}>
                                    <text
                                        x={pos.x + xOff}
                                        y={y}
                                        className="planet-tag"
                                        textAnchor="middle"
                                        style={{ fill: pColor }}
                                    >
                                        {getAbbr(p.name)}
                                        {p.isRetrograde && <tspan fill="red" fontSize="9px" dy="-4">®</tspan>}
                                        {showDegree && <tspan x={pos.x + xOff} dy="12" className="planet-deg-small">{p.degree ? `${Math.floor(p.degree)}°` : ''}</tspan>}
                                    </text>
                                </g>
                            );
                        })}

                        {/* House Number Position in Corner */}
                        <text
                            x={pos.numX}
                            y={pos.numY}
                            className="house-num"
                            textAnchor="middle"
                            dominantBaseline="middle"
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
    // Centers for planets
    const centers = {
        1: { x: 200, y: 90 },       // Top Diamond
        2: { x: 90, y: 40 },        // Top Left Triangle
        3: { x: 40, y: 90 },        // Left Top Triangle
        4: { x: 100, y: 200 },      // Left Diamond
        5: { x: 40, y: 310 },       // Left Bottom Triangle
        6: { x: 90, y: 360 },       // Bottom Left Triangle
        7: { x: 200, y: 310 },      // Bottom Diamond
        8: { x: 310, y: 360 },      // Bottom Right Triangle
        9: { x: 360, y: 310 },      // Right Bottom Triangle
        10: { x: 300, y: 200 },     // Right Diamond
        11: { x: 360, y: 90 },      // Right Top Triangle
        12: { x: 310, y: 40 }       // Top Right Triangle
    };

    // Safe House Number Positions (Corners)
    const numPos = {
        1: { x: 200, y: 155 },
        2: { x: 45, y: 15 },
        3: { x: 15, y: 45 },
        4: { x: 160, y: 200 },
        5: { x: 15, y: 355 },
        6: { x: 45, y: 385 },
        7: { x: 200, y: 245 },
        8: { x: 355, y: 385 },
        9: { x: 385, y: 355 },
        10: { x: 240, y: 200 },
        11: { x: 385, y: 45 },
        12: { x: 355, y: 15 }
    };

    return { ...centers[houseNum], numX: numPos[houseNum].x, numY: numPos[houseNum].y };
};

export default Kundli;

