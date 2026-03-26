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
    pr: "padding-right",
    m: "margin",
    mt: "margin-top",
    mb: "margin-bottom",
    ml: "margin-left",
    mr: "margin-right",
    uppercase: "text-transform-uppercase",
    lowercase: "text-transform-lowercase",
    ltr: "direction-ltr",
    rtl: "direction-rtl",
    shrink: "flex-shrink",
    grow: "flex-grow",
    full: "100%",
    fw: "font-weight"
};

function manageCSSAlias(data) {
    const result = [];
    for (const part of data) {
        result.push(alias[part] || part);
    }
    return result.join("-").split("-");
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
        if (CSS.supports(n3w.join("-"), format(n3w.join("-"), data.join(" ")))) {
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

const formatters = new Set([
    "animation-iteration-count", "columns", "counter-increment", "counter-reset",
    "flex", "flex-grow", "flex-shrink", "font-weight", "grid-column",
    "grid-column-end", "grid-column-start", "grid-row", "grid-row-end", "grid-row-start",
    "line-height", "opacity", "order", "orphans", "tab-size", "widows", "z-index",
    "scale", "font-size-adjust", "counter-set", "zoom", "fill-opacity", "stroke-opacity",
    "stroke-miterlimit", "shape-image-threshold", "column-count", "grid-auto-columns",
    "background-color", "color"
]);

/**
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */
function format(attribute, value) {
    if (formatters.has(attribute)) {
        return value;
    }
    const result = [];
    for (const i of value.split(" ")) {
        if (utils.endsWith(i, "0123456789")) {
            result.push(i + "px");
        } else {
            result.push(i);
        }
    }
    return result.join(" ");
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
        let important = false;
        const conditions = _class.split(":"),
            lis = conditions.at(-1),
            [key, value] = cssFix(manageCSSAlias(
                utils.replaceSuffix(lis,
                    {
                        "$": {
                            manager(data) {
                                return data.replace(/\$([^$]+)\$/g, (_, content) => {
                                    return precentage2hex(parseInt(content));
                                });
                            }
                        },
                        "!": {
                            manager(data) {
                                important = true;
                                return data.slice(0, -1);
                            }
                        }
                    }
                ).split("-")
            )
            );
        if (value !== null) {
            result[_class] = {
                value: utils.replaceSuffix(
                    format(key.join("-"), value.join(" ")) + (important ? "!" : ""),
                    {
                        "!": {
                            data: " !important"
                        }
                    }
                ),
                key: key.join("-"),
                theme: conditions.slice(0, -1)
            };
        }
    }
    return result;
}

const
    specializeTheme = new Set(
        [
            "hover", "active", "focus", "defined", "heading", "open", "popover-open", "modal", "fullscreen", "picture-in-picture",
            "enabled", "disabled", "read-only", "read-write", "placeholder-shown", "autofill", "default", "checked", "indeterminate",
            "blank", "valid", "invalid", "in-range", "out-of-range", "required", "optional", "user-valid", "any-link", "link", "visited",
            "local-link", "target", "scope", "playing", "paused", "seeking", "buffering", "stalled", "muted", "volume-locked", "current",
            "past", "future", "root", "empty", "first-child", "last-child", "only-child", "first-of-type", "last-of-type", "only-of-type",
            "host", "has-slotted", "focus-visible", "focus-within", "target-current", "left", "right", "first", "blank",
            "active-view-transition", "dir", "active-view-transition-type", "has", "host-context", "host", "is", "lang", "not", "nth-child",
            "nth-last-child", "nth-last-of-type", "nth-of-type", "state", "where"
        ]
    ),
    pseudoElement = new Set([
        "after", "backdrop", "before", "checkmark", "column", "cue", "details-content", "file-selector-button", "first-letter",
        "first-line", "grammar-error", "highlight", "marker", "part", "picker-icon", "picker", "placholder", "scroll-button",
        "scroll-marker", "scroll-marker-group", "search-text", "selection", "slotted", "spelling-error", "target-text",
        "view-transition", "view-transition-group", "view-transition-image-pair", "view-transition-new", "view-transition-old"
    ]);
/**
 * @param {string[]} themes
 * @param {string} key
 * @param {string} value
 * @returns {string}
 */
export function specializeCSS(themes, key, value) {
    const result = [];
    let r = "";
    for (const th of themes) {
        const theme = th.split("[");
        if (pseudoElement.has(theme[0])) {
            result.push((theme.at(-1).endsWith("]") ? `${theme[0]}(${theme.slice(1).join("[").slice(0, -1)})` : theme[0]));
        }
    }
    if (result.length) {
        r = `::${utils.deDuplicate(result).join("::")}`;
    }
    result.length = 0;
    for (const th of themes) {
        const theme = th.split("[");
        if (specializeTheme.has(theme[0])) {
            result.push(theme.at(-1).endsWith("]") ? `${utils.removePrefixs(theme[0], ["iin-"])}(${theme.slice(1).join("[").slice(0, -1)})` : theme[0]);
        }
    }
    if (result.length) {
        r += `:${utils.deDuplicate(result).join(":")}`;
    }
    if (r.length) {
        return `&${r}{${key}: ${specializeCSSValue(key, value)};}`;
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
    const result = [],
        result2 = [],
        result3 = [];
    for (const t of theme) {
        if (t.startsWith("iin-")) {
            result2.push(utils.trimStart(t, "iin-"));
            continue;
        }
        if (t.startsWith("g-")) {
            result3.push(utils.trimStart(t, "g-").split("-"));
            continue;
        }
        result.push(`[data-theme~="${CSS.escape(t)}"]`);
    }
    let pre = "";
    if (result2.length) {
        pre = ":where(:" + result2.join(") :where(:") + ") ";
    }
    for (const [cla, ...rest] of result3) {
        pre += `:where(.${CSS.escape(cla)}):${rest.join("-")} `;
    }
    if (result3.length > 1) {
        pre = pre.slice(0, -1);
    }
    return pre + result.join("") + (result.length ? " " : "") + data;
}

/**
 * @param {int} data
 * @param {Object<string,boolean>} options
 * @returns {string}
 */
export function precentage2hex(data, { round = Math.round, prefix = false, uppercase = false } = {}) {
    return ((prefix ? "0x" : "") + round((data % 101) / 100 * 255).toString(16).padStart(2, "0"))[uppercase ? "toUpperCase" : "toLowerCase"]();
}
