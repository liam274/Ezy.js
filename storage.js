export class store {
    #store = {};
    #varstore = {};
    add(data) {
        const { obj, actions } = data,
            temp = {};
        for (const key in obj) {
            for (const name in actions) {
                temp[name] = actions[name].bind(this.#varstore);
            }
            this.#store = { ...this.#store, ...temp };
            this.#varstore[key] = obj[key];
            break;
        }
    }
    committ(name) {
        this.#store[name]();
    }
    get(key) {
        return this.#store[key];
    }
}
