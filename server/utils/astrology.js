import * as Astronomy from 'astronomy-engine';

/**
 * Vedic Astrology Engine
 * Provides accurate Sidereal calculations using Astronomy Engine as base.
 */

const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

/**
 * Calculates the Lahiri Ayanamsa for a given date.
 * Based on the Chitra Paksha formula.
 */
export function getAyanamsa(date) {
    const time = Astronomy.MakeTime(date);
    // T is centuries from J2000.0 (January 1.5, 2000)
    // astronomy-engine's time.ut is days from J2000 in UT
    const T = time.ut / 36525.0;

    // Precise Lahiri Ayanamsa formula
    // Value at J2000: 23.85 degrees
    // Annual rate: approx 0.01397 degrees
    let ayanamsa = 23.85 + (1.396041 * T) + (0.000307 * T * T);

    // Adjusting for Chitra Paksha (offset)
    // Chitra is at 180 degrees in Sidereal
    // This is an approximation of the official Lahiri value.
    // For extreme precision, we'd need Nutation corrections, but this is within seconds.
    return ayanamsa;
}

/**
 * Converts Tropical Longitude to Sidereal Longitude using Lahiri Ayanamsa.
 */
export function toSidereal(tropicalLong, ayanamsa) {
    let sidereal = (tropicalLong - ayanamsa) % 360;
    if (sidereal < 0) sidereal += 360;
    return sidereal;
}

/**
 * Get Rashi (Sign) and Degree for a longitude.
 */
export function getRashiInfo(long) {
    const rashiIndex = Math.floor(long / 30);
    const degree = long % 30;
    return {
        index: rashiIndex,
        name: ZODIAC_SIGNS[rashiIndex],
        degree: degree,
        formatted: `${Math.floor(degree)}° ${Math.floor((degree % 1) * 60)}' ${Math.floor(((degree * 60) % 1) * 60)}"`
    };
}

/**
 * Get Nakshatra info for a longitude.
 */
export function getNakshatraInfo(long) {
    const nakLong = long % 360;
    const nakIndex = Math.floor(nakLong / (360 / 27));
    const pada = Math.floor((nakLong % (360 / 27)) / (360 / (27 * 4))) + 1;
    return {
        index: nakIndex,
        name: NAKSHATRAS[nakIndex],
        pada: pada
    };
}

/**
 * Calculate the Ascendant (Lagna) for a location and time.
 */
export function calculateLagna(date, lat, lon) {
    if (isNaN(lat) || isNaN(lon)) {
        throw new Error("Latitude and Longitude must be valid numbers");
    }
    const observer = new Astronomy.Observer(lat, lon, 0);
    const time = Astronomy.MakeTime(date);

    // Get Sidereal Time at the location
    // Sidereal Time in hours
    const lst = Astronomy.SiderealTime(time) + (lon / 15.0);
    const lstDeg = (lst * 15) % 360;

    // Calculate the Ecliptic Obliquity (eps) manually as it's not in the engine
    // T is centuries from J2000.0
    const T = time.ut / 36525.0;
    const eps = 23.4392911 - (0.01300416 * T) - (0.00000016 * T * T) + (0.000000503 * T * T * T);

    const epsRad = eps * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    const lstRad = lstDeg * Math.PI / 180;

    // Formula for Ascendant:
    // tan(Asc) = cos(LST) / (-sin(LST)*cos(eps) - tan(lat)*sin(eps))
    const numerator = Math.cos(lstRad);
    const denominator = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);

    let ascendant = Math.atan2(numerator, denominator) * 180 / Math.PI;
    if (ascendant < 0) ascendant += 360;

    // The formula above gives the tropical ascendant. 
    // We adjust by Ayanamsa for the Sidereal Lagna.
    const ayanamsa = getAyanamsa(date);
    return toSidereal(ascendant, ayanamsa);
}

/**
 * Get all planetary positions.
 */
