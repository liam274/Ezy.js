/**
 * Version Controller
 */
export default class History {
    #history = [];
    #data = undefined;
    constructor(data, methods) {
        this.#data = data;
        for (const name of methods) {
            if (typeof methods[name] !== "function") {
                throw new Error(`[ezy.js] CRITIAL ERROR: Type Error: Expected methods as function[], found ${typeof methods[name]} as element.`);
            }
            this[name] = methods[name];
        }
    }
    toString() {
        return this.#data;
    }
    valueOf() {
        return this.#data;
    }
    commit(key, value) {
        const snapshot = {
            old: this.#data[key],
            new: value,
            key
        };
        this.#history.push(snapshot);
        this.#data[key] = value;
    }
    rollback(offset) {
        this.#history.length -= offset;
        const { key, old } = this.#history[this.#history.length - 1];
        this.#data[key] = old;
    }
    peacefulRollback(offset) {
        const { key, old } = this.#history[this.#history.length - offset - 1];
        this.#data[key] = old;
    }
};
