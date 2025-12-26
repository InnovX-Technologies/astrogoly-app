// South Indian Diamond Chart Component
export const SouthIndianChart = ({ bhavChalit }) => {
    return (
        <svg viewBox="0 0 400 400" className="bhav-chart-svg">
            {/* Outer diamond */}
            <line x1="200" y1="20" x2="380" y2="200" stroke="#8B4513" strokeWidth="2.5" />
            <line x1="380" y1="200" x2="200" y2="380" stroke="#8B4513" strokeWidth="2.5" />
            <line x1="200" y1="380" x2="20" y2="200" stroke="#8B4513" strokeWidth="2.5" />
            <line x1="20" y1="200" x2="200" y2="20" stroke="#8B4513" strokeWidth="2.5" />

            {/* Inner cross */}
            <line x1="200" y1="20" x2="200" y2="380" stroke="#8B4513" strokeWidth="1.5" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="#8B4513" strokeWidth="1.5" />

            {/* Diagonal cross */}
            <line x1="110" y1="110" x2="290" y2="290" stroke="#8B4513" strokeWidth="1.5" />
            <line x1="290" y1="110" x2="110" y2="290" stroke="#8B4513" strokeWidth="1.5" />

            {/* South Indian house positions */}
            {bhavChalit.map((house, i) => {
                const positions = [
                    { x: 200, y: 110, numX: 200, numY: 45, align: 'middle' },      // 1 - Top center
                    { x: 300, y: 75, numX: 340, numY: 65, align: 'start' },        // 2 - Top right
                    { x: 320, y: 140, numX: 360, numY: 135, align: 'start' },      // 3 - Right top
                    { x: 320, y: 200, numX: 360, numY: 200, align: 'start' },      // 4 - Right center
                    { x: 320, y: 260, numX: 360, numY: 265, align: 'start' },      // 5 - Right bottom
                    { x: 300, y: 325, numX: 340, numY: 335, align: 'start' },      // 6 - Bottom right
                    { x: 200, y: 290, numX: 200, numY: 355, align: 'middle' },     // 7 - Bottom center
                    { x: 100, y: 325, numX: 60, numY: 335, align: 'end' },         // 8 - Bottom left
                    { x: 80, y: 260, numX: 40, numY: 265, align: 'end' },          // 9 - Left bottom
                    { x: 80, y: 200, numX: 40, numY: 200, align: 'end' },          // 10 - Left center
                    { x: 80, y: 140, numX: 40, numY: 135, align: 'end' },          // 11 - Left top
                    { x: 100, y: 75, numX: 60, numY: 65, align: 'end' }            // 12 - Top left
                ];

                const pos = positions[i];
                const planetsText = house.planets.map(p => p.name).join(' ');

                return (
                    <g key={i}>
                        {/* Planet names */}
                        <text
                            x={pos.x}
                            y={pos.y}
                            fontSize="14"
                            fill="#8B0000"
                            fontWeight="600"
                            textAnchor={pos.align}
                        >
                            {planetsText}
                        </text>
                        {/* House number */}
                        <text
                            x={pos.numX}
                            y={pos.numY}
                            fontSize="11"
                            fill="#666"
                            textAnchor={pos.align}
                        >
                            {i + 1}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};
