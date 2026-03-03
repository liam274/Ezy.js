// data
const pageData = {
    onStart: {
        funcs: []
    },
    data: {
        details: {
            "Introduce to Ezy": "{ezy} is a modern, clean, and efficient framework. Projects can be easily written in JSON. So the networking will be more efficent",
            "Why Ezy?": "{ezy} is lightweight, easy-learning and have incrediable functions: 2+2={2+2}",
            "How to get start?": "{ezy} is <b>FREE!</b> You can use it wherever you'd like to."
        },
        ezy: "<i><b>Ezy.js</b></i>",
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
                href: "experiment.html"
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
            id: "title",
            component: [
                {
                    type: ["left-right"],
                    component: [
                        {
                            style: {
                                fontSize: "80px"
                            },
                            content: "Ezy.js",
                            tag: "h1"
                        },
                        {
                            tag: "span",
                            id: "slogon",
                            content: "A modern framework technology."
                        }
                    ]
                },
                {
                    type: ["left-right"]
                }
            ]
        },
        {
            id: "content",
            component: [
                "cardie",
                {
                    component: [
                        {
                            tag: "h1",
                            content: "Try:"
                        },
                        {
                            tag: "p",
                            content: "May you try the incrediable convience function!"
                        },
                        {
                            tag: "button",
                            content: "Ezy.alert",
                            events: {
                                onclick: {
                                    preventDefault: false,
                                    listener: [() => Ezy.alert({ title: "Ezy.js", content: "Hi, how are you today?" })]
                                }
                            }
                        }
                    ],
                    type: ["card", "metal"],
                    events: {
                        "contextmenu": {
                            preventDefault: true,
                            listener: []
                        }
                    }
                },
                {
                    tag: "input",
                    type: ["font-black"],
                    style: {
                        fontWeight: "bold",
                        borderRadius: "5px"
                    },
                    validate: "isEmail",
                    placeholder: "subscribe email"
                },
                {
                    tag: "h1",
                    expire: {
                        date: 10000 + (+ new Date())
                    },
                    content: "I'll expire in ten second!"
                }
            ]
        },
        {
            id: "footer",
            component: [
                {
                    text: "Normal Q&A",
                    location: "q&a.html",
                    type: ["bg-light-white", "font-black"],
                    id: "clarify",
                    content: "Normal Q&A"
                }
            ],
            config: {
                tag: "span",
                type: ["footerLink"]
            }
        }
    ],
    classify: {
        cardie: {
            component: [
                {
                    tag: "h1",
                    content: "{{key}}"
                },
                {
                    tag: "p",
                    content: "{{value}}"
                },
                {
                    tag: "button",
                    content: "Get Started",
                    events: {
                        onclick: {
                            preventDefault: false,
                            listener: [() => Ezy.navigate("https://github.com/liam274/Ezy.js/")]
                        }
                    }
                }
            ],
            type: ["card", "metal"],
            forEach: "details",
            events: {
                "contextmenu": {
                    preventDefault: true,
                    listener: []
                }
            }
        },
        tit: {
            tag: "h1",
            content: "Ezy.js",
            style: {
                fontSize: "80px"
            }
        }
    }
};
routeGuard.guards.push(function (data) {
    if (routeGuard.builtin.has(data)) {
        return { allow: true };
    } else {
        return { allow: false, href: "notFound.html" };
    }
});
for (let i of ["index.html", "doc.html", "setting.html", "experiment.html"]) routeGuard.builtin.add(i);
let _ = new render("head", {
    main: [
        {
            tag: "title",
            content: "Ezy.js: A modern front-end framework"
        }
    ]
});
const proc = new render(body, pageData);
proc.reRender();