export class store {
    #store = {};
    #varstore = {};
    #listeners = new Set();
    add({ vars, actions }) {
        for (const name in actions) {
            this.#store[name] = actions[name].bind(this.#varstore);
        }
        for (const key in vars) {
            this.#varstore[key] = vars[key];
        }
    }
    commit(name, ...args) {
        this.#store[name](...args);
        this.#notify(name, ...args);
    }
    get(key) {
        return this.#store[key];
    }
    getState() {
        return { ...this.#varstore };
    }
    subscribe(func) {
        this.#listeners.add(func);
        return () => this.#listeners.delete(func);
    }
    #notify(..._) {
        for (const i of this.#listeners) {
            i(..._);
        }
    }
}
