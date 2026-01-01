// North Indian Chart Component - Proper Diamond Layout
// North Indian Chart Component - Proper Diamond Layout
export const NorthIndianChart = ({ bhavChalit }) => {
    if (!bhavChalit || bhavChalit.length === 0) {
        return <div>No chart data available</div>;
    }

    // North Indian layout positions
    const getHousePosition = (houseIndex) => {
        // Optimized centers to maximize space for planets
        const positions = [
            { x: 200, y: 90, align: 'middle' },       // 1 - Top Center Diamond (moved down)
            { x: 90, y: 40, align: 'middle' },        // 2 - Top Left Triangle
            { x: 40, y: 90, align: 'middle' },        // 3 - Left Top Triangle
            { x: 100, y: 200, align: 'middle' },      // 4 - Left Diamond
            { x: 40, y: 310, align: 'middle' },       // 5 - Left Bottom Triangle
            { x: 90, y: 360, align: 'middle' },       // 6 - Bottom Left Triangle
            { x: 200, y: 310, align: 'middle' },      // 7 - Bottom Diamond (moved up)
            { x: 310, y: 360, align: 'middle' },      // 8 - Bottom Right Triangle
            { x: 360, y: 310, align: 'middle' },      // 9 - Right Bottom Triangle
            { x: 300, y: 200, align: 'middle' },      // 10 - Right Diamond
            { x: 360, y: 90, align: 'middle' },       // 11 - Right Top Triangle
            { x: 310, y: 40, align: 'middle' }        // 12 - Top Right Triangle
        ];

        // Coordinates for House Numbers - Pushed securely into corners
        const numPositions = [
            { x: 200, y: 155 }, // 1 - Bottom tip of top diamond
            { x: 45, y: 15 },   // 2 - Top left corner
            { x: 15, y: 45 },   // 3 - Top left side
            { x: 160, y: 200 }, // 4 - Right tip of left diamond
            { x: 15, y: 355 },  // 5 - Bottom left side
            { x: 45, y: 385 },  // 6 - Bottom left corner
            { x: 200, y: 245 }, // 7 - Top tip of bottom diamond
            { x: 355, y: 385 }, // 8 - Bottom right corner
            { x: 385, y: 355 }, // 9 - Bottom right side
            { x: 240, y: 200 }, // 10 - Left tip of right diamond
            { x: 385, y: 45 },  // 11 - Top right side
            { x: 355, y: 15 }   // 12 - Top right corner
        ];

        return { ...positions[houseIndex], numX: numPositions[houseIndex].x, numY: numPositions[houseIndex].y };
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
        'Pluto': '#455A64'     // Blue Grey Dark
    };

    return (
        <svg viewBox="0 0 400 400" className="bhav-chart-svg">
            <style>{`
                .bhav-chart-svg { width: 100%; height: 100%; font-family: 'Montserrat', sans-serif; }
                .chart-bg { fill: #ffffff; }
                .chart-lines { stroke: #FFC107; stroke-width: 1.5; fill: none; }
                .house-num { fill: #9E9E9E; font-weight: 700; font-size: 14px; opacity: 0.8; }
                .planet-text { font-size: 11px; font-weight: 700; }
            `}</style>

            {/* Background */}
            <rect x="0" y="0" width="400" height="400" className="chart-bg" />

            {/* Chart Lines */}
            <g className="chart-lines">
                <rect x="2" y="2" width="396" height="396" />
                <line x1="2" y1="2" x2="398" y2="398" />
                <line x1="398" y1="2" x2="2" y2="398" />
                <line x1="200" y1="2" x2="2" y2="200" />
                <line x1="2" y1="200" x2="200" y2="398" />
                <line x1="200" y1="398" x2="398" y2="200" />
                <line x1="398" y1="200" x2="200" y2="2" />
            </g>

            {/* Render houses */}
            {bhavChalit.map((house, i) => {
                const pos = getHousePosition(i);
                const planets = house.planets || [];
                const planetCount = planets.length;

                // Use 2 columns if more than 3 planets, or if it's a tight triangle (2,3,5,6,8,9,11,12) with > 2 planets
                const isTriangle = [1, 2, 4, 5, 7, 8, 10, 11].includes(i); // i is 0-indexed. 
                // Actual Triangle Indices : 1, 2, 4, 5, 7, 8, 10, 11 (House 2, 3, 5, 6, 8, 9, 11, 12)

                const isCrowded = planetCount > 3 || (planetCount > 2 && isTriangle);

                return (
                    <g key={i}>
                        {/* House Number */}
                        <text
                            x={pos.numX}
                            y={pos.numY}
                            className="house-num"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {i + 1}
                        </text>

                        {/* Planets */}
                        {planets.map((p, idx) => {
                            let xOff = 0;
                            // Tighter vertical spacing for clarity
                            let dy = 13;
                            let yOff = 0;

                            if (isCrowded) {
                                const col = idx % 2;
                                const row = Math.floor(idx / 2);
                                // Spread columns based on house shape? For now standard spread
                                xOff = col === 0 ? -16 : 16;
                                yOff = row * dy;
                            } else {
                                yOff = idx * dy;
                            }

                            // Calculate start Y to center the block of planets vertically
                            const rows = isCrowded ? Math.ceil(planetCount / 2) : planetCount;
                            const totalHeight = (rows * dy);
                            // Shift up by half height, plus a tiny offset to not hit center
                            const yStart = pos.y - (totalHeight / 2) + (dy / 2);

                            return (
                                <text
                                    key={idx}
                                    x={pos.x + xOff}
                                    y={yStart + yOff}
                                    className="planet-text"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={planetColors[p.name] || '#333'}
                                >
                                    {p.name.substring(0, 2)}
                                    {p.isRetrograde && <tspan fill="red" fontSize="9px" dy="-4">®</tspan>}
                                </text>
                            );
                        })}
                    </g>
                );
            })}
        </svg>
    );
};
