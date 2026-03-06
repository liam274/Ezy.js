/* eslint-disable no-undef */
// data
const pageData = {
    onStart: {
        funcs: []
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
    }, main: [
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
                                            Ezy.navigate(e.target.dataset.href);
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
                                            Ezy.navigate(e.target.dataset.href);
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
                                    style: {
                                        display: "inline-flex",
                                        justifyContent: "space-between",
                                        flexDirection: "column",
                                        height: "100%",
                                        width: "50%"
                                    },
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
                                    style: {
                                        display: "inline-flex",
                                        justifyContent: "space-between",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        height: "100%",
                                        width: "50%"
                                    },
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
                            type: ["font-black", "selectable"]
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
routeGuard.guards.push(function (data) {
    if (routeGuard.builtin.has(data)) {
        return { allow: true };
    } else {
        return { allow: false, href: "notFound.html" };
    }
});
for (const i of ["index.html", "doc.html", "setting.html", "experiment.html"]) {
    routeGuard.builtin.add(i);
}
new render("head", {
    main: [
        {
            tag: "title",
            content: "Ezy.js: Document"
        }
    ]
});
const proc = new render(body, pageData);
proc.reRender();
