const CACHE_NAME = 'puch-gestao-v10';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './puch-icon.png'
];

// Instalação: Adiciona os arquivos principais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação: Limpa caches antigos se a versão (CACHE_NAME) mudar
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
    })
  );
});

// Fetch: Intercepta as requisições para fazer o app funcionar offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrar, senão busca na rede
        return response || fetch(event.request);
      })
  );
});