export function getPlanetaryPositions(date) {
    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const ayanamsa = getAyanamsa(date);
    const positions = {};

    bodies.forEach(body => {
        // Position at T
        const vec1 = Astronomy.GeoVector(body, date, true);
        const tropicalLong1 = Astronomy.Ecliptic(vec1).elon;

        // Position at T + 1 hour (to check retrograde/velocity)
        const nextDate = new Date(date.getTime() + 60 * 60 * 1000);
        const vec2 = Astronomy.GeoVector(body, nextDate, true);
        const tropicalLong2 = Astronomy.Ecliptic(vec2).elon;

        let velocity = tropicalLong2 - tropicalLong1;
        if (velocity > 180) velocity -= 360;
        if (velocity < -180) velocity += 360;

        const siderealLong = toSidereal(tropicalLong1, ayanamsa);

        positions[body] = {
            longitude: siderealLong,
            rashi: getRashiInfo(siderealLong),
            nakshatra: getNakshatraInfo(siderealLong),
            isRetrograde: velocity < 0
        };
    });

    // Calculate Rahu (North Node)
    // Mean Rahu Calculation
    const time = Astronomy.MakeTime(date);
    const T = time.ut / 36525.0;
    let rahuTropical = 125.04452 - (1934.136261 * T) + (0.0020708 * T * T);
    rahuTropical = rahuTropical % 360;
    if (rahuTropical < 0) rahuTropical += 360;

    const rahuSidereal = toSidereal(rahuTropical, ayanamsa);
    const ketuSidereal = (rahuSidereal + 180) % 360;

    positions['Rahu'] = {
        longitude: rahuSidereal,
        rashi: getRashiInfo(rahuSidereal),
        nakshatra: getNakshatraInfo(rahuSidereal),
        isRetrograde: true // Rahu/Ketu are always retrograde in Mean calculation
    };

    positions['Ketu'] = {
        longitude: ketuSidereal,
        rashi: getRashiInfo(ketuSidereal),
        nakshatra: getNakshatraInfo(ketuSidereal),
        isRetrograde: true
    };

    return positions;
}

/**
 * Calculation for Shodashvargas (16 Divisional Charts)
 */

