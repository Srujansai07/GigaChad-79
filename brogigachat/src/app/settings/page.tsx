import { Metadata } from 'next';
import SettingsPage from '@/components/SettingsPage';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
    title: 'Settings | BroGigaChad',
    description: 'App settings and preferences',
};

export default function SettingsRoute() {
    return (
        <>
            <SettingsPage />
            <BottomNav />
        </>
    );
}
