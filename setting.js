import * as ezy from "./Ezy.js/main.js";
const proc = new ezy.render(ezy.body, {
    config: {
        urlFilter: {
            rules: [".*"],
            confirmer: () => true,
            reporter: () => undefined
        },
        debug: true
    }
});
proc.reload();
