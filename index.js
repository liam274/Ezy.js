/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
import * as ezy from "./Ezy.js/main.js";
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
                {
                    component: ["cardie"]
                },
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
                            content: "Ezy.dialog.alert",
                            events: {
                                onclick: {
                                    preventDefault: false,
                                    listener: [() => ezy.Ezy.dialog.alert({ title: "Ezy.js", content: "Hi, how are you today?" })]
                                }
                            }
                        },
                        {
                            tag: "button",
                            content: "Ezy.dialog.confirm",
                            events: {
                                onclick: {
                                    preventDefault: false,
                                    listener: [() => ezy.Ezy.dialog.confirm({
                                        title: "Ezy.js",
                                        content: "Hi, can I use the alert in browser?",
                                        func: (yes) => yes ? alert("hooray!") : ""
                                    })]
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
                    component: [
                        {
                            type: ["font-black"],
                            style: {
                                fontWeight: "bold",
                                borderRadius: "5px"
                            },
                            validate: {
                                rules: ["isEmail", "maxl:20"],
                                required: true,
                                onCaught: () => alert("lol")
                            },
                            placeholder: "subscribe email"
                        },
                        {
                            _type: "submit"
                        }
                    ],
                    tag: "form",
                    config: {
                        tag: "input"
                    }
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
                    events: {
                        onclick: {
                            listener: [() => ezy.Ezy.navigate("q&a.html")]
                        }
                    },
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
        tit: {
            tag: "h1",
            content: "Ezy.js",
            style: {
                fontSize: "80px"
            }
        }
    }
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
            content: "Ezy.js: A modern front-end framework"
        },
        {
            tag: "link",
            rel: "icon",
            href: "./assets/icon.svg"
        }
    ]
}, 1000);
ezy.Ezy.component("cardie",
    {
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
                        listener: [() => ezy.Ezy.navigate("https://github.com/liam274/Ezy.js/")]
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
        },
        belt: {
            buckle: ["details"]
        }
    }
);
const proc = new ezy.render(ezy.body, pageData, 1000);
proc.reload();
setTimeout(() => {
    proc.edit("details", {
        "Introduce to Ezy": "{ezy} is a modern, clean, and efficient framework. Projects can be easily written in JSON. So the networking will be more efficent",
        "Why Ezy?": "{ezy} is lightweight, easy-learning and have incrediable functions: 2+2={2+2}",
        "How to get start?": "{ezy} is <b>FREE!</b> You can use it wherever you'd like to.",
        "It works!": "It works!!!"
    });
}, 10000);
