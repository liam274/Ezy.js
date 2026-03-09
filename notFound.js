import * as ezy from "./main.js";
new ezy.render("head", {
    main: [
        {
            tag: "title",
            content: "Page not found 404"
        }
    ]
});
const proc = new ezy.render(ezy.body, { main: [] });
proc.errorPage("[ezy.js] CRITICAL ERROR: Page Error: Page not found.", ezy.HTTP_NOT_FOUND, "page");
