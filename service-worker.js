// eslint-disable-next-line no-restricted-globals

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for more information.

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.core.clientsClaim();

/**
 * Precache all of the assets generated by your build process.
 * Their URLs are injected into the manifest variable below.
 * This variable must be present somewhere in your service worker file,
 * even if you decide not to use precaching. See https://cra.link/PWA
 */
const precacheManifest = self.__WB_MANIFEST || [];
workbox.precaching.precacheAndRoute(precacheManifest);

/**
 * An example runtime caching route for requests that aren't handled by the
 * precache, in this case same-origin .png requests like those from in public/
 */
workbox.routing.registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently-used images are removed.
      new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
