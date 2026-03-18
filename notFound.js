import * as ezy from "./Ezy.js/main.js";
new ezy.render("head", {
    config: {
        urlFilter: {
            rules: [".*"],
            confirmer: () => true,
            reporter: () => undefined
        },
        debug: true
    },
    component: [
        {
            tag: "title",
            content: "Page not found 404"
        },
        {
            tag: "link",
            rel: "icon",
            href: "./assets/icon.svg"
        }
    ]
});
const proc = new ezy.render(ezy.body, {
    config: {
        debug: true,
        urlFilter: {
            rules: [".*"],
            confirmer: () => true,
            reporter: () => undefined
        },
    },
    component: []
});
proc.errorPage("[ezy.js] CRITICAL ERROR: Page Error: Page not found.", ezy.HTTP_NOT_FOUND, "Page not found");
