import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'BroGigaChad - Your TopG Digital Brother',
    description: 'The digital accountability partner that forces action, not just reminds. Stop planning. Start doing.',
    keywords: ['productivity', 'accountability', 'discipline', 'focus', 'motivation', 'strict mode'],
    authors: [{ name: 'BroGigaChad Team' }],
    openGraph: {
        title: 'BroGigaChad - Your TopG Digital Brother',
        description: 'The app that forces you to do what you said you would do.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-background text-white min-h-screen`}>
                {children}
            </body>
        </html>
    );
}
