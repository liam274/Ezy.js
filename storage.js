export class store {
    #store = {};
    #varstore = {};
    add(data) {
        const { vars, actions } = data;
        for (const name in actions) {
            this.#store[name] = actions[name].bind(this.#varstore);
        }
        for (const key in vars) {
            this.#varstore[key] = vars[key];
        }
    }
    commit(name, ...args) {
        this.#store[name](...args);
    }
    get(key) {
        return this.#store[key];
    }
    getState() {
        return { ...this.#varstore };
    }
}
