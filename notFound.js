let _ = new render("head", {
    main: [
        {
            tag: "title",
            content: "Page not found 404"
        }
    ]
});
const proc = new render(body, { main: [] });
proc.errorPage("[ezy.js] CRITICAL ERROR: Page Error: Page not found.", 404, "page");