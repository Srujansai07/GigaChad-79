import { Metadata } from 'next';
import SquadView from '@/components/SquadView';
import ChallengeBattles from '@/components/ChallengeBattles';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
    title: 'Squad | BroGigaChad',
    description: 'Your squad and battles',
};

export default function SquadPage() {
    return (
        <div className="min-h-screen bg-background p-4 pb-24 space-y-6">
            <h1 className="text-2xl font-bold text-white">Brotherhood</h1>

            {/* Squad View */}
            <SquadView />

            {/* Challenge Battles */}
            <ChallengeBattles />

            <BottomNav />
        </div>
    );
}
