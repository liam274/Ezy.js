const pageData = {
    data: {
        a: 1, b: 2,
        func: (data, ask) => `Hi, ${data}, ${ask}`,
        user: "Liam"
    }, main: {
        title: "laboritary",
        userbar: {},
        toolbar: {},
        content: [
            {
                content: "{user | func:'How are you?' | func | func}",
                type: ["font-light-white"],
                tag: "span"
            }
        ]
    }
};
const proc = new render(pageData);