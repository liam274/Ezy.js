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
        ezy: "<i><b>Ezy.js</b></i>"
    }, main: {
        title: "Ezy.js: A modern front-end framework",
        toolbar: {
            _home: {
                text: "ezy",
                location: "index.html"
            },
            notes: {
                text: "Documentation",
                location: "doc.html"
            },
            setting: {
                text: "Setting",
                location: "setting.html"
            },
            lab: {
                text: "lab",
                location: "experiment.html"
            }
        },
        userbar: {
            user: {
                text: "User",
                location: "user.html"
            }
        },
        banner: [
            {
                type: ["left-right"],
                component: [
                    "tit",
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
        ],
        content: [
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
        ],
        footer: {
            clarify: {
                text: "Normal Q&A",
                location: "q&a.html",
                type: ["bg-light-white", "font-black"]
            }
        }
    },
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
                            listener: [() => location.href = "notes.html"]
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
const proc = new render(pageData);
proc.reRender();