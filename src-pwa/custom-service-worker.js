/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/*
Dependencies
*/

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { StaleWhileRevalidate } from 'workbox-strategies'
import { CacheFirst } from 'workbox-strategies'
import { NetworkFirst } from 'workbox-strategies'
import { Queue } from 'workbox-background-sync'

/*
 Config
 */

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

let backgroundSyncSupported = 'sync' in self.registration ? true : false

console.log('backgroundSyncSupported', backgroundSyncSupported)

/*
 queue - createCategory
*/
let createCategoryQueue = null
if (backgroundSyncSupported) {
  createCategoryQueue = new Queue('createCategoryQueue');
}

/*
 Caching Strategies
 */

 registerRoute(
    ({url}) => url.host.startsWith('fonts.g'),
    new CacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 30,
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
      ],
    })
  );

registerRoute(
  ({ url }) => url.pathname.startsWith('/categoria'),
  new NetworkFirst()
)

registerRoute(
  ({ url }) => url.href.startsWith('http'),
  new StaleWhileRevalidate()
)

/*
 event -fetch
*/

if(backgroundSyncSupported) {
  self.addEventListener('fetch', (event) => {
    console.log('Event: ', event)
    if (event.request.url.endsWith('/categoria/')){
      // Clone the request to ensure it's safe to read when
      // adding to the Queue.
      console.log('Entra al url que termina en /categoria/')
      const promiseChain = fetch(event.request.clone()).catch((err) => {
        return createCategoryQueue.pushRequest({request: event.request});
      });

      event.waitUntil(promiseChain);
    }   
  });
}

