'use client';

interface AuraData {
    date: string;
    amount: number;
}

interface AuraChartProps {
    data: AuraData[];
}

export default function AuraChart({ data }: AuraChartProps) {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.amount), 100); // Min max of 100
    const height = 150;
    const width = 300;
    const padding = 20;

    // Calculate points
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - (d.amount / maxVal) * (height - padding * 2) - padding;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full overflow-x-auto">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Grid lines */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333" strokeWidth="1" />
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#333" strokeWidth="1" strokeDasharray="4" />

                {/* Line */}
                <polyline
                    fill="none"
                    stroke="#FFD700" // Aura Gold
                    strokeWidth="3"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Points */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                    const y = height - (d.amount / maxVal) * (height - padding * 2) - padding;
                    return (
                        <g key={i} className="group">
                            <circle cx={x} cy={y} r="4" fill="#1a1a1a" stroke="#FFD700" strokeWidth="2" />
                            {/* Tooltip-ish label */}
                            <text
                                x={x}
                                y={y - 10}
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                {d.amount}
                            </text>
                            {/* X-Axis Label */}
                            <text x={x} y={height} textAnchor="middle" fill="#666" fontSize="10">{d.date}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
