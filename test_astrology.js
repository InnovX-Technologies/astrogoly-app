import * as Astronomy from 'astronomy-engine';
import { getAyanamsa, toSidereal, getRashiInfo } from './backend/utils/astrology.js';

try {
    console.log("Testing Astronomy functions...");
    const now = new Date();

    // Test MoonPhase
    if (typeof Astronomy.MoonPhase === 'function') {
        console.log("Astronomy.MoonPhase exists.");
        console.log("Phase: " + Astronomy.MoonPhase(now));
    } else {
        console.error("Astronomy.MoonPhase does NOT exist.");
    }

    // Test Utils
    console.log("Testing Utils...");
    const ayanamsa = getAyanamsa(now);
    console.log("Ayanamsa: " + ayanamsa);
    const sidereal = toSidereal(100, ayanamsa);
    console.log("Sidereal(100): " + sidereal);

    console.log("Test Complete.");
} catch (error) {
    console.error("Test Failed:", error);
}
