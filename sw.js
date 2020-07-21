
const version = 'v2'

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(version).then(function(cache) {
        return cache.addAll([
          'index.html',
          'styles/style.css',
          'app.js',
          'icons/flowerr.png',
          'sw.js',
        ]).catch(function(){
          console.log("some init caching failed")
        });
      })
    );
  });

  /// When the page is loaded for the very first time the service worker doesn't exist yet so the fetches from the page are not handled by it. 
  /// The service worker gains control upon restarting the page.
  /// clients.claim() event listener skips that and gives the service worker control upon activation.
  /// If this is a new servicw worker, activate isnt triggered until the old service worker is gone.
  self.addEventListener('activate', event => {
    clients.claim();
    console.log('Activating');

    event.waitUntil(
      caches.keys().then(keys => Promise.all(
        keys.map(key => {
          if(key !== version){
            return caches.delete(key)
          }
        })
      ))
    )
  });


  self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        console.log(`serving from cache ${version}`)
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();
          caches.open(version).then(function (cache) {
            console.log("saving to cache")
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          console.log("Could not find resource");
          console.log(event.request);
        });
      }
    }));
  });