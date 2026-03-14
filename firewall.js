/* eslint-disable no-undef */
// Ezy.js firewall
const rules = [];
self.addEventListener("message", event => {
    if (event.data.type === "UPDATE_RULES") {
        for (const regex of event.data.rules) {
            rules.push(new RegExp(regex));
        }
    }
});
self.addEventListener("fetch", event => {
    const url = event.request.url;
    if (rules.some(rule => rule.test(url))) {
        event.respondWith(fetch(event.request));
        return;
    }
    event.respondWith(new Response("Request blocked since the url is not unwhitelisted", { status: 403 }));
});
