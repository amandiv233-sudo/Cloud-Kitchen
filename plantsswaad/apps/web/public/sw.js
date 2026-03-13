// PlanetsSwaad Push Notification Service Worker
// Handles background push events and notification clicks

self.addEventListener('push', function (event) {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'PlanetsSwaad 🍃',
      body: event.data.text(),
      icon: '/logo.png',
    };
  }

  const title = data.title || 'PlanetsSwaad 🍃';
  const options = {
    body: data.body || 'You have a new update from PlanetsSwaad!',
    icon: data.icon || '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    tag: data.tag || 'planetsswaad-notification',
    renotify: true,
    data: {
      url: data.url || '/',
    },
    actions: data.actions || [
      { action: 'open', title: '📱 Open App' },
      { action: 'dismiss', title: '✖ Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes('planetsswaad') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
