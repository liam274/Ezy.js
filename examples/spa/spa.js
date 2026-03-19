/* eslint-disable no-magic-numbers */
import * as ezy from "../../Ezy.js/main.js";
// data
const pageData = {
    onStart: {
        funcs: []
    },
    config: {
        debug: true,
        urlFilter: {
            rules: [".*"],
            confirmer: () => true,
            reporter: () => undefined
        }
    }, data: {
        pager: "placeholder"
    }, component: [
        {
            config: {
                tag: "button"
            },
            component: [
                {
                    content: "hello, world!",
                    events: {
                        onclick: {
                            preventDefault: false,
                            listener: [
                                () => proc.edit("pager", "world")// fetch function, in your case
                            ]
                        }
                    }
                },
                {
                    content: "hello, Ezy.js!",
                    events: {
                        onclick: {
                            preventDefault: false,
                            listener: [
                                () => proc.edit("pager", "Ezy.js!!")// fetch function, in your case
                            ]
                        }
                    }
                },
                {
                    content: "hello, JS!",
                    events: {
                        onclick: {
                            preventDefault: false,
                            listener: [
                                () => proc.edit("pager", "JS!")// fetch function, in your case
                            ]
                        }
                    }
                }
            ]
        },
        {
            component: [
                {
                    belt: {
                        buckle: ["pager"]
                    },
                    content: "Hello, {pager}!",
                    tag: "h1"
                }
            ]
        }
    ],
    classify: {
    }
};
new ezy.render("head", {
    config: {
        urlFilter: {
            rules: [".*"],
            confirmer: () => true,
            reporter: () => undefined
        },
        debug: true
    }, component: [
        {
            tag: "title",
            content: "Ezy.js SPA example"
        },
        {
            tag: "link",
            rel: "icon",
            href: "./assets/icon.svg"
        }
    ]
}, 1000);
const proc = new ezy.render(ezy.body, pageData, 1000);
proc.reload();
