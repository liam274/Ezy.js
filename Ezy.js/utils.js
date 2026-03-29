/* eslint-disable no-undef */
/* eslint-disable indent */

import { $$ } from "./main.js";

export const UPPERCASE_REGEX = /[A-Z]/g,
    ALPHABET_REGEX = /^[a-zA-Z]+$/,
    EMAIL_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
    DATE_REGEX = /^(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2([0-9]{2})?[0-9]{2}$/;
/**
 * Change camelcase to array
 * @param {String} data - Input a string that's in camel case
 * @returns {string[]} Output a string array that split via uppercases
 */
export const camel2array = (data) => data.replace(UPPERCASE_REGEX, "-$&").toLowerCase().split("-");

/**
 * Apply style to element
 * @param {Node} el - Element that needs to apply style
 * @param {object} styles - Styles that needs to be applied
 * @returns null
 */
export function applyStyles(el, styles) {
    if (!(styles && typeof styles === "object")) {
        return;
    }
    for (const prop of Object.keys(styles)) {
        el.style.setProperty(camel2array(prop).join("-"), styles[prop]);
    }
}

/**
 * Remove every child of an element
 * @param {Node} el - Element
 * @returns {boolean}
 */
export function removeChild(el) {
    if (!(el instanceof Node)) {
        return false;
    }
    while (el.firstChild) {
        el.firstChild.remove();
    }
    return true;
}
/**
 * Join array to camelcase
 * @param {string[]} data
 * @returns {string}
 */
export function array2camel(data) {
    const result = [];
    let sec,
        first = false;
    for (const i of data) {
        sec = true;
        for (const char of i) {
            result.push(sec && first ? char.toUpperCase() : char);
            sec = false;
        }
        first = true;
    }
    return result.join("");
}

/**
 * remove prefix
 * @param {string} str
 * @param {string} prefix
 * @returns string
 */
export function removePrefix(str, prefix) {
    return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}

/**
 *
 * @param {Node} node
 * @returns boolean
 */
export function isDocumentFragment(node) {
    return node && node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}

/**
 * Simple pack
 * @param {any} value
 * @param {any} _default
 * @returns {any}
 */
export function _default(value, _default) {
    if (value === undefined) {
        return _default;
    }
    return value;
}
/**
 * Generate a input that mask with custom masking char
 * @param {Object<string,string>} param0
 * @returns {Object<string,Node|function>}
 */
export function passworder({ placeholder, mask }) {
    const input = $$("input");
    input.placeholder = placeholder;
    mask = (mask && mask[0]) || "*";

    const val = [];

    function updateDisplayAndCursor(newCursorPos) {
        input.value = mask.repeat(val.length);
        input.setSelectionRange(newCursorPos, newCursorPos);
    }

    function handler(e) {
        const start = e.target.selectionStart,
            end = e.target.selectionEnd,
            data = e.data,
            inputType = e.inputType;

        e.preventDefault();
        if (start !== end) {
            val.splice(start, end - start);
        }
        if (inputType.startsWith("insert")) {
            if (data) {
                val.splice(start, 0, ...data.split(""));
                const newCursor = start + data.length;
                updateDisplayAndCursor(newCursor);
            } else {
                updateDisplayAndCursor(start);
            }
        } else if (inputType.startsWith("delete")) {
            if (start === end) {
                if (inputType === "deleteContentBackward" && start > 0) {
                    val.splice(start - 1, 1);
                    updateDisplayAndCursor(start - 1);
                } else if (inputType === "deleteContentForward" && start < val.length) {
                    val.splice(start, 1);
                    updateDisplayAndCursor(start);
                } else {
                    updateDisplayAndCursor(start);
                }
            } else {
                updateDisplayAndCursor(start);
            }
        } else {
            updateDisplayAndCursor(start);
        }
    }
    function copyHandler(e) {
        e.preventDefault();
        const start = e.target.selectionStart,
            end = e.target.selectionEnd;
        if (start !== null && end !== null && start !== end) {
            e.clipboardData.setData("text/plain", val.slice(start, end).join(""));
        }
    }
    function cutHandler(e) {
        e.preventDefault();
        const start = e.target.selectionStart,
            end = e.target.selectionEnd;
        if (start !== null && end !== null && start !== end) {
            e.clipboardData.setData("text/plain", val.splice(start, end - start).join(""));
            updateDisplayAndCursor(start);
        }
    }

    input.addEventListener("beforeinput", handler);
    input.addEventListener("copy", copyHandler);
    input.addEventListener("cut", cutHandler);
    input.addEventListener("dragstart", (e) => {
        e.preventDefault();
        return false;
    });

    return {
        input,
        bind: () => val.join(""),
        deletor: () => {
            input.removeEventListener("beforeinput", handler);
            input.removeEventListener("copy", copyHandler);
            input.removeEventListener("cut", cutHandler);
        }
    };
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
export function isFragment(node) {
    return node && node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
/**
 * Check if A is subset of B
 * @param {Array} A
 * @param {Array} B
 * @returns {boolean}
 */
export function isSubset(A, B) {
    B = new Set(B);
    return A.every(i => B.has(i));
}
/**
 * @param {Array|Object} obj
 * @param {*} val
 * @returns {boolean|[any,string]}
 */
export function searchValue(obj, val) {
    for (const k in obj) {
        if (obj[k] === val) {
            return [k, val];
        }
    }
    return false;
}

/**
 * @param {string} string
 * @param {string[]} trimmer
 */
export function trimEnd(string, trimmer) {
    const result = [];
    trimmer = new Set(trimmer);
    let con = true;
    for (const char of [...string].toReversed()) {
        if (trimmer.has(char)) {
            if (con) {
                continue;
            }
        } else {
            con = false;
        }
        result.push(char);
    }
    return result.toReversed().join("");
}

/**
 * @param {any[]} interable
 * @returns {any[]}
 */
export function deDuplicate(iterable) {
    return [...new Set(iterable)];
}

/**
 * @param {string} string
 * @param {string[]} arr
 * @returns {boolean}
 */
export function endsWith(string, arr) {
    for (const i of arr) {
        if (string.endsWith(i)) {
            return true;
        }
    }
    return false;
}
/**
 * @param {string} data
 * @param {string[]} prefixes
 * @returns {string}
 */
export function removePrefixs(data, prefixes) {
    for (const prefix of prefixes) {
        data = removePrefix(data, prefix);
    }
    return data;
}

/**
 * @param {string} string
 * @param {string} trimmer
 */
export function trimStart(string, trimmer) {
    const result = [];
    trimmer = new Set(trimmer);
    let con = true;
    for (const char of string) {
        if (trimmer.has(char)) {
            if (con) {
                continue;
            }
        } else {
            con = false;
        }
        result.push(char);
    }
    return result.join("");
}
/**
 * @param {string} data
 * @param {Object<string,Object<string,any>>} dictonary
 * @returns {string}
 */
export function replaceSuffix(data, dictonary) {
    for (const key in dictonary) {
        const val = dictonary[key];
        if (data.endsWith(key)) {
            if (val.data) {
                return data.slice(0, -key.length) + val.data;
            } else if (val.manager) {
                return val.manager(data);
            }
        }
    }
    return data;
}

/**
 * @returns {Promise}
 */
export function yieldProcess() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}
export const MAX_ITER = 10;

/**
 * You must Proxy the returned Object, since its attribute will change as the user inputs.
 * @param {Node} el
 * @param {Object<string,any>} data
 * @param {int} limit - How many items should it shows
 * @param {function(any):void} handler
 * @returns {Object<string,function():void|Node>}
 */
export function searchBar(el, data, limit, handler) {
    const datas = {},
        result = $$("div"),
        item = {},
        d = async () => {
            const val = (el.value || el.innerHTML);
            for (const i in datas) {
                if (i.includes(val)) {
                    datas[i].show = true;
                } else {
                    datas[i].show = false;
                }
            }
            await yieldProcess();
            item.item = await updateSearchResult(result, limit, datas, val, handler);
        };
    for (const key in data) {
        datas[key] = {
            value: data[key],
            show: true
        };
    }
    el.addEventListener("input", d);
    item.el = result;
    item.clean = () => {
        el.removeEventListener("input", d);
        result.remove();
    };
    return item;
}
/**
 * @param {Node} el
 * @param {int} limit
 * @param {Object<string,Object<>>} datas
 * @param {string} query
 * @param {function(any):void} handler
 * @returns {Object<string,string|function>}
 */
export async function updateSearchResult(el, limit, datas, query, handler) {
    removeChild(el);
    let t = 0;
    const result = {},
        frag = document.createDocumentFragment(),
        alls = [];
    for (const i in datas) {
        const val = datas[i];
        if (val.show) {
            if (t % MAX_ITER === 0) {
                await yieldProcess();
            }
            if (t > limit) {
                const more = $$("div");
                more.classList.add("search-item");
                if (more.setHTML) {
                    more.setHTML(`More information about ${query}...`);
                } else {
                    more.textContent = `More information about ${query}...`;
                }
                const d = () => {
                    const _ = $$("div");
                    _.classList.add("search-content");
                    const { clean } = updateSearchResult(_, Infinity, datas, query, handler);
                    result.clean();
                    more.removeEventListener("click", d);
                    result.more = {
                        el: _,
                        clean
                    };
                };
                more.addEventListener("click", d);
                alls.push([more, d]);
                frag.appendChild(more);
                break;
            } else {
                const item = $$("div");
                item.classList.add("search-item");
                if (item.setHTML) {
                    item.setHTML(val.value);
                } else {
                    item.textContent = val;
                }
                const d = () => {
                    handler(item.innerHTML);
                };
                item.addEventListener("click", d);
                alls.push([item, d]);
                frag.appendChild(item);
            }
            t++;
        }
    }
    el.appendChild(frag);
    result.clean = () => {
        for (const [element, handler] of alls) {
            element.removeEventListener("click", handler);
        }
        result.more.clean?.();
        removeChild(el);
    };
    return result;
}
