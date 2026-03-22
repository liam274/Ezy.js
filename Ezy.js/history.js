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
    /**
     * @param {int} offset - the element that you'd like to rollback **TO**. Count from 1
     * @returns {boolean} Show if success or not
     */
    rollback(offset) {
        if (offset >= this.#history.length) {
            throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Offset(${offset}) out of range`);
        }
        if (offset === 0) {
            return false;
        }
        this.#history.length -= offset - 1;
        const { key, old } = this.#history.at(-1);
        this.#data[key] = old;
        return true;
    }
    /**
     * @param {int} offset the element that you'd like peacefully rollback **TO**. Count from 1
     */
    peacefulRollback(offset) {
        if (offset >= this.#history.length) {
            throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Offset(${offset}) out of range`);
        }
        const { key, old } = this.#history.at(-offset);
        this.#data[key] = old;
    }
};
