// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';

// Recipe URLs to cache initially
const RECIPE_URLS = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLS here so that they are
      //            added to the cache when the ServiceWorker is installed
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/assets/styles/main.css',
        '/assets/scripts/main.js',
        '/assets/scripts/RecipeCard.js',
        '/assets/images/icons/icon-192x192.png',
        '/assets/images/icons/icon-256x256.png',
        '/assets/images/icons/icon-384x384.png',
        '/assets/images/icons/icon-512x512.png',
        '/assets/images/icons/0-star.svg',
        '/assets/images/icons/1-star.svg',
        '/assets/images/icons/2-star.svg',
        '/assets/images/icons/3-star.svg',
        '/assets/images/icons/4-star.svg',
        '/assets/images/icons/5-star.svg',
        '/assets/images/icons/arrow-down.png',
        ...RECIPE_URLS
      ]);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  // B8. TODO - If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(cachedResponse) {
        // If the request is in the cache, return the cached version
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch the resource from the network
        return fetch(event.request).then(function(networkResponse) {
          // Add the network response to the cache for future use
          cache.put(event.request, networkResponse.clone());
          // Return the network response
          return networkResponse;
        }).catch(function(error) {
          // Handle network errors (e.g., offline)
          console.log('Fetch failed:', error);
          throw error;
        });
      });
    })
  );
});