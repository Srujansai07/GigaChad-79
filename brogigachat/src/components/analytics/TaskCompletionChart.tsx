'use client';

interface TaskData {
    date: string;
    count: number;
}

interface TaskCompletionChartProps {
    data: TaskData[];
}

export default function TaskCompletionChart({ data }: TaskCompletionChartProps) {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.count), 5); // Min max of 5
    const height = 150;
    const width = 300;
    const padding = 20;
    const barWidth = (width - padding * 2) / data.length - 10;

    return (
        <div className="w-full overflow-x-auto">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Grid line base */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333" strokeWidth="1" />

                {data.map((d, i) => {
                    const x = padding + i * ((width - padding * 2) / data.length) + 5;
                    const barHeight = (d.count / maxVal) * (height - padding * 2);
                    const y = height - padding - barHeight;

                    return (
                        <g key={i} className="group">
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill="#3b82f6" // Primary Blue
                                rx="4"
                                className="transition-all hover:fill-blue-400"
                            />
                            {/* Value Label */}
                            <text
                                x={x + barWidth / 2}
                                y={y - 5}
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                {d.count}
                            </text>
                            {/* X-Axis Label */}
                            <text x={x + barWidth / 2} y={height} textAnchor="middle" fill="#666" fontSize="10">{d.date}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
