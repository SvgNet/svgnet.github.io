importScripts('/cache-polyfill.js');

self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open('SvgNet_v1.9.1').then(function (cache) {
			return cache.addAll([
        '/',
        '/index.html',
				'/css/material.icons.css',
				'/css/material.custom.css',
				'/css/material.cyan-blue.min.css',
        '/fonts/MaterialIcons-Regular.woff2',
        '/fonts/MaterialIcons-Regular.woff',
        '/fonts/MaterialIcons-Regular.ttf',
        '/fonts/MaterialIcons-Regular.eot',
        '/js/init.js',
        '/js/svgnet.js',
        '/js/util.js',
        '/js/ui.js',
        '/js/material.min.js',
        '/icon.png'
      ]).then(function () {
				return self.skipWaiting();
			});
		})
	);
});

self.addEventListener('activate', function (event) {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
	console.log(event.request.url);

	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});