export function getVargaRashi(long, division) {
    const rashiIndex = Math.floor(long / 30);
    const degreeInRashi = long % 30;
    const part = Math.floor(degreeInRashi / (30 / division));
    const isOdd = rashiIndex % 2 === 0; // Aries=0 (Odd), Taurus=1 (Even)

    switch (division) {
        case 1: // Rashi
            return rashiIndex;

        case 2: // Hora
            // Odd signs: 1st half Sun (Leo=4), 2nd half Moon (Cancer=3)
            // Even signs: 1st half Moon (Cancer=3), 2nd half Sun (Leo=4)
            if (isOdd) return part === 0 ? 4 : 3;
            return part === 0 ? 3 : 4;

        case 3: // Drekkana
            // 1st part: Same sign
            // 2nd part: 5th from it
            // 3rd part: 9th from it
            return (rashiIndex + (part * 4)) % 12;

        case 4: // Chaturthamsa
            // Counted in sequences of 4 from the sign itself
            return (rashiIndex + (part * 3)) % 12;

        case 7: // Saptamsa
            // Odd signs: From sign itself
            // Even signs: From 7th sign
            const start7 = isOdd ? rashiIndex : (rashiIndex + 6) % 12;
            return (start7 + part) % 12;

        case 9: // Navamsa
            // Simplified cyclic logic works for D9
            return Math.floor(long / (30 / 9)) % 12;

        case 10: // Dashamsa
            // Odd signs: From sign itself
            // Even signs: From 9th sign
            const start10 = isOdd ? rashiIndex : (rashiIndex + 8) % 12;
            return (start10 + part) % 12;

        case 12: // Dwadasamsa
            // Start from the sign itself
            return (rashiIndex + part) % 12;

        case 16: // Shodashamsa
            // Moveable: Aries (0)
            // Fixed: Leo (4)
            // Dual: Sagittarius (8)
            const modality16 = rashiIndex % 3; // 0=Move, 1=Fixed, 2=Dual (Wait: Aries=0, Taurus=1, Gemini=2)
            const start16 = [0, 4, 8][modality16];
            return (start16 + part) % 12;

        case 20: // Vimshamsa
            // Moveable: Aries (0)
            // Fixed: Sagittarius (8)
            // Dual: Leo (4)
            const modality20 = rashiIndex % 3;
            const start20 = [0, 8, 4][modality20];
            return (start20 + part) % 12;

        case 24: // Chaturvimshamsa
            // Odd: Leo (4)
            // Even: Cancer (3)
            const start24 = isOdd ? 4 : 3;
            return (start24 + part) % 12;

        case 27: // Bhamsa (Saptavimshamsa)
            // Fire: Aries (0)
            // Earth: Capricorn (9)
            // Air: Libra (6)
            // Water: Cancer (3)
            const element27 = rashiIndex % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
            const start27 = [0, 9, 6, 3][element27];
            return (start27 + part) % 12;

        case 30: // Trimsamsa (Simplified for now - strictly 30 divisions cyclic)
            // Real Trimsamsa is complex segments. Many use cyclic as D30 proxy.
            // Following Parashara's odd/even sign degree rules:
            if (isOdd) {
                if (degreeInRashi < 5) return 0; // Aries
                if (degreeInRashi < 10) return 10; // Aquarius
                if (degreeInRashi < 18) return 8; // Sagittarius
                if (degreeInRashi < 25) return 2; // Gemini
                return 6; // Libra
            } else {
                if (degreeInRashi < 5) return 1; // Taurus
                if (degreeInRashi < 12) return 5; // Virgo
                if (degreeInRashi < 20) return 3; // Pisces
                if (degreeInRashi < 25) return 9; // Capricorn
                return 7; // Scorpio
            }

        case 40: // Khavedamsa
            // Odd: Aries (0)
            // Even: Libra (6)
            const start40 = isOdd ? 0 : 6;
            return (start40 + part) % 12;

        case 45: // Akshavedamsa
            // Moveable: Aries (0)
            // Fixed: Leo (4)
            // Dual: Sagittarius (8)
            const modality45 = rashiIndex % 3;
            const start45 = [0, 4, 8][modality45];
            return (start45 + part) % 12;

        case 60: // Shashtyamsa
            // Start from the sign itself
            return (rashiIndex + part) % 12;

        default:
            return rashiIndex;
    }
}

/**
 * Legacy compatibility
 */
export function getNavamsaRashi(siderealLong) {
    return getVargaRashi(siderealLong, 9);
}

/**
 * DASHAS SECTION
 */

const DASHA_ORDER = [
    { planet: 'Ketu', years: 7 },
    { planet: 'Venus', years: 20 },
    { planet: 'Sun', years: 6 },
    { planet: 'Moon', years: 10 },
    { planet: 'Mars', years: 7 },
    { planet: 'Rahu', years: 18 },
    { planet: 'Jupiter', years: 16 },
    { planet: 'Saturn', years: 19 },
    { planet: 'Mercury', years: 17 }
];

/**
 * Calculate Vimshottari Mahadasha and Antardasha
 */
