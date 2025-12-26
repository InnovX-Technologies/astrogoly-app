// North Indian Chart Component - Proper Diamond Layout
export const NorthIndianChart = ({ bhavChalit }) => {
    if (!bhavChalit || bhavChalit.length === 0) {
        return <div>No chart data available</div>;
    }

    // North Indian layout positions (Counter-clockwise from Top)
    // House 1: Top Diamond
    // House 2: Top-Left Upper Triangle
    // House 3: Top-Left Lower Triangle
    // House 4: Left Diamond
    // ...etc
    const getHousePosition = (houseIndex) => {
        const positions = [
            { x: 200, y: 80, align: 'middle' },       // 1 - Top Center (Lagna)
            { x: 100, y: 40, align: 'middle' },       // 2 - Top Left (Upper)
            { x: 40, y: 100, align: 'middle' },       // 3 - Top Left (Lower)
            { x: 100, y: 200, align: 'middle' },      // 4 - Left Center
            { x: 40, y: 300, align: 'middle' },       // 5 - Bottom Left (Upper)
            { x: 100, y: 360, align: 'middle' },      // 6 - Bottom Left (Lower)
            { x: 200, y: 320, align: 'middle' },      // 7 - Bottom Center
            { x: 300, y: 360, align: 'middle' },      // 8 - Bottom Right (Lower)
            { x: 360, y: 300, align: 'middle' },      // 9 - Bottom Right (Upper)
            { x: 300, y: 200, align: 'middle' },      // 10 - Right Center
            { x: 360, y: 100, align: 'middle' },      // 11 - Top Right (Lower)
            { x: 300, y: 40, align: 'middle' }        // 12 - Top Right (Upper)
        ];

        // Coordinates for House Numbers (Rashi numbers typically placed in corners)
        const numPositions = [
            { x: 200, y: 140 }, // 1 - Bottom tip of top diamond
            { x: 60, y: 20 },   // 2 - Top left corner
            { x: 20, y: 60 },   // 3 - Top left side
            { x: 140, y: 200 }, // 4 - Right tip of left diamond
            { x: 20, y: 340 },  // 5 - Bottom left side
            { x: 60, y: 380 },  // 6 - Bottom left corner
            { x: 200, y: 260 }, // 7 - Top tip of bottom diamond
            { x: 340, y: 380 }, // 8 - Bottom right corner
            { x: 380, y: 340 }, // 9 - Bottom right side
            { x: 260, y: 200 }, // 10 - Left tip of right diamond
            { x: 380, y: 60 },  // 11 - Top right side
            { x: 340, y: 20 }   // 12 - Top right corner
        ];

        return { ...positions[houseIndex], numX: numPositions[houseIndex].x, numY: numPositions[houseIndex].y };
    };

    return (
        <svg viewBox="0 0 400 400" className="bhav-chart-svg">
            <style>{`
                .bhav-chart-svg { width: 100%; height: 100%; font-family: 'Segoe UI', sans-serif; }
                .chart-bg { fill: #FFFBE6; }
                .chart-lines { stroke: #666; stroke-width: 1; fill: none; }
                .house-num { fill: #999; font-size: 10px; }
                .planet-text { font-size: 11px; font-weight: 600; }
                .planet-sun { fill: #E65100; }
                .planet-moon { fill: #1A237E; }
                .planet-mars { fill: #C62828; }
                .planet-mercury { fill: #2E7D32; }
                .planet-jupiter { fill: #F9A825; }
                .planet-venus { fill: #AD1457; }
                .planet-saturn { fill: #424242; }
                .planet-rahu { fill: #455A64; }
                .planet-ketu { fill: #5D4037; }
            `}</style>

            {/* Background */}
            <rect x="0" y="0" width="400" height="400" className="chart-bg" />

            {/* Chart Lines Container */}
            <g className="chart-lines">
                {/* Outer Box */}
                <rect x="2" y="2" width="396" height="396" />

                {/* Diagonals (Corner to Corner) */}
                <line x1="2" y1="2" x2="398" y2="398" />
                <line x1="398" y1="2" x2="2" y2="398" />

                {/* Inner Diamond (Midpoint to Midpoint) */}
                <line x1="200" y1="2" x2="2" y2="200" />    {/* Top-Mid to Left-Mid */}
                <line x1="2" y1="200" x2="200" y2="398" />  {/* Left-Mid to Bottom-Mid */}
                <line x1="200" y1="398" x2="398" y2="200" />{/* Bottom-Mid to Right-Mid */}
                <line x1="398" y1="200" x2="200" y2="2" />  {/* Right-Mid to Top-Mid */}
            </g>

            {/* Render houses */}
            {bhavChalit.map((house, i) => {
                const pos = getHousePosition(i);
                const planets = house.planets || [];

                // Helper for planet colors
                const getPlanetColor = (name) => {
                    const n = name.toLowerCase();
                    if (n.includes('su')) return 'planet-sun';
                    if (n.includes('mo')) return 'planet-moon';
                    if (n.includes('ma')) return 'planet-mars';
                    if (n.includes('me')) return 'planet-mercury';
                    if (n.includes('ju')) return 'planet-jupiter';
                    if (n.includes('ve')) return 'planet-venus';
                    if (n.includes('sa')) return 'planet-saturn';
                    if (n.includes('ra')) return 'planet-rahu';
                    if (n.includes('ke')) return 'planet-ketu';
                    return 'planet-text';
                };

                return (
                    <g key={i}>
                        {/* House Number (or Rashi number placement) */}
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
                        {planets.map((p, idx) => (
                            <text
                                key={idx}
                                x={pos.x}
                                y={pos.y + (idx * 12)}
                                className={`planet-text ${getPlanetColor(p.name)}`}
                                textAnchor={pos.align}
                                dominantBaseline="middle"
                            >
                                {p.name} {p.degree ? `-${Math.floor(p.degree)}°` : ''}
                            </text>
                        ))}
                    </g>
                );
            })}
        </svg>
    );
};
