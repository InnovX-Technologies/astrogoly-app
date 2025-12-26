// KP (Krishnamurti Paddhati) System Calculations
// Based on Jaganath Hora logic

const NAKSHATRAS = [
    { name: 'Ashwini', lord: 'Ketu', start: 0, end: 13.333333 },
    { name: 'Bharani', lord: 'Venus', start: 13.333333, end: 26.666667 },
    { name: 'Krittika', lord: 'Sun', start: 26.666667, end: 40 },
    { name: 'Rohini', lord: 'Moon', start: 40, end: 53.333333 },
    { name: 'Mrigashira', lord: 'Mars', start: 53.333333, end: 66.666667 },
    { name: 'Ardra', lord: 'Rahu', start: 66.666667, end: 80 },
    { name: 'Punarvasu', lord: 'Jupiter', start: 80, end: 93.333333 },
    { name: 'Pushya', lord: 'Saturn', start: 93.333333, end: 106.666667 },
    { name: 'Ashlesha', lord: 'Mercury', start: 106.666667, end: 120 },
    { name: 'Magha', lord: 'Ketu', start: 120, end: 133.333333 },
    { name: 'Purva Phalguni', lord: 'Venus', start: 133.333333, end: 146.666667 },
    { name: 'Uttara Phalguni', lord: 'Sun', start: 146.666667, end: 160 },
    { name: 'Hasta', lord: 'Moon', start: 160, end: 173.333333 },
    { name: 'Chitra', lord: 'Mars', start: 173.333333, end: 186.666667 },
    { name: 'Swati', lord: 'Rahu', start: 186.666667, end: 200 },
    { name: 'Vishakha', lord: 'Jupiter', start: 200, end: 213.333333 },
    { name: 'Anuradha', lord: 'Saturn', start: 213.333333, end: 226.666667 },
    { name: 'Jyeshtha', lord: 'Mercury', start: 226.666667, end: 240 },
    { name: 'Mula', lord: 'Ketu', start: 240, end: 253.333333 },
    { name: 'Purva Ashadha', lord: 'Venus', start: 253.333333, end: 266.666667 },
    { name: 'Uttara Ashadha', lord: 'Sun', start: 266.666667, end: 280 },
    { name: 'Shravana', lord: 'Moon', start: 280, end: 293.333333 },
    { name: 'Dhanishta', lord: 'Mars', start: 293.333333, end: 306.666667 },
    { name: 'Shatabhisha', lord: 'Rahu', start: 306.666667, end: 320 },
    { name: 'Purva Bhadrapada', lord: 'Jupiter', start: 320, end: 333.333333 },
    { name: 'Uttara Bhadrapada', lord: 'Saturn', start: 333.333333, end: 346.666667 },
    { name: 'Revati', lord: 'Mercury', start: 346.666667, end: 360 }
];

const SUB_LORD_PROPORTIONS = {
    'Ketu': 7,
    'Venus': 20,
    'Sun': 6,
    'Moon': 10,
    'Mars': 7,
    'Rahu': 18,
    'Jupiter': 16,
    'Saturn': 19,
    'Mercury': 17
};

const ZODIAC_LORDS = [
    'Mars',     // Aries
    'Venus',    // Taurus
    'Mercury',  // Gemini
    'Moon',     // Cancer
    'Sun',      // Leo
    'Mercury',  // Virgo
    'Venus',    // Libra
    'Mars',     // Scorpio
    'Jupiter',  // Sagittarius
    'Saturn',   // Capricorn
    'Saturn',   // Aquarius
    'Jupiter'   // Pisces
];

const PLANET_ABBR = {
    'Sun': 'Su',
    'Moon': 'Mo',
    'Mars': 'Ma',
    'Mercury': 'Me',
    'Jupiter': 'Ju',
    'Venus': 'Ve',
    'Saturn': 'Sa',
    'Rahu': 'Ra',
    'Ketu': 'Ke'
};

// Get Nakshatra (Star) Lord
function getNakshatraLord(longitude) {
    for (const nakshatra of NAKSHATRAS) {
        if (longitude >= nakshatra.start && longitude < nakshatra.end) {
            return nakshatra.lord;
        }
    }
    return NAKSHATRAS[NAKSHATRAS.length - 1].lord;
}

