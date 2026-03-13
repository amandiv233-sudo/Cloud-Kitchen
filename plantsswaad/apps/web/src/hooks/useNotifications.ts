'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Generate VAPID keypair once: npx web-push generate-vapid-keys
// Store public key in env: NEXT_PUBLIC_VAPID_PUBLIC_KEY
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
        setIsSupported(supported);
        if (supported) {
            setPermission(Notification.permission);
        }
    }, []);

    const registerServiceWorker = useCallback(async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return null;
        }
    }, []);

    const subscribeToPush = useCallback(async () => {
        try {
            const registration = await registerServiceWorker();
            if (!registration) return null;

            // Wait for the service worker to be ready
            await navigator.serviceWorker.ready;

            // Check if already subscribed
            let sub = await registration.pushManager.getSubscription();

            if (!sub && VAPID_PUBLIC_KEY) {
                sub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                });
            }

            if (sub) {
                setSubscription(sub);

                // Save subscription to Supabase for server-side push
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    // push_subscriptions table may not exist yet — fail silently
                    try {
                        await (supabase as any).from('push_subscriptions').upsert(
                            {
                                user_id: session.user.id,
                                subscription: JSON.parse(JSON.stringify(sub)),
                                created_at: new Date().toISOString(),
                            },
                            { onConflict: 'user_id' }
                        );
                    } catch {
                        // Table doesn't exist yet — that's OK
                    }
                }
            }

            return sub;
        } catch (error) {
            console.error('Push subscription error:', error);
            return null;
        }
    }, [registerServiceWorker]);

    const requestPermission = useCallback(async () => {
        if (!isSupported) return false;

        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
            await subscribeToPush();

            // Register service worker even without VAPID for local notifications
            await registerServiceWorker();
            return true;
        }

        return false;
    }, [isSupported, subscribeToPush, registerServiceWorker]);

    const sendLocalNotification = useCallback(
        (title: string, options?: NotificationOptions) => {
            if (permission !== 'granted') return;

            // Use service worker for notification so it works even when page is in background
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, {
                    icon: '/logo.png',
                    badge: '/logo.png',
                    ...options,
                } as NotificationOptions);
            });
        },
        [permission]
    );

    return {
        permission,
        isSupported,
        subscription,
        requestPermission,
        sendLocalNotification,
    };
}
