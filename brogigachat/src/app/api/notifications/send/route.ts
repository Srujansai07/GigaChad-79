import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure VAPID keys
const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
    webpush.setVapidDetails(
        'mailto:contact@brogigachad.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
}

// Send push notification endpoint
export async function POST(request: Request) {
    try {
        const { subscription, title, body, taskId, type } = await request.json();

        if (!subscription) {
            return NextResponse.json({ error: 'Missing subscription' }, { status: 400 });
        }

        const payload = JSON.stringify({
            title: title || 'BroGigaChad',
            body: body || 'Time to grind!',
            taskId,
            type: type || 'reminder',
        });

        await webpush.sendNotification(subscription, payload);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Push notification error:', error);

        // Handle specific errors
        if (error.statusCode === 410) {
            // Subscription expired or unsubscribed
            return NextResponse.json({ error: 'Subscription expired' }, { status: 410 });
        }

        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}
