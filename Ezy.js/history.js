/**
 * Version Controller. This class assumes that it has its own proporties.
 * @template type
 */
export default class History {
    #history = [];
    #data = undefined;
    /**
     * @param {type} data
     * @param {(function(any):any)[]} methods
     */
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
    /**
     * Commit a value
     * @param {string} key
     * @param {any} value
     */
    commit(key, value) {
        const snapshot = Object.freeze({
            old: this.#data[key],
            key
        });
        this.#history.push(snapshot);
        this.#data[key] = value;
    }
    /**
     * @param {string} key
     * @returns {any}
     */
    read(key) {
        return this.#data[key];
    }
    /**
     * @param {int} offset - the element that you'd like to rollback **TO**. Count from 1
     * @returns {Readonly<{old: any;key: string;}>} Show if success or not
     */
    rollback(offset) {
        if (offset >= this.#history.length) {
            throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Offset(${offset}) out of range`);
        }
        if (offset === 0) {
            return Object.freeze({});
        }
        const snapshot = { old: this.#data[this.#history.at(-offset).key], key: this.#history.at(-offset).key };
        this.#history.length -= offset - 1;
        const { key, old } = this.#history.at(-1);
        this.#data[key] = old;
        return snapshot;
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
