const pageData = {
    main: {
        "title": "No React: Document",
        "toolbar": {
            "_home": {
                "text": "ezy",
                "location": "index.html"
            },
            "notes": {
                "text": "Notes",
                "location": "doc.html"
            },
            "setting": {
                "text": "Setting",
                "location": "setting.html"
            },
            "lab": {
                "text": "lab",
                "location": "experiment.html"
            }
        },
        "userbar": {
            "user": {
                "text": "User",
                "location": "user.html"
            }
        },
        "content": [
            {
                "type": [
                    "list"
                ],
                "component": [
                    {
                        "type": [
                            "list-header"
                        ]
                    },
                    {
                        "type": [
                            "list-item"
                        ],
                        "component": [
                            {
                                "style": {
                                    "display": "inline-flex",
                                    "justifyContent": "space-between",
                                    "flexDirection": "column",
                                    "height": "100%",
                                    "width": "50%"
                                },
                                "component": [
                                    {
                                        "tag": "h2",
                                        "content": "Option"
                                    },
                                    {
                                        "tag": "span",
                                        "content": "Author: {author.toLocaleUpperCase()}.{{key}} says {{attr}}",
                                        "type": [
                                            "big-2"
                                        ]
                                    }
                                ]
                            },
                            {
                                "style": {
                                    "display": "inline-flex",
                                    "justifyContent": "space-between",
                                    "flexDirection": "column",
                                    "alignItems": "flex-end",
                                    "height": "100%",
                                    "width": "50%"
                                },
                                "component": [
                                    {
                                        "tag": "button",
                                        "content": "Forward"
                                    },
                                    {
                                        "tag": "span",
                                        "content": "someDate"
                                    }
                                ]
                            }
                        ],
                        "times": 12,
                        "content": "{{index}}{{key}}",
                        "style": {
                            "display": "flex"
                        },
                        "if": "abc",
                        "forEach": "ary",
                        "inherit": {
                            "attr": "hi"
                        }
                    }
                ],
                "style": {
                    "width": "80%",
                    "height": "60vh"
                },
                "varAs": "list"
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
    },
    data: {
        author: "liam",
        abc: () => true,
        ary: { a: 1, b: 2, c: 3, d: 4 },
        fruits: ["apple", "banana", "orange", "grapes", "mango", "cherry", "pear"]
    }
};
const proc = new render(pageData);
proc.reRender();