import { Metadata } from 'next';
import BadgeGrid from '@/components/BadgeGrid';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
    title: 'Badges | BroGigaChad',
    description: 'All your achievements and badges',
};

export default function BadgesPage() {
    return (
        <div className="min-h-screen bg-background p-4 pb-24">
            <h1 className="text-2xl font-bold text-white mb-6">All Badges</h1>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['All', 'Unlocked', 'Locked', 'Rare'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${tab === 'All'
                                ? 'bg-primary text-white'
                                : 'bg-surface text-gray-400 border border-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* All Badges */}
            <div className="bg-surface rounded-xl p-4 border border-gray-800">
                <BadgeGrid showAll={true} />
            </div>

            <BottomNav />
        </div>
    );
}
