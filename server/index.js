import express from 'express';
import cors from 'cors';
import * as Astronomy from 'astronomy-engine';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

app.use(cors());
app.use(express.json());

const ZODIAC = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

app.get('/api/horoscope', async (req, res) => {
    try {
        const { sign, date, category } = req.query;
        if (!sign) return res.status(400).json({ error: 'Sign is required' });

        // 1. Calculate Real Planetary Positions (Astronomy Engine)
        const targetDate = date ? new Date(date) : new Date();
        const moonVec = Astronomy.GeoVector('Moon', targetDate, true);
        const sunVec = Astronomy.GeoVector('Sun', targetDate, true);
        const moonLong = Astronomy.Ecliptic(moonVec).elon;
        const sunLong = Astronomy.Ecliptic(sunVec).elon;

        const moonSignIndex = Math.floor(moonLong / 30);
        const sunSignIndex = Math.floor(sunLong / 30);
        const userSignIndex = ZODIAC.findIndex(z => z.toLowerCase() === sign.toLowerCase());

        if (userSignIndex === -1) return res.status(400).json({ error: 'Invalid Zodiac Sign' });

        // Real Transit Logic
        const moonHouse = (moonSignIndex - userSignIndex + 12) % 12 + 1;
        const moonSignName = ZODIAC[moonSignIndex];
        const sunSignName = ZODIAC[sunSignIndex];

        // 2. Try Generating with AI
        let aiData = null;
        if (model) {
            try {
                const prompt = `
                    Act as an expert Vedic Astrologer. Generate a daily horoscope for the following user:
                    - Sign: ${sign}
                    - Date: ${targetDate.toDateString()}
                    - Category: ${category || 'General'}
                    - Astronomical Context: Sun in ${sunSignName}, Moon in ${moonSignName} (House ${moonHouse}).

                    RETURN ONLY A VALID JSON OBJECT. Do not include markdown formatting like \`\`\`json.
                    Schema:
                    {
                        "prediction": "Concise, mystical, positive prediction (max 40 words) focusing on ${category || 'general life'}.",
                        "lucky_color": "A specific color name",
                        "lucky_numbers": "3 numbers comma separated",
                        "lucky_alphabets": "2 letters comma separated",
                        "cosmic_tip": "One short mystical sentence.",
                        "single_tip": "Short advice for singles.",
                        "couple_tip": "Short advice for couples.",
                        "lucky_score": "Integer between 60 and 100 based on the Moon house position"
                    }
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                aiData = JSON.parse(text);

            } catch (aiError) {
                console.error("AI Generation Failed:", aiError.message);
                // Fallback will trigger below if aiData is null
            }
        }

        // 3. Fallback to Deterministic Algorithm (if AI failed or no key)
        if (!aiData) {
            const houseForecasts = {
                1: { focus: "Self & Health", msg: "Heightened emotions and intuition. Prioritize yourself." },
                2: { focus: "Finances", msg: "Focus on resources. Plan finances but avoid impulse buys." },
                3: { focus: "Communication", msg: "Social energy is high. Great for short trips and chats." },
                4: { focus: "Home", msg: "Domestic peace is priority. Recharge at home." },
                5: { focus: "Romance", msg: "Creativity flows. Romance is highlighted." },
                6: { focus: "Wellness", msg: "Detail-oriented day. Focus on health routines." },
                7: { focus: "Partnerships", msg: "Relationships take center stage. Collaborate." },
                8: { focus: "Transformation", msg: "Deep emotions surface. Good for research." },
                9: { focus: "Wisdom", msg: "Seek higher knowledge or spiritual growth." },
                10: { focus: "Career", msg: "You are visible today. Put your best foot forward." },
                11: { focus: "Gains", msg: "Networking rewards you. Connect with friends." },
                12: { focus: "Solitude", msg: "Time for meditation and letting go." }
            };
            const info = houseForecasts[moonHouse] || { focus: "Balance", msg: "Seek balance." };

            const fallbackPrediction = `Moon in ${moonSignName} activates your ${moonHouse}${getOrdinal(moonHouse)} house of ${info.focus}. ${info.msg} ${generateCategoryAdvice(category)}`;

            aiData = {
                prediction: fallbackPrediction,
                lucky_color: "White",
                lucky_numbers: calculateDailyScore(userSignIndex, moonSignIndex, sunSignIndex).toString(),
                lucky_alphabets: "A, S",
                cosmic_tip: "Trust the timing of your life.",
                single_tip: "Love yourself first.",
                couple_tip: "Listen with your heart.",
                lucky_score: calculateDailyScore(userSignIndex, moonSignIndex, sunSignIndex)
            };
        }

        res.json({
            data: {
                horoscope_data: aiData.prediction,
                lucky_color: aiData.lucky_color,
                lucky_numbers: aiData.lucky_numbers,
                lucky_alphabets: aiData.lucky_alphabets,
                cosmic_tip: aiData.cosmic_tip,
                single_tip: aiData.single_tip,
                couple_tip: aiData.couple_tip,
                lucky_score: aiData.lucky_score,

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

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

function generateCategoryAdvice(cat) {
    const advice = {
        personal: " Trust your gut.", health: " Listen to your body.",
        profession: " Stay focused.", emotions: " Feel deeply.",
        travel: " Expect delays.", luck: " Fortune favors the bold."
    };
    return advice[cat] || "";
}

function calculateDailyScore(user, moon, sun) {
    const diff = (moon - user + 12) % 12;
    let base = 75;
    if ([0, 4, 8].includes(diff)) base += 15;
    if ([3, 6, 9].includes(diff)) base -= 10;
    return Math.min(Math.max(base, 40), 99);
}

app.listen(PORT, () => {
    console.log(`Astrology AI Server running on port ${PORT}`);
});
