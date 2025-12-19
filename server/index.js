import express from 'express';
import cors from 'cors';
import * as Astronomy from 'astronomy-engine';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import {
    getPlanetaryPositions,
    calculateLagna,
    getAyanamsa,
    calculateDasha,
    calculateVimshottari,
    calculateYogini,
    calculateChara,
    getRashiInfo,
    getNavamsaRashi,
    getVargaRashi,
    calculatePanchang,
    calculateMatchmaking
} from './utils/astrology.js';

dotenv.config();

const app = express();
const PORT = 3001;

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

app.use(cors());
app.use(express.json());

const ZODIAC = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const vargaConfig = [
    { key: 'd1', division: 1, name: 'Rashi (D1)' },
    { key: 'd2', division: 2, name: 'Hora (D2)' },
    { key: 'd3', division: 3, name: 'Drekkana (D3)' },
    { key: 'd4', division: 4, name: 'Chaturthamsa (D4)' },
    { key: 'd7', division: 7, name: 'Saptamsa (D7)' },
    { key: 'd9', division: 9, name: 'Navamsa (D9)' },
    { key: 'd10', division: 10, name: 'Dashamsa (D10)' },
    { key: 'd12', division: 12, name: 'Dwadasamsa (D12)' },
    { key: 'd16', division: 16, name: 'Shodashamsa (D16)' },
    { key: 'd20', division: 20, name: 'Vimshamsa (D20)' },
    { key: 'd24', division: 24, name: 'Chaturvimshamsa (D24)' },
    { key: 'd27', division: 27, name: 'Bhamsa (D27)' },
    { key: 'd30', division: 30, name: 'Trimsamsa (D30)' },
    { key: 'd40', division: 40, name: 'Khavedamsa (D40)' },
    { key: 'd45', division: 45, name: 'Akshavedamsa (D45)' },
    { key: 'd60', division: 60, name: 'Shashtyamsa (D60)' }
];

app.post('/api/birth-chart', async (req, res) => {
    try {
        const { date, time, latitude, longitude, name } = req.body;

        if (!date || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const birthDateTime = new Date(`${date}T${time || '12:00:00'}`);

        if (isNaN(birthDateTime.getTime())) {
            return res.status(400).json({ error: 'Invalid birth date or time format. Please use YYYY-MM-DD and HH:mm.' });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: 'Invalid coordinates provided. Latitude and Longitude must be numbers.' });
        }

        const ayanamsa = getAyanamsa(birthDateTime);
        const planets = getPlanetaryPositions(birthDateTime);
        const lagnaLong = calculateLagna(birthDateTime, lat, lon);
        const lagnaInfo = getRashiInfo(lagnaLong);

        const dashas = {
            vimshottari: calculateVimshottari(planets.Moon.longitude, birthDateTime),
            yogini: calculateYogini(planets.Moon.longitude, birthDateTime),
            chara: calculateChara(birthDateTime)
        };

        const vargas = {};
        vargaConfig.forEach(v => {
            const vargaLagnaIndex = getVargaRashi(lagnaLong, v.division);
            vargas[v.key] = {
                name: v.name,
                houses: calculateHouses(vargaLagnaIndex, planets, v.division)
            };
        });

        const chart = {
            metadata: {
                name,
                date: birthDateTime.toISOString(),
                location: { lat, lon },
                ayanamsa: ayanamsa.toFixed(4)
            },
            lagna: lagnaInfo,
            planets,
            dashas,
            panchang: calculatePanchang(birthDateTime, planets.Sun.longitude, planets.Moon.longitude),
            vargas,
            chandraHouses: calculateHouses(planets.Moon.rashi.index, planets, 1),
            suryaHouses: calculateHouses(planets.Sun.rashi.index, planets, 1)
        };

        // Add AI Interpretation if available
        if (model) {
            try {
                const prompt = `
                    Analyze this Vedic Birth Chart:
                    - Lagna: ${lagnaInfo.name} at ${Math.floor(lagnaLong % 30)} degrees
                    - Moon Sign: ${planets.Moon.rashi.name}
                    - Current Mahadasha: ${dashas.vimshottari[0]?.planet}
                    
                    Provide a concise 3-paragraph life interpretation:
                    1. Personality and Core Nature.
                    2. Career and Wealth prospects.
                    3. Spiritual path and major life advice.
                    
                    Keep it mystical yet practical.
                `;
                const aiResult = await model.generateContent(prompt);
                chart.aiSummary = aiResult.response.text();
            } catch (aiErr) {
                console.warn("Chart AI Interpretation failed:", aiErr.message);
            }
        }

        res.json(chart);

    } catch (err) {
        console.error("Chart Calculation Error:", err);
        res.status(500).json({ error: "Failed to calculate birth chart" });
    }
});

