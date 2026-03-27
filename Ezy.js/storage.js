import { yieldProcess } from "./utils.js";
import { MAX_LOOP_TIME } from "./consts.js";

export class store {
    #store = new Map();
    #varstore = {};
    #listeners = new Set();
    /**
     * add variables and actions related
     * @param {Object<string,any>} param0
     */
    add({ vars, actions }) {
        for (const name in actions) {
            this.#store.set(name, actions[name].bind(this.#varstore));
        }
        for (const key in vars) {
            this.#varstore[key] = vars[key];
        }
    }
    /**
     * Commit a named function
     * @param {string} name
     * @param  {...any} args
     */
    commit(name, ...args) {
        if (!this.#store.has(name)) {
            throw new Error(`[ezy.js] CRITICAL ERROR: Variable Error: Try to access function-in-variable ${name}, not found.`);
        }
        this.#store.get(name)(...args);
        this.#notify(name, ...args);
    }
    /**
     * @param {string} key
     * @returns {any}
     */
    get(key) {
        return this.#store.get(key);
    }
    /**
     * Get the shallow copy of this.#varstore
     * @returns {Object}
     */
    getState() {
        return { ...this.#varstore };
    }
    /**
     * Subscribe a function that will be called everytime commit runs.
     * @param {function(any): void} func
     * @returns {function(): void} use this function to unsubscribe
     */
    subscribe(func) {
        this.#listeners.add(func);
        return () => this.#listeners.delete(func);
    }
    #notify(..._) {
        let t = 1;
        for (const i of this.#listeners) {
            if (t === MAX_LOOP_TIME) {
                yieldProcess();
                t = 0;
            }
            i(..._);
            t++;
        }
    }
}
