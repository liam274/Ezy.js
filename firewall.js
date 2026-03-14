/* eslint-disable no-undef */
// Ezy.js firewall
const CACHE_NAME = "ezy-firewall-rules-v1",
    rules = [];
let ruled = false;
self.addEventListener("install", event => {
    if (!ruled) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => cache.match("rules"))
                .then(response => response ? response.json() : [])
                .then(savedRules => {
                    if (savedRules.length > 0) {
                        rules.length = 0;
                        for (const i of savedRules) {
                            rules.push(new RegExp(i));
                        }
                        ruled = true;
                        console.log("rules loaded");
                    }
                    self.skipWaiting();
                })
        );
    } else {
        self.skipWaiting();
    }
});
self.addEventListener("activate", event => event.waitUntil(clients.claim()));
self.addEventListener("message", event => {
    if (event.data.type === "UPDATE_RULES") {
        rules.length = 0;
        for (const regex of event.data.rules) {
            rules.push(new RegExp(regex));
        }
        ruled = true;
        console.log("rules loaded");
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
    if (!ruled) {
        return;
    }
    if (rules.some(rule => rule.test(url)) || event.request.method === "OPTIONS") {
        event.respondWith(fetch(event.request));
        return;
    }
    event.respondWith(new Response(
        JSON.stringify(
            {
                error: "Blocked by Ezy.js firewall",
                url
            }
        ),
        {
            status: 403,
            headers: {
                "Content-Type": "application/json"
            }
        }
    ));
});
