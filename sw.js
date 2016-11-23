importScripts('/cache-polyfill.js');
const PREFIX = 'SvgNet';
const VER = 'v3.9.17-exp';
const OFFLINE_CACHE = `${PREFIX}-${VER}`;
var CACHE_URLS = [
    '/'
    , '/index.html'
    , '/css/material.icons.css'
    , '/css/material.custom.css'
    , '/css/material.min.css'
    , '/css/mdl-selectfield.min.css'
    , '/css/dialog-polyfill.css'
    , '/fonts/MaterialIcons-Regular.woff2'
    , '/fonts/MaterialIcons-Regular.woff'
    , '/fonts/MaterialIcons-Regular.ttf'
    , '/fonts/MaterialIcons-Regular.eot'
    , '/js/dialog-polyfill.js'
    , '/js/mdl-selectfield.min.js'
    , '/js/init.js'
    , '/js/svgnet.js'
    , '/js/util.js'
    , '/js/ui.js'
    , '/js/science.v1.min.js'
    , '/js/pep.js'
    , '/js/loc.js'
    , 'js/pouchdb.min.js'
    , '/js/material.min.js'
    , '/icon.png'
      ]
self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(OFFLINE_CACHE).then(function (cache) {
        return cache.addAll(CACHE_URLS).then(function () {
            return self.skipWaiting();
        });
    }));
});
self.addEventListener('activate', function (event) {
    // Delete old asset caches.
    event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (key) {
            console.log(key);
            if (key != OFFLINE_CACHE) {
                console.log("Updating Cache...");
                return caches.delete(key);
            } else {
                console.log("Cache Okay")
            }
        }));
    }));
});
self.addEventListener('fetch', function (event) {
    //console.log(event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    }));
});