export function calculateVimshottari(moonLong, birthDate) {
    if (isNaN(moonLong)) return [];

    const nakLength = 360 / 27;
    const absoluteNakLong = ((moonLong % 360) + 360) % 360;
    const nakIndex = Math.floor(absoluteNakLong / nakLength);
    const nakProgress = (absoluteNakLong % nakLength) / nakLength;

    const startIdx = nakIndex % 9;
    const firstPlanet = DASHA_ORDER[startIdx];
    const remainingYears = firstPlanet.years * (1 - nakProgress);

    const result = [];
    let dashaStart = new Date(birthDate);

    // Initial partial dasha
    const firstEndDate = new Date(dashaStart);
    firstEndDate.setFullYear(firstEndDate.getFullYear() + Math.floor(remainingYears));
    firstEndDate.setMonth(firstEndDate.getMonth() + Math.floor((remainingYears % 1) * 12));

    for (let i = 0; i < 9; i++) {
        const idx = (startIdx + i) % 9;
        const p = DASHA_ORDER[idx];
        const years = i === 0 ? remainingYears : p.years;

        const end = new Date(dashaStart);
        end.setFullYear(end.getFullYear() + Math.floor(years));
        end.setMonth(end.getMonth() + Math.floor((years % 1) * 12));

        // Sub-periods (Antardasha)
        const subs = [];
        let subStart = new Date(dashaStart);
        // Antardashas always start with the Mahadasha planet itself
        for (let j = 0; j < 9; j++) {
            const subIdx = (idx + j) % 9;
            const subP = DASHA_ORDER[subIdx];
            // Antardasha length = (M-years * A-years) / 120
            const subYears = (p.years * subP.years) / 120;
            const subEnd = new Date(subStart);
            subEnd.setFullYear(subEnd.getFullYear() + Math.floor(subYears));
            subEnd.setMonth(subEnd.getMonth() + Math.floor((subYears % 1) * 12));

            subs.push({
                planet: subP.planet,
                start: new Date(subStart),
                end: new Date(subEnd)
            });
            subStart = new Date(subEnd);
        }

        result.push({
            planet: p.planet,
            start: new Date(dashaStart),
            end: new Date(end),
            sub: subs
        });
        dashaStart = new Date(end);
    }

    return result;
}

/**
 * Yogini Dasha (36 Year Cycle)
 */
export function calculateYogini(moonLong, birthDate) {
    const yoginis = [
        { name: 'Mangala', years: 1 }, { name: 'Pingala', years: 2 },
        { name: 'Dhanya', years: 3 }, { name: 'Bhramari', years: 4 },
        { name: 'Bhadrika', years: 5 }, { name: 'Ulka', years: 6 },
        { name: 'Siddha', years: 7 }, { name: 'Sankata', years: 8 }
    ];

    const nakIndex = Math.floor(moonLong / (360 / 27)); // 0-26
    // Formula: (Nakshatra Index + 3) / 8. Remainder gives the Yogini.
    // Ashwini (Index 0) + 3 = 3. 3 % 8 = 3 (Bhramari). 
    // We adjust to 0-indexed yoginis.
    const startIdx = (nakIndex + 3) % 8;

    const dashas = [];
    let start = new Date(birthDate);

    // Calculate for 2 cycles (72 years)
    for (let i = 0; i < 16; i++) {
        const y = yoginis[(startIdx + i) % 8];
        const end = new Date(start);
        end.setFullYear(end.getFullYear() + y.years);

        dashas.push({
            planet: y.name,
            start: new Date(start),
            end: end
        });
        start = new Date(end);
    }
    return dashas;
}

/**
 * Simplified Jaimini Chara Dasha (Sign based)
 */
export function calculateChara(birthDate) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const dashas = [];
    let start = new Date(birthDate);

    // Simplified: Each sign gets 7-12 years based on its lord's position.
    // Here we use a fixed 9-year average for proxy display as Jaimini logic is deep.
    for (let i = 0; i < 12; i++) {
        const end = new Date(start);
        end.setFullYear(end.getFullYear() + 9);
        dashas.push({
            planet: signs[i],
            start: new Date(start),
            end: end
        });
        start = new Date(end);
    }
    return dashas;
}

// For backward compatibility
export function calculateDasha(moonLong, birthDate) {
    return calculateVimshottari(moonLong, birthDate);
}

const YOGAS = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
    'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
    'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

const KARANAS = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Nagava', 'Kintughna'
];

/**
 * Calculate Panchang details.
 */
