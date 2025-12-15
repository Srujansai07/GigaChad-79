import { Metadata } from 'next';
import ProductivityHeatmap from '@/components/ProductivityHeatmap';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
    title: 'Analytics | BroGigaChad',
    description: 'Your productivity analytics and insights',
};

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-background p-4 pb-24 space-y-4">
            <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>

            {/* Time Period Selector */}
            <div className="flex gap-2 mb-4">
                {['Week', 'Month', 'Year', 'All'].map((period) => (
                    <button
                        key={period}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium ${period === 'Month'
                                ? 'bg-primary text-white'
                                : 'bg-surface text-gray-400 border border-gray-700'
                            }`}
                    >
                        {period}
                    </button>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-xl p-4 border border-gray-800">
                    <p className="text-gray-500 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold text-white">247</p>
                    <p className="text-xs text-success">+12% vs last month</p>
                </div>
                <div className="bg-surface rounded-xl p-4 border border-gray-800">
                    <p className="text-gray-500 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold text-success">87%</p>
                    <p className="text-xs text-success">+3% vs last month</p>
                </div>
                <div className="bg-surface rounded-xl p-4 border border-gray-800">
                    <p className="text-gray-500 text-sm">Aura Earned</p>
                    <p className="text-2xl font-bold text-aura">12.5K</p>
                    <p className="text-xs text-success">+18% vs last month</p>
                </div>
                <div className="bg-surface rounded-xl p-4 border border-gray-800">
                    <p className="text-gray-500 text-sm">Focus Time</p>
                    <p className="text-2xl font-bold text-primary">42h</p>
                    <p className="text-xs text-danger">-5% vs last month</p>
                </div>
            </div>

            {/* Heatmap */}
            <ProductivityHeatmap />

            {/* Insights */}
            <div className="bg-surface rounded-xl p-4 border border-gray-800">
                <h3 className="font-medium text-white mb-3">Insights</h3>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2 text-gray-400">
                        <span className="text-yellow-400">💡</span>
                        <span>You're most productive between 9-11 AM. Schedule important tasks then!</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-400">
                        <span className="text-red-400">⚠️</span>
                        <span>Tuesdays have the most skips. Consider lighter workloads.</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-400">
                        <span className="text-green-400">✅</span>
                        <span>Your streak is at an all-time high! Keep it up!</span>
                    </li>
                </ul>
            </div>

            <BottomNav />
        </div>
    );
}
