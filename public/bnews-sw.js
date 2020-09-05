const STATIC_CACHE = "static-v2";
const DYNAMIC_CACHE = "dynamic-v2";

self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      cache.addAll([
        "/",
        "/index.html",
        "/src/css/app.css",
        "/src/js/app.js",
        "src/js/route.js",
        "/src/images/logo/logo_transparent.jpg",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "/error.html",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
  event.waitUntil(
    caches.keys().then((keys) => {
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      ).then((result) => {
        console.log(result);
      });
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res) {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request.url, res.clone());
            return res;
          });
        }
      })
      .catch((err) => {
        console.log("CATCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
        return caches.match(event.request).then((response) => {
          return response;
        });
      })
  );

  // .catch((err) => {
  //   return caches.match(event.request).then((response) => {
  //     return response;
  //   });
  // });

  // return fetch(event.request).then((res)=>{

  // })
  // caches.match(event.request).then((response) => {
  //   if (response) {
  //     return response;
  //   } else {
  //     return fetch(event.request).then((res) => {
  //       return caches
  //         .open(DYNAMIC_CACHE)
  //         .then((cache) => {
  //           cache.put(event.request.url, res.clone());
  //           return res;
  //         })
  //         .catch((err) => {
  //           return caches.open(STATIC_CACHE).then((cache) => {
  //             return cache.match("/error.html");
  //           });
  //         });
  //     });
  //   }
  // })
});
