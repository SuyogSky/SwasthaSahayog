// sw.js (Service Worker file)
import Logo from './assets/Images/heart-banner.png'

self.addEventListener('push', function(event) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: Logo,
        tag: 'medicine-reminder'
      })
    );
  });
  