// Get Sub Lord using KP Sub Division
function getSubLord(longitude) {
    // Find nakshatra
    let nakshatra = null;
    for (const nak of NAKSHATRAS) {
        if (longitude >= nak.start && longitude < nak.end) {
            nakshatra = nak;
            break;
        }
    }

    if (!nakshatra) return 'Ketu';

    // Calculate position within nakshatra
    const nakshatraSpan = 13.333333; // Each nakshatra is 13°20'
    const positionInNakshatra = longitude - nakshatra.start;

    // KP Sub division order (starting from nakshatra lord)
    const lords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const startIndex = lords.indexOf(nakshatra.lord);

    // Calculate cumulative proportions
    let cumulative = 0;
    const totalProportion = 120; // Sum of all proportions

    for (let i = 0; i < lords.length; i++) {
        const lordIndex = (startIndex + i) % lords.length;
        const lord = lords[lordIndex];
        const proportion = SUB_LORD_PROPORTIONS[lord];
        const subSpan = (proportion / totalProportion) * nakshatraSpan;

        if (positionInNakshatra >= cumulative && positionInNakshatra < cumulative + subSpan) {
            return lord;
        }

        cumulative += subSpan;
    }

    return nakshatra.lord;
}

// Calculate KP Cusps (Placidus system)
export function calculateKPCusps(lagnaLongitude) {
    const cusps = [];

    for (let i = 0; i < 12; i++) {
        const cuspLongitude = (lagnaLongitude + (i * 30)) % 360;
        const signIndex = Math.floor(cuspLongitude / 30);
        const degree = cuspLongitude % 30;

        const signLord = ZODIAC_LORDS[signIndex];
        const starLord = getNakshatraLord(cuspLongitude);
        const subLord = getSubLord(cuspLongitude);

        cusps.push({
            cusp: i + 1,
            degree: cuspLongitude.toFixed(2),
            sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][signIndex],
            signLord: PLANET_ABBR[signLord] || signLord,
            starLord: PLANET_ABBR[starLord] || starLord,
            subLord: PLANET_ABBR[subLord] || subLord
        });
    }

    return cusps;
}

// Calculate KP Planet Details
export function calculateKPPlanets(planets) {
    const kpPlanets = [];

    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto'];

    planetNames.forEach(name => {
        if (planets[name]) {
            const longitude = planets[name].longitude;
            const signIndex = Math.floor(longitude / 30);
            const cusp = Math.floor(longitude / 30) + 1;

            const signLord = ZODIAC_LORDS[signIndex];
            const starLord = getNakshatraLord(longitude);
            const subLord = getSubLord(longitude);

            kpPlanets.push({
                planet: name,
                cusp: cusp,
                sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][signIndex],
                signLord: PLANET_ABBR[signLord] || signLord,
                starLord: PLANET_ABBR[starLord] || starLord,
                subLord: PLANET_ABBR[subLord] || subLord
            });
        }
    });

    return kpPlanets;
}

// Calculate Ruling Planets (at time of query)
export function calculateRulingPlanets(lagnaLongitude, moonLongitude) {
    const lagnaSignIndex = Math.floor(lagnaLongitude / 30);
    const moonSignIndex = Math.floor(moonLongitude / 30);

    const lagnaSignLord = ZODIAC_LORDS[lagnaSignIndex];
    const lagnaStarLord = getNakshatraLord(lagnaLongitude);
    const lagnaSubLord = getSubLord(lagnaLongitude);

    const moonSignLord = ZODIAC_LORDS[moonSignIndex];
    const moonStarLord = getNakshatraLord(moonLongitude);

    // Day Lord (based on weekday)
    const dayLords = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const dayOfWeek = new Date().getDay();
    const dayLord = dayLords[dayOfWeek];

    return {
        ascendant: {
            signLord: lagnaSignLord,
            starLord: lagnaStarLord,
            subLord: lagnaSubLord
        },
        moon: {
            signLord: moonSignLord,
            starLord: moonStarLord
        },
        dayLord: dayLord
    };
}

// Calculate Bhav Chalit (House positions)
export function calculateBhavChalit(lagnaLongitude, planets) {
    const houses = [];

    for (let i = 0; i < 12; i++) {
        const houseMidpoint = (lagnaLongitude + (i * 30) + 15) % 360;
        const houseStart = (lagnaLongitude + (i * 30)) % 360;
        const houseEnd = (lagnaLongitude + ((i + 1) * 30)) % 360;

        const planetsInHouse = [];

        Object.entries(planets).forEach(([name, data]) => {
            const pLong = data.longitude;

            // Check if planet is in this house
            let inHouse = false;
            if (houseEnd > houseStart) {
                inHouse = pLong >= houseStart && pLong < houseEnd;
            } else {
                inHouse = pLong >= houseStart || pLong < houseEnd;
            }

            if (inHouse) {
                planetsInHouse.push({
                    name: PLANET_ABBR[name] || name,
                    degree: (pLong % 30).toFixed(2)
                });
            }
        });

        houses.push({
            house: i + 1,
            planets: planetsInHouse
        });
    }

    return houses;
}