export function calculatePanchang(date, sunLong, moonLong) {
    // 1. Vara (Day)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const vara = days[date.getDay()];

    // 2. Tithi
    let diff = (moonLong - sunLong + 360) % 360;
    const tithiIndex = Math.floor(diff / 12);
    const tithiName = tithiIndex < 15 ? `Shukla ${tithiIndex + 1}` : `Krishna ${tithiIndex - 14}`;

    // 3. Nakshatra
    const nakLong = moonLong % 360;
    const nakTable = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
        'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    const nakIndex = Math.floor(nakLong / (360 / 27));
    const nakName = nakTable[nakIndex];

    // 4. Yoga
    const yogaLong = (sunLong + moonLong) % 360;
    const yogaIndex = Math.floor(yogaLong / (360 / 27));
    const yogaName = YOGAS[yogaIndex];

    // 5. Karana
    const karanaIndexFull = Math.floor(diff / 6);
    let karanaName = '';
    if (karanaIndexFull === 0) karanaName = 'Kintughna';
    else if (karanaIndexFull >= 57) karanaName = KARANAS[karanaIndexFull - 51 + 7]; // shakuni etc
    else {
        karanaName = KARANAS[(karanaIndexFull - 1) % 7];
    }

    return {
        vara,
        tithi: tithiName,
        nakshatra: nakName,
        yoga: yogaName,
        karana: karanaName
    };
}

/**
 * ASHTA KOOTA MATCHMAKING (Simplified)
 */
export function calculateMatchmaking(boyMoonLong, girlMoonLong) {
    const nakLength = 360 / 27;
    const boyNakIdx = Math.floor(boyMoonLong / nakLength) % 27;
    const girlNakIdx = Math.floor(girlMoonLong / nakLength) % 27;
    const boyRashiIdx = Math.floor(boyMoonLong / 30) % 12;
    const girlRashiIdx = Math.floor(girlMoonLong / 30) % 12;

    let points = 0;
    const details = [];

    // 1. Varna (1 Point)
    const getVarna = (r) => [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3][r]; // Pseudo varna
    if (getVarna(boyRashiIdx) >= getVarna(girlRashiIdx)) {
        points += 1;
        details.push({ name: 'Varna', score: 1, max: 1 });
    } else {
        details.push({ name: 'Varna', score: 0, max: 1 });
    }

    // 2. Vasya (2 Points)
    if (boyRashiIdx === girlRashiIdx) {
        points += 2;
        details.push({ name: 'Vasya', score: 2, max: 2 });
    } else {
        details.push({ name: 'Vasya', score: 1, max: 2 });
    }

    // 3. Tara (3 Points)
    const tara = ((girlNakIdx - boyNakIdx + 27) % 9) % 3;
    const taraScore = tara === 0 ? 3 : 1.5;
    points += taraScore;
    details.push({ name: 'Tara', score: taraScore, max: 3 });

    // 4. Yoni (4 Points)
    const yoniScore = (boyNakIdx % 14 === girlNakIdx % 14) ? 4 : 2;
    points += yoniScore;
    details.push({ name: 'Yoni', score: yoniScore, max: 4 });

    // 5. Maitri (5 Points)
    const maitriScore = (boyRashiIdx % 12 === girlRashiIdx % 12) ? 5 : 3;
    points += maitriScore;
    details.push({ name: 'Maitri', score: maitriScore, max: 5 });

    // 6. Gana (6 Points)
    const ganaScore = (boyNakIdx % 3 === girlNakIdx % 3) ? 6 : 3;
    points += ganaScore;
    details.push({ name: 'Gana', score: ganaScore, max: 6 });

    // 7. Bhakoot (7 Points)
    const dist = (girlRashiIdx - boyRashiIdx + 12) % 12;
    const bhakootScore = [0, 7, 0, 0, 7, 0, 7][dist % 7] || 0;
    points += bhakootScore;
    details.push({ name: 'Bhakoot', score: bhakootScore, max: 7 });

    // 8. Nadi (8 Points)
    const nadiScore = (boyNakIdx % 3 !== girlNakIdx % 3) ? 8 : 0;
    points += nadiScore;
    details.push({ name: 'Nadi', score: nadiScore, max: 8 });

    return {
        totalScore: points,
        maxScore: 36,
        details,
        verdict: points >= 18 ? (points >= 25 ? "Highly Compatible" : "Moderately Compatible") : "Low Compatibility"
    };
}
