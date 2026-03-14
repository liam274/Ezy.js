/* eslint-disable no-undef */
// Ezy.js firewall
const CACHE_NAME = "ezy-firewall-rules-v1",
    rules = [];
self.addEventListener("message", event => {
    if (event.data.type === "UPDATE_RULES") {
        rules.length = 0;
        for (const regex of event.data.rules) {
            rules.push(new RegExp(regex));
        }
        caches.open(CACHE_NAME).then(cache => {
            cache.put("rules", new Response(JSON.stringify(event.data.rules)));
        });
    }
});
self.addEventListener("fetch", event => {
    const url = event.request.url;
    if (!url.startsWith("http")) {
        return;
    }
    if (event.request.method === "OPTIONS" || rules.some(rule => rule.test(url))) {
        event.respondWith(fetch(event.request));
        return;
    }
    event.respondWith(new Response(
        JSON.stringify({
            error: "Blocked by Ezy.js firewall",
            url
        }),
        {
            status: 403,
            headers: {
                "Content-Type": "application/json"
            }
        }
    ));
});
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.match("rules"))
            .then(response => response ? response.json() : [])
            .then(savedRules => {
                for (const i of savedRules.map(regex => new RegExp(regex))) {
                    rules.push(i);
                }
                self.skipWaiting();
            })
    );
});
self.addEventListener("activate", event => event.waitUntil(clients.claim()));
