const pageData = {
    data: {
        a: 1, b: 2,
        func: (data) => `Hi, ${data}`,
        user: "Liam"
    }, main: {
        title: "laboritary",
        userbar: {},
        toolbar: {},
        content: [
            {
                content: "{user | func | func | func}",
                type: ["font-light-white"],
                tag: "span"
            }
        ]
    }
};
const proc = new render(pageData);