import * as Astronomy from 'astronomy-engine';
import { getAyanamsa, toSidereal } from './utils/astrology.js';

try {
    console.log("Testing Astronomy functions...");
    const now = new Date();

    // Test MoonPhase
    if (typeof Astronomy.MoonPhase === 'function') {
        console.log("Astronomy.MoonPhase exists.");
        console.log("Phase: " + Astronomy.MoonPhase(now));
    } else {
        console.log("Astronomy.MoonPhase does NOT exist.");
        // Check if we can calculate it manually
        const moonVec = Astronomy.GeoVector('Moon', now, true);
        const sunVec = Astronomy.GeoVector('Sun', now, true);
        const moonLong = Astronomy.Ecliptic(moonVec).elon;
        const sunLong = Astronomy.Ecliptic(sunVec).elon;
        console.log("Manual Phase: " + ((moonLong - sunLong + 360) % 360));
    }

    console.log("Test Complete.");
} catch (error) {
    console.error("Test Failed:", error);
}
