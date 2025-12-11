import { Metadata } from 'next';
import FocusSession from '@/components/FocusSession';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
    title: 'Focus | BroGigaChad',
    description: 'Deep focus sessions with Pomodoro timer',
};

export default function FocusPage() {
    return (
        <div className="min-h-screen bg-background p-4 pb-24">
            <h1 className="text-2xl font-bold text-white mb-6">Focus Mode</h1>

            <FocusSession />

            {/* Tips */}
            <div className="mt-6 bg-surface rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Focus Tips</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                    <li>ðŸŽ§ Put on noise-canceling headphones</li>
                    <li>ðŸ“± Turn on Do Not Disturb</li>
                    <li>ðŸ§˜ Take deep breaths before starting</li>
                    <li>ðŸ’§ Stay hydrated during breaks</li>
                    <li>ðŸš€ Start with the hardest task first</li>
                </ul>
            </div>

            <BottomNav />
        </div>
    );
}
