const APP_PREFIX = 'BudgerTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION
const DATA_CACHE_NAME = "usableCache" + VERSION
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/idb.js",
  "/js/index.js",
  "/manifest.json"
];

// Cache resources


// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  if (e.request.url.includes("/api/")) {
    console.log(e.request)

    e.respondWith(
      caches.open(DATA_CACHE_NAME).then(function (openCache) {
        // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        fetch(e.request).then(promise => {
          if(promise.status == 200){

            openCache.put(e.request.url, promise.clone())
          }
          return promise
        }).catch(err => {
          return openCache.match(e.request)
        })

        // You can omit if/else for console.log & put one line below like this too.
        // return request
      }).catch(err => console.log(err))
    )
  } else () => {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.match(e.request).then((response) => {
          if (response) {
            return response;
          } else if (e.request.headers.get("accept").includes("text/html")) {
            return caches.match("/")
          }
        })
      })
    )
  }
})


// Delete outdated caches
// self.addEventListener('activate', function (e) {
//   e.waitUntil(
//     cache.keys().then(function (keyList) {
//       // `keyList` contains all cache names under your username.github.io
//       // filter out ones that has this app prefix to create keeplist
//       let cacheKeeplist = keyList.filter(function (key) {
//         return key.indexOf(APP_PREFIX);
//       })
//       // add current cache name to keeplist
//       cacheKeeplist.push(CACHE_NAME);

//       return Promise.all(keyList.map(function (key, i) {
//         if (cacheKeeplist.indexOf(key) === -1) {
//           console.log('deleting cache : ' + keyList[i]);
//           return cache.delete(keyList[i]);
//         }
//       }));
//     })
//   );
// });