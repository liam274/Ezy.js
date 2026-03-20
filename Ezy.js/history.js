/**
 * Version Controller
 */
export default class History {
    #history = [];
    #data = undefined;
    constructor(data, methods) {
        this.#data = data;
        for (const name in methods) {
            if (typeof methods[name] !== "function") {
                throw new Error(`[ezy.js] CRITICAL ERROR: Type Error: Expected methods as function[], found ${typeof methods[name]} as element.`);
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
            key
        };
        this.#history.push(snapshot);
        this.#data[key] = value;
    }
    rollback(offset) {
        if (offset >= this.#history.length) {
            throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Offset(${offset}) out of range`);
        }
        this.#history.length -= offset;
        const { key, old } = this.#history[this.#history.length - 1];
        this.#data[key] = old;
    }
    peacefulRollback(offset) {
        if (offset >= this.#history.length) {
            throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Offset(${offset}) out of range`);
        }
        const { key, old } = this.#history[this.#history.length - offset - 1];
        this.#data[key] = old;
    }
};
