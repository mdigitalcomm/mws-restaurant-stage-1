let staticCacheName = 'cache-v0';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll([
				'/',
				'/css/styles.css',
				'/data/restaurants.json',
				'/img',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/js/dbhelper.js',
				'/index.html',
				'/restaurant.html'
			]);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('cache') && cacheName !== staticCacheName;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	const url = new URL(event.request.url);
	if (url.pathname.startsWith('/restaurant.html')) {
		event.respondWith(
			caches.match('restaurant.html').then(response => response || fetch(event.request))
		);
		return;
	} else {
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);
	}
	
});