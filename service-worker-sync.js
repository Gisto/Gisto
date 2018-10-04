importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.2/workbox-sw.js');

const inform = async () => {
  const message = { status: 'queueDidReplay' };
  const clients = await self.clients.matchAll();

  for (const client of clients) {
    client.postMessage(message);
  }
};

const queue = new workbox.backgroundSync.Queue('gisto-background-sync-queue', {
  callbacks: {
    queueDidReplay: inform
  }
});

self.addEventListener('fetch', (event) => {
  const promiseChain = fetch(event.request.clone())
    .catch(() => queue.addRequest(event.request));

  event.waitUntil(promiseChain);
});
