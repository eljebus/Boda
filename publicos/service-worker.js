const CACHE_NAME = 'Fatima&Jesus-v0.1.0';
const STATIC_ASSETS = [
  '/',
  '/publicos/css/album.css',
  '/publicos/css/materialize.css',
  '/publicos/css/plan.css',
  '/publicos/css/style.css',
  '/publicos/css/textos.css',

  '/publicos/js/script.js',
  '/publicos/js/efectos.js',
  '/publicos/js/materialize.js',
  '/publicos/js/share.js',
  '/publicos/js/textos.js',
  '/publicos/js/fecha.js',

  '/publicos/img/768b292d-450b-4b02-9b59-5ba6921177d5.jpg',
  '/publicos/img/arras.png',
  '/publicos/img/clock.png',
  '/publicos/img/cubiertos.png',
  '/publicos/img/fases.png',
  '/publicos/img/flores.png',
  '/publicos/img/foto.jpeg',
  '/publicos/img/foto.png',
  '/publicos/img/fotoHome.png',
  '/publicos/img/galeria.png',
  '/publicos/img/girar.png',
  '/publicos/img/icono.png',
  '/publicos/img/luna.png',
  '/publicos/img/luna.webp',
  '/publicos/img/mapa.png',
  '/publicos/img/pencil.png',
  '/publicos/img/pencilHome.png',
  '/publicos/img/templo.png',
  '/publicos/img/icon-192x192.png',
  '/publicos/img/icon-512x512.png'
];

// Instalar el service worker y almacenar en caché los recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Error al cachear recursos:', error);
      })
  );
  self.skipWaiting();
});

// Activar el service worker y limpiar cachés antiguas
self.addEventListener('activate', async (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando cache antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();

  // Forzar desuscripción al activar el service worker
  const subscription = await self.registration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
    console.log('Suscripción eliminada al activar service worker');
  }
});

// Interceptar solicitudes y servir desde la caché
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // No cachear solicitudes POST
  if (request.method === 'POST') {
    event.respondWith(fetch(request));
    return;
  }

  // Manejar solicitudes de vistas dinámicas (EJS o HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clonar la respuesta porque solo se puede usar una vez
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          return caches.match('/');
        })
    );
  } else {
    // Manejar recursos estáticos
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((response) => {
              // Clonar la respuesta porque solo se puede usar una vez
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              return response;
            });
        })
    );
  }
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/img/icon-192x192.png',
      badge: data.badge || '/img/icon-192x192.png',
      image: data.image,
      vibrate: [100, 50, 100],
      data: data.data,
      actions: data.actions || [{
        action: 'explore',
        title: 'Ver más'
      }]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});