function calculateHouses(lagnaRashiIndex, planets, division = 1) {
    const houses = Array.from({ length: 12 }, (_, i) => ({
        house: i + 1,
        rashi: (lagnaRashiIndex + i) % 12,
        rashiName: ZODIAC[(lagnaRashiIndex + i) % 12],
        planets: []
    }));

    Object.entries(planets).forEach(([name, data]) => {
        const rashiIndex = getVargaRashi(data.longitude, division);
        const houseIndex = (rashiIndex - lagnaRashiIndex + 12) % 12;

        if (isNaN(houseIndex) || !houses[houseIndex]) return;

        houses[houseIndex].planets.push({
            name,
            degree: data.rashi.degree,
            formattedDegree: data.rashi.formatted
        });
    });

    return houses;
}

app.post('/api/matchmaking', async (req, res) => {
    try {
        const { boyDate, girlDate } = req.body;
        if (!boyDate || !girlDate) return res.status(400).json({ error: 'Missing birth dates' });

        const bDate = new Date(boyDate);
        const gDate = new Date(girlDate);

        // Get Moon longitudes for both
        const bMoon = Astronomy.Ecliptic(Astronomy.GeoVector('Moon', bDate, true)).elon;
        const gMoon = Astronomy.Ecliptic(Astronomy.GeoVector('Moon', gDate, true)).elon;

        const result = calculateMatchmaking(bMoon, gMoon);
        res.json(result);
    } catch (err) {
        console.error("Matchmaking Error:", err);
        res.status(500).json({ error: "Failed to calculate compatibility" });
    }
});

app.get('/api/horoscope', async (req, res) => {
    try {
        const { sign, date, category } = req.query;
        if (!sign) return res.status(400).json({ error: 'Sign is required' });

        const targetDate = date ? new Date(date) : new Date();
        const moonVec = Astronomy.GeoVector('Moon', targetDate, true);
        const sunVec = Astronomy.GeoVector('Sun', targetDate, true);
        const moonLong = Astronomy.Ecliptic(moonVec).elon;
        const sunLong = Astronomy.Ecliptic(sunVec).elon;

        const moonSignIndex = Math.floor(moonLong / 30);
        const sunSignIndex = Math.floor(sunLong / 30);
        const userSignIndex = ZODIAC.findIndex(z => z.toLowerCase() === sign.toLowerCase());

        if (userSignIndex === -1) return res.status(400).json({ error: 'Invalid Zodiac Sign' });

        const moonHouse = (moonSignIndex - userSignIndex + 12) % 12 + 1;
        const moonSignName = ZODIAC[moonSignIndex];
        const sunSignName = ZODIAC[sunSignIndex];

        let aiData = null;
        if (model) {
            try {
                const prompt = `
                    Act as an expert Vedic Astrologer. Generate a daily horoscope for the following user:
                    - Sign: ${sign}
                    - Date: ${targetDate.toDateString()}
                    - Category: ${category || 'General'}
                    - Astronomical Context: Sun in ${sunSignName}, Moon in ${moonSignName} (House ${moonHouse}).

                    RETURN ONLY A VALID JSON OBJECT. Do not include markdown formatting.
                    Schema:
                    {
                        "prediction": "string",
                        "lucky_color": "string",
                        "lucky_numbers": "string",
                        "lucky_alphabets": "string",
                        "cosmic_tip": "string",
                        "single_tip": "string",
                        "couple_tip": "string",
                        "lucky_score": number
                    }
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                aiData = JSON.parse(text);

            } catch (aiError) {
                console.error("AI Generation Failed:", aiError.message);
            }
        }

        if (!aiData) {
            aiData = {
                prediction: `Moon in ${moonSignName} activates your ${moonHouse} house. Focus on balance and intuition.`,
                lucky_color: "White",
                lucky_numbers: "7, 12, 21",
                lucky_alphabets: "A, S",
                cosmic_tip: "Trust the timing of your life.",
                single_tip: "Love yourself first.",
                couple_tip: "Listen with your heart.",
                lucky_score: 85
            };
        }

        res.json({
            data: {
                ...aiData,
                moon_sign: moonSignName,
                sun_sign: sunSignName,
                moon_house: moonHouse,
                source: model ? 'AI' : 'Algorithm'
            }
        });

    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: "Calculations failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Astrology Server running on port ${PORT}`);
});
