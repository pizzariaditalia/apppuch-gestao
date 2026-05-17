const CACHE_NAME = 'puch-gestao-v11';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './puch-icon.png'
];

// Instalação: Baixa os arquivos e FORÇA a ativação imediata (sem esperar fechar o app)
self.addEventListener('install', event => {
  self.skipWaiting(); // Pulo do gato para não prender o cache!
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação: Apaga a versão velha e assume o controle do celular na hora
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle do cliente web
  );
});

// Fetch: Tenta pegar do cache, se não tiver, busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
