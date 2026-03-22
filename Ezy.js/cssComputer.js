/* eslint-disable no-undef */

import * as utils from "./utils.js";

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
    shadow: "box-shadow",
    pt: "padding-top",
    pb: "padding-bottom",
    pl: "padding-left",
    pr: "padding-right"
};

function manageCSSAlias(data) {
    const result = [];
    for (const part of data) {
        result.push(alias[part] || part);
    }
    return result;
}

/**
 * @param {string[]} data
 * @returns {[string[],string[]]}
 */
function cssFix(data) {
    const n3w = [data[0]];
    data = data.slice(1);
    let support = false;
    while (data.length > 0) {
        if (CSS.supports(n3w.join("-"), utils.trimEnd(data.join(" "), "!"))) {
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
            const a = value.join(" ");
            result[_class] = {
                value: a.endsWith("!") ? a.slice(0, -1) + " !important" : a,
                key: key.join("-"),
                theme: conditions.slice(0, -1)
            };
        }
    }
    return result;
}

export const specializeTheme = new Set(["hover", "active", "focus", "defined", "heading", "open", "popover-open", "modal",
    "fullscreen", "picture-in-picture", "enabled", "disabled", "read-only", "read-write", "placeholder-shown", "autofill",
    "default", "checked", "indeterminate", "blank", "valid", "invalid", "in-range", "out-of-range", "required", "optional",
    "user-valid", "any-link", "link", "visited", "local-link", "target", "scope", "playing", "paused", "seeking", "buffering",
    "stalled", "muted", "volume-locked", "current", "past", "future", "root", "empty", "first-child", "last-child", "only-child",
    "first-of-type", "last-of-type", "only-of-type", "host", "has-slotted", "focus-visible", "focus-within", "target-current",
    "left", "right", "first", "blank", "active-view-transition"
]);

export function specializeCSS(themes, key, value) {
    const result = [];
    for (const theme of themes) {
        if (specializeTheme.has(theme)) {
            result.push(theme);
        }
    }
    if (result.length) {
        return `&:${utils.deDuplicate(result).join(":")}{${key}: ${specializeCSSValue(key, value)};}`;
    }
    return `${key}: ${specializeCSSValue(key, value)};`;
}

const compileCSSValue = {
    scale(a) {
        return a / 10;
    },
    opacity(a) {
        return a / 100;
    }
};

/**
 * @param {string} key
 * @param {string} value
 */
export function specializeCSSValue(key, value) {
    if (compileCSSValue[key]) {
        return compileCSSValue[key](value);
    }
    return value;
}

/**
 * @param {string[]} themes
 * @param {string} data
 */
export function themeSetter(themes, data) {
    const theme = [];
    for (const t of utils.deDuplicate(themes)) {
        if (!specializeTheme.has(t)) {
            theme.push(t);
        }
    }
    if (theme.length === 0) {
        return data;
    }
    const result = [];
    for (const t of theme) {
        result.push(`[data-theme~="${CSS.escape(t)}"]`);
    }
    return result.join("") + " " + data;
}
