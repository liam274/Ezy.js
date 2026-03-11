/* eslint-disable no-undef */
import * as ezy from "./main.js";
// data
const pageData = {
    onStart: {
        funcs: []
    },
    config: {
        style: {
            ".right-hand": {
                display: "inline-flex",
                justifyContent: "space-between",
                flexDirection: "column",
                alignItems: "flex-end",
                height: "100%",
                width: "50%"
            },
            ".left-hand": {
                display: "inline-flex",
                justifyContent: "space-between",
                flexDirection: "column",
                height: "100%",
                width: "50%"
            }
        },
        typeExtend: {
            "oiie": ["font-black", "selectable"]
        }
    },
    data: {
        author: "liam",
        abc: () => true,
        ary: { a: 1, b: 2, c: 3, d: 4 },
        fruits: ["apple", "banana", "orange", "grapes", "mango", "cherry", "pear"],
        tools: {
            _home: {
                text: "ezy",
                href: "index.html"
            },
            notes: {
                text: "documentation",
                href: "doc.html"
            },
            setting: {
                text: "setting",
                href: "setting.html"
            },
            lab: {
                text: "lab",
                href: "expermential.html"
            }
        },
        users: {
            user: {
                text: "user",
                href: "user.html"
            }
        }
    }, component: [
        {
            id: "head",
            component: [
                {
                    id: "toolbar",
                    component: [
                        {
                            tag: "span",
                            type: ["link"],
                            id: "home",
                            content: "Ezy.js"
                        },
                        {
                            tag: "img",
                            src: "./assets/{{key}}.svg",
                            text: "{{value.text}}",
                            forEach: "tools",
                            events: {
                                onclick: {
                                    listener: [
                                        (e) => {
                                            ezy.Ezy.navigate(e.target.dataset.href);
                                        }
                                    ]
                                }
                            },
                            data: {
                                href: "{{value.href}}"
                            }
                        }
                    ]
                },
                {
                    id: "userbar",
                    component: [
                        {
                            tag: "img",
                            src: "./assets/{{key}}.svg",
                            text: "{{value.text}}",
                            forEach: "users",
                            events: {
                                onclick: {
                                    listener: [
                                        (e) => {
                                            ezy.Ezy.navigate(e.target.dataset.href);
                                        }
                                    ]
                                }
                            },
                            data: {
                                href: "{{value.href}}"
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "content",
            component: [
                {
                    type: [
                        "list"
                    ],
                    component: [
                        {
                            type: [
                                "list-header"
                            ]
                        },
                        {
                            type: [
                                "list-item"
                            ],
                            component: [
                                {
                                    type: ["left-hand"],
                                    component: [
                                        {
                                            tag: "h2",
                                            content: "Option"
                                        },
                                        {
                                            tag: "span",
                                            content: "Author: {author.toLocaleUpperCase()}.{{key}} says {{attr}}",
                                            type: [
                                                "big-2"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: ["right-hand"],
                                    component: [
                                        {
                                            tag: "button",
                                            content: "Forward"
                                        },
                                        {
                                            tag: "span",
                                            content: "someDate"
                                        }
                                    ]
                                }
                            ],
                            times: 12,
                            content: "{{index}}{{key}}",
                            style: {
                                display: "flex"
                            },
                            if: "abc",
                            forEach: "ary",
                            inherit: {
                                attr: "hi"
                            }
                        }
                    ],
                    style: {
                        width: "80%",
                        height: "60vh"
                    },
                    varAs: "list"
                },
                {
                    tag: "ol",
                    component: [
                        {
                            tag: "li",
                            content: "{{item}}",
                            forEach: "fruits",
                            type: ["oiie"]
                        }
                    ],
                    style: {
                        fontSize: "20px"
                    },
                    content: "Fruits: ",
                    type: ["font-black"]
                }
            ]
        }
    ]
};
ezy.routeGuard.guards.push(function (data) {
    if (ezy.routeGuard.builtin.has(data)) {
        return { allow: true };
    } else {
        return { allow: false, href: "notFound.html" };
    }
});
for (const i of ["index.html", "doc.html", "setting.html", "experiment.html"]) {
    ezy.routeGuard.builtin.add(i);
}
new ezy.render("head", {
    component: [
        {
            tag: "title",
            content: "Ezy.js: Document"
        },
        {
            tag: "link",
            rel: "icon",
            href: "./assets/icon.svg"
        }
    ]
});
const proc = new ezy.render(ezy.body, pageData);
proc.reload();
