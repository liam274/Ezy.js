/* eslint-disable no-undef */
/* eslint-disable indent */

export const log = console.log,
    $ = document.querySelector.bind(document),
    $$ = document.createElement.bind(document),
    error = console.error.bind(console),
    warn = console.warn.bind(console);

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
 */
export function removeChild(el) {
    while (el.firstChild) {
        el.firstChild.remove();
    }
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
 * escape html special chars
 * @param {string} data
 * @returns {string}
 */
export function htmlEscape(data) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    };
    return data.replace(/[&<>"']/g, char => map[char]);
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

const alias = {
    bg: "background",
    mid: "middle",
    img: "image",
    btn: "button",
    col: "column",
    h: "height",
    w: "width",
    clr: "color",
    p: "padding",
    shadow: "box-shadow"
};

function manageCSSAlias(data) {
    const result = [];
    for (const part of data) {
        result.push(alias[part] || part);
    }
    return result;
}

function cssFix(data) {
    const n3w = [data[0]];
    data = data.slice(1);
    let support = false;
    while (data.length > 0) {
        if (CSS.supports(n3w.join("-"), data.join(" "))) {
            support = true;
        } else if (support) {
            data.push(n3w[n3w.length - 1]);
            return [n3w.slice(0, n3w.length - 1), data];
        }
        n3w.push(data[0]);
        data = data.slice(1);
    }
    if (support) {
        data.push(n3w[n3w.length - 1]);
        return [n3w.slice(0, n3w.length - 1), data];
    }
    return [null, null];
}

/**
 * style-class self implement. Note that the implement is different from Tailwind!
 * @param {string[]} classes
 * @returns {Object<string,Object<string,string>> | void}
 */
export function cssCompiler(classes, condition = []) {
    if (!Array.isArray(classes)) {
        throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Expected classes as string[], found ${typeof classes}`);
    }
    if (!Array.isArray(condition)) {
        throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Expected condition as string[], found ${typeof condition}`);
    }
    const result = {};
    for (const _class of classes) {
        if (typeof _class !== "string") {
            throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Expected classes as string[], found ${typeof _class} as element`);
        }
        const conditions = _class.split(":"),
            lis = conditions.at(-1).split("-"),
            [key, value] = cssFix(manageCSSAlias(lis));
        if (value !== null) {
            result[_class] = {
                value: value.join(" "),
                key: key.join("-"),
                theme: conditions.slice(0, -1),
                originNam: conditions.at(-1)
            };
        }
    }
    return result;
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

export function searchValue(obj, val) {
    for (const k in obj) {
        if (obj[k] === val) {
            return [k, val];
        }
    }
    return false;
}
