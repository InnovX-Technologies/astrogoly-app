import React, { useState } from 'react';
import axios from 'axios';
import './Kundli.css';

const Kundli = () => {
    const [activeTab, setActiveTab] = useState('charts'); // basic, charts, planets
    const [chartType, setChartType] = useState('Lagna'); // Lagna, Navamsa
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        location: 'New Delhi', // Default
        lat: 28.6139,
        lon: 77.2090,
        tzone: 5.5
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    // Simple city database for demo
    const cities = {
        "New Delhi": { lat: 28.6139, lon: 77.2090 },
        "Mumbai": { lat: 19.0760, lon: 72.8777 },
        "Chennai": { lat: 13.0827, lon: 80.2707 },
        "Kolkata": { lat: 22.5726, lon: 88.3639 },
        "Bangalore": { lat: 12.9716, lon: 77.5946 },
        "London": { lat: 51.5074, lon: -0.1278 },
        "New York": { lat: 40.7128, lon: -74.0060 },
        "Sydney": { lat: -33.8688, lon: 151.2093 }
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        if (cities[city]) {
            setFormData({
                ...formData,
                location: city,
                lat: cities[city].lat,
                lon: cities[city].lon
            });
        } else {
            setFormData({ ...formData, location: city });
        }
    };

    const fetchKundliData = async () => {
        const apiKey = import.meta.env.VITE_ASTRO_API_KEY;

        // Date parsing
        const [year, month, day] = formData.date.split('-').map(Number);
        const [hours, minutes] = formData.time.split(':').map(Number);

        const payload = {
            year,
            month,
            date: day,
            hours,
            minutes,
            seconds: 0,
            latitude: formData.lat,
            longitude: formData.lon,
            timezone: formData.tzone,
            config: {
                observation_point: "topocentric",
                ayanamsha: "lahiri"
            }
        };

        try {
            const response = await axios.post('https://json.freeastrologyapi.com/planets', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            });

            console.log("DEBUG: Raw API Response:", JSON.stringify(response.data, null, 2));

            if (response.data && (response.data.output || response.data)) {
                const rawData = response.data.output || response.data;
                console.log("DEBUG: Data to Process:", JSON.stringify(rawData, null, 2));
                return processApiResponse(rawData);
            } else {
                throw new Error("Invalid API Response");
            }
        } catch (err) {
            console.error("DEBUG: API Error Full Object:", JSON.stringify(err, null, 2));
            console.error("API Error:", err);
            setError("Failed to fetch horoscope data. Please check your API key.");
            return null;
        }
    };

    const getNavamsaSign = (longitude) => {
        // D9 Formula: (Longitude * 9) % 360 / 30 + 1
        return Math.floor(((longitude * 9) % 360) / 30) + 1;
    };

    const processApiResponse = (data) => {
        const housePlanets = {
            1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
            7: [], 8: [], 9: [], 10: [], 11: [], 12: []
        };
        const navamsaPlanets = {
            1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
            7: [], 8: [], 9: [], 10: [], 11: [], 12: []
        };
        const planetSigns = {};

        const getSign = (obj) => {
            if (!obj) return null;
            return parseInt(obj.sign) || parseInt(obj.current_sign) || parseInt(obj.sign_id) || parseInt(obj.rashi);
        };

        const getNakshatra = (longitude) => {
            const nakshatras = [
                "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
                "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
                "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
            ];
            const index = Math.floor(longitude / 13.333333333333333);
            return nakshatras[index % 27];
        };

        let planetMap = data;

        if (Array.isArray(data)) {
            const foundMap = data.find(item => {
                if (typeof item !== 'object' || item === null) return false;
                const keys = Object.keys(item);
                const values = Object.values(item);
                const hasPlanetKeys = keys.some(k => ['Sun', 'Moon', 'Mars', 'Jupiter', 'Venus', 'Saturn'].includes(k));
                const hasSignData = values.some(v => v && typeof v === 'object' && (v.current_sign || v.sign || v.sign_id));
                return hasPlanetKeys || hasSignData;
            });

            if (foundMap) planetMap = foundMap;
            else {
                const isListOfPlanets = data.every(item => item && (item.current_sign || item.sign || item.sign_id));
                if (isListOfPlanets) {
                    planetMap = {};
                    data.forEach((p, i) => {
                        const key = p.name || p.id || i;
                        planetMap[key] = p;
                    });
                }
            }
        }

        // 1. Find Ascendant
        let ascSign = 1;
        let ascLongitude = 0;
        let ascObj = planetMap['Ascendant'] || planetMap['Lagna'] || planetMap['ascendant'];

        if (!ascObj) {
            ascObj = Object.values(planetMap).find(v => v.name === 'Ascendant' || v.name === 'Lagna' || v.id === 12);
        }

        if (ascObj) {
            ascSign = getSign(ascObj) || 1;
            ascLongitude = parseFloat(ascObj.fullDegree || ascObj.normDegree || ascObj.degree || 0);
            // Ensure absolute degree for Navamsa if relative
            if (ascLongitude < 30.5 && ascSign > 1) {
                ascLongitude = (ascSign - 1) * 30 + ascLongitude;
            }
        }

        const ascNavamsaSign = getNavamsaSign(ascLongitude);
        if (!navamsaPlanets[1].includes("Asc")) navamsaPlanets[1].push("Asc");

        // 2. Map planets
        Object.entries(planetMap).forEach(([key, value]) => {
            if (typeof value !== 'object' || value === null) return;

            let name = value.name || key;
            const sign = getSign(value);

            if (sign) {
                if (name !== 'Ascendant' && name !== 'Lagna') {
                    if (!isNaN(parseInt(name)) && !value.name) {
                        // skip
                    } else {
                        const longitude = parseFloat(value.fullDegree || value.normDegree || value.degree || 0);
                        const isAbsolute = longitude > 30.5;

                        let displayDegree = longitude;
                        if (isAbsolute) {
                            displayDegree = longitude % 30;
                        }

                        let nakshatra = value.nakshatra;
                        if ((!nakshatra || nakshatra === '-') && isAbsolute) {
                            nakshatra = getNakshatra(longitude);
                        }

                        // Calculate Navamsa Sign
                        let absLongitude = longitude;
                        if (!isAbsolute) {
                            absLongitude = (sign - 1) * 30 + longitude;
                        }
                        const navamsaSign = getNavamsaSign(absLongitude);

                        planetSigns[name] = {
                            sign: sign,
                            navamsaSign: navamsaSign,
                            degree: displayDegree,
                            nakshatra: nakshatra || '-',
                            ...value
                        };

                        let houseNum = (sign - ascSign + 12) % 12 + 1;
                        const shortName = name.substr(0, 3);
                        if (housePlanets[houseNum]) {
                            housePlanets[houseNum].push(shortName);
                        }

                        let navHouseNum = (navamsaSign - ascNavamsaSign + 12) % 12 + 1;
                        if (navamsaPlanets[navHouseNum]) {
                            navamsaPlanets[navHouseNum].push(shortName);
                        }
                    }
                }
            }
        });

        if (!housePlanets[1].includes("Asc")) {
            housePlanets[1].push("Asc");
        }

        // 3. Dosha Analysis
        let mangalDosha = { present: false, factors: [] };
        // Check from Lagna
        const marsSign = planetSigns['Mars']?.sign;
        const moonSign = planetSigns['Moon']?.sign;

        if (marsSign && ascSign) {
            const marsHouseLagna = (marsSign - ascSign + 12) % 12 + 1;
            if ([1, 2, 4, 7, 8, 12].includes(marsHouseLagna)) {
                mangalDosha.present = true;
                mangalDosha.factors.push(`Mars in House ${marsHouseLagna} from Lagna`);
            }
        }
        // Check from Moon (Chandra Lagna)
        if (marsSign && moonSign) {
            const marsHouseMoon = (marsSign - moonSign + 12) % 12 + 1;
            if ([1, 2, 4, 7, 8, 12].includes(marsHouseMoon)) {
                mangalDosha.present = true;
                mangalDosha.factors.push(`Mars in House ${marsHouseMoon} from Moon`);
            }
        }

        return { housePlanets, navamsaPlanets, ascSign, ascNavamsaSign, planetSigns, dosha: { mangal: mangalDosha } };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const data = await fetchKundliData();
        setLoading(false);
        if (data) {
            setChartData(data);
            setSubmitted(true);
        }
    };

    const reset = () => {
        setSubmitted(false);
        setChartData(null);
        setActiveTab('charts');
    };

    // UI Helpers
    const getMoonSign = () => {
        if (!chartData || !chartData.planetSigns['Moon']) return "-";
        return getRashiName(chartData.planetSigns['Moon'].sign);
    };

    const getBirthNakshatra = () => {
        if (!chartData || !chartData.planetSigns['Moon']) return "-";
        return chartData.planetSigns['Moon'].nakshatra;
    };

    return (
        <div className="container kundli-page">
            <div className="kundli-header">
                <h1>Free Kundli Generation</h1>
                <p>Enter your birth details to generate your Vedic Birth Chart (Real-time Calculation).</p>
            </div>

            {!submitted ? (
                <div className="glass-panel form-container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Contacting the cosmos...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="kundli-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Birth Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Birth Time</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Place of Birth (Select nearest major city)</label>
                                <select
                                    className="glass-input"
                                    value={formData.location}
                                    onChange={handleCityChange}
                                >
                                    {Object.keys(cities).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="btn-primary w-100">Generate Kundli</button>
                        </form>
                    )}
                </div>
            ) : (
                <div className="result-container">
                    <div className="result-header glass-panel">
                        <h2>Birth Chart for {formData.name}</h2>
                        <div className="result-details">
                            <span>{formData.date}</span> • <span>{formData.time}</span> • <span>{formData.location}</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="kundli-tabs">
                        {['Basic', 'Charts', 'Planets', 'Doshas'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Basic Tab */}
                    {activeTab === 'basic' && (
                        <div className="basic-details glass-panel fade-in">
                            <h3>Basic Details</h3>
                            <div className="detail-row"><span>Name:</span> <strong>{formData.name}</strong></div>
                            <div className="detail-row"><span>Date:</span> <strong>{formData.date}</strong></div>
                            <div className="detail-row"><span>Time:</span> <strong>{formData.time}</strong></div>
                            <div className="detail-row"><span>Place:</span> <strong>{formData.location}</strong></div>
                            <hr className="divider" />
                            <h3>Avakahada Chakra</h3>
                            <div className="detail-row"><span>Moon Sign (Rashi):</span> <strong>{getMoonSign()}</strong></div>
                            <div className="detail-row"><span>Birth Nakshatra:</span> <strong>{getBirthNakshatra()}</strong></div>
                        </div>
                    )}

                    {/* Charts Tab */}
                    {activeTab === 'charts' && (
                        <div className="chart-section fade-in">
                            <div className="chart-toggles">
                                <button className={`toggle-btn ${chartType === 'Lagna' ? 'active' : ''}`} onClick={() => setChartType('Lagna')}>Lagna Chart</button>
                                <button className={`toggle-btn ${chartType === 'Navamsa' ? 'active' : ''}`} onClick={() => setChartType('Navamsa')}>Navamsa (D9)</button>
                            </div>
                            <div className="chart-wrapper glass-panel">
                                {chartType === 'Lagna' ? (
                                    <NorthIndianChart housePlanets={chartData.housePlanets} ascSign={chartData.ascSign} />
                                ) : (
                                    <NorthIndianChart housePlanets={chartData.navamsaPlanets} ascSign={chartData.ascNavamsaSign} />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Planets Tab */}
                    {activeTab === 'planets' && (
                        <div className="predictions glass-panel fade-in">
                            <h3>Planetary Positions</h3>
                            <div className="planet-grid">
                                <div className="planet-row header">
                                    <span>Planet</span>
                                    <span>Rashi</span>
                                    <span>Degree</span>
                                    <span>Nakshatra</span>
                                </div>
                                {Object.entries(chartData.planetSigns).map(([planet, data]) => (
                                    <div key={planet} className="planet-row">
                                        <span>{planet}</span>
                                        <span>{getRashiName(data.sign)}</span>
                                        <span>{data.degree ? (typeof data.degree === 'number' ? data.degree.toFixed(2) : data.degree) + '°' : '-'}</span>
                                        <span>{data.nakshatra}</span>
                                    </div>
                                ))}
                                <div className="planet-row">
                                    <span>Ascendant</span>
                                    <span>{getRashiName(chartData.ascSign)}</span>
                                    <span>-</span>
                                    <span>-</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Doshas Tab */}
                    {activeTab === 'doshas' && (
                        <div className="dosha-section glass-panel fade-in">
                            <h3>Mangal Dosha Analysis</h3>
                            {chartData.dosha && chartData.dosha.mangal.present ? (
                                <div className="dosha-result negative">
                                    <p className="status-text">Mangal Dosha Present</p>
                                    <p className="desc-text">Mars is placed in a position that causes Mangalik Dosha.</p>
                                    <ul className="factors-list">
                                        {chartData.dosha.mangal.factors.map((f, i) => <li key={i}>{f}</li>)}
                                    </ul>
                                </div>
                            ) : (
                                <div className="dosha-result positive">
                                    <p className="status-text">No Mangal Dosha</p>
                                    <p className="desc-text">Mars is well placed in your chart regarding Mangal Dosha rules.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <button onClick={reset} className="btn-outline mt-4">Create New</button>
                </div>
            )}
        </div>
    );
};

const getRashiName = (num) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[num - 1] || "Unknown";
};

// North Indian Chart Visualization
const NorthIndianChart = ({ housePlanets, ascSign }) => {
    return (
        <svg viewBox="0 0 400 400" className="chart-svg">
            {/* Outer Border */}
            <rect x="2" y="2" width="396" height="396" fill="transparent" stroke="#ffd700" strokeWidth="2" />

            {/* Criss-Cross Lines for North Indian Style */}
            <line x1="0" y1="0" x2="400" y2="400" stroke="#ffd700" strokeWidth="1" />
            <line x1="400" y1="0" x2="0" y2="400" stroke="#ffd700" strokeWidth="1" />

            {/* Diamond inner lines */}
            <line x1="200" y1="0" x2="0" y2="200" stroke="#ffd700" strokeWidth="1" />
            <line x1="0" y1="200" x2="200" y2="400" stroke="#ffd700" strokeWidth="1" />
            <line x1="200" y1="400" x2="400" y2="200" stroke="#ffd700" strokeWidth="1" />
            <line x1="400" y1="200" x2="200" y2="0" stroke="#ffd700" strokeWidth="1" />

            {/* House Numbers (Rashi numbers) placed in corners of houses */}
            {/* House 1 - Top Center */}
            <text x="200" y="120" fill="#a0a0b0" fontSize="10" textAnchor="middle">{ascSign}</text>
            <ChartText x="200" y="80" planets={housePlanets[1]} />

            {/* House 2 - Top Left */}
            <text x="100" y="20" fill="#a0a0b0" fontSize="10" textAnchor="middle">{((ascSign) % 12) + 1}</text>
            <ChartText x="100" y="45" planets={housePlanets[2]} />

            {/* House 3 - Top Left Corner */}
            <text x="20" y="20" fill="#a0a0b0" fontSize="10" textAnchor="middle">{((ascSign + 1) % 12) + 1}</text>
            <ChartText x="40" y="80" planets={housePlanets[3]} />

            {/* House 4 - Right Center Diamond (Wait, looking at diagram) */}
            {/* Let's stick to standard layout coordinates */}
            <ChartText x="100" y="160" planets={housePlanets[4]} /> {/* House 4 - Mid Left */}

            <ChartText x="40" y="260" planets={housePlanets[5]} />
            <ChartText x="100" y="320" planets={housePlanets[6]} />

            <ChartText x="200" y="260" planets={housePlanets[7]} /> {/* House 7 - Bottom Center */}

            <ChartText x="300" y="320" planets={housePlanets[8]} />
            <ChartText x="360" y="260" planets={housePlanets[9]} />

            <ChartText x="300" y="160" planets={housePlanets[10]} /> {/* House 10 - Mid Right */}

            <ChartText x="360" y="80" planets={housePlanets[11]} />
            <ChartText x="300" y="45" planets={housePlanets[12]} />
        </svg>
    );
};

const ChartText = ({ x, y, planets }) => (
    <g transform={`translate(${x}, ${y})`}>
        {planets && planets.map((p, i) => (
            <text key={p} x="0" y={i * 14} fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">
                {p}
            </text>
        ))}
    </g>
);

export default Kundli;
