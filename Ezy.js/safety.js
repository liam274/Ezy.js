export const safeObject = Object.freeze({
    hasOwn: Object.hasOwn,
    hasOwnProperty: Object.prototype.hasOwnProperty,
    entries: Object.entries,
    fromEntries: Object.fromEntries
});
/* eslint-disable no-undef */
import { log } from "./main.js";
export function selfXSSwarn() {
    log("%c⚠️ STOP! NEVER PASTE CODE HERE ⚠️", "color: red; font-size: 30px; font-weight: bold;");
    log("%cPasting unknown code into the console can give attackers full access to your account.", "font-size: 20px");
}

export const
    dangerousAttribute = new Set(
        [
            "src", "href", "action", "formaction", "data",
            "background", "poster", "cite", "longdesc",
            "usemap", "manifest", "ping"
        ]
    ),
    whiteProtocol = new Set([
        "http:", "https:", "mailto:", "tel:", "ftp:"
    ]),
    dangerousProtocol = new Set([
        "javascript", "data", "vbscript", "about"
    ]);

/**
 * @sideeffects This function has no side effect.
 * @param {string} url
 * @param {string[]} white - to allow protocol(Both remove the element from black list and add it in white list)
 * @returns {boolean}
 */
export function isSafeURL(url, white = []) {
    if (!url) {
        return true;
    }
    white = new Set([...white].map(_ => _.endsWith(":") ? _ : _ + ":"));// Ensure it's an array.
    const trimmed = url.trim().toLowerCase(),
        dangerous = new RegExp(`^\\s*(${[...dangerousProtocol].filter(_ => !white.has(_)).join("|")})\\s*:`);
    try {
        const parsed = new URL(trimmed, window.location.href),
            protocol = parsed.protocol;
        if (whiteProtocol.has(protocol) || white.has(protocol)) {
            return true;
        }
        return false;
    } catch {
        if (dangerous.test(trimmed)) {
            return false;
        }
        return true;
    }
}

const HTMLescapes = Object.freeze({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
});
/**
 * escape html special chars
 * @param {string} data
 * @returns {string}
 */
export function htmlEscape(data) {
    return data.replace(/[&<>"']/g, char => HTMLescapes[char]);
}

/**
 * Append builtin csp setting.
 */
export function builtinCSP() {
    const csp = $$("meta");
    document.head.appendChild(csp);
    csp.setAttribute("http-equiv", "Content-Security-Policy");
    csp.setAttribute("content",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data:; " +
        "worker-src 'self'; " +
        "connect-src 'self'; " +
        "font-src 'self';" +
        "frame-src 'none';"
    );
}

/**
 * Get the value of a property(if it's not polluted), checking for prototype pollution.
 * @param {Object<string,any>} obj
 * @param {string} param
 * @param {boolean} silence
 * @returns {any}
 */
export function getPropertySafe(obj, param, silence = true) {
    if (safeObject.hasOwn && safeObject.hasOwn(obj, param)) {
        return obj[param];
    }
    if (safeObject.hasOwnProperty.call(obj, param)) {
        return obj[param];
    }
    if (param in obj) {
        if (silence) {
            return undefined;
        }
        throw new Error(`[ezy.js] CRITICAL ERROR: Security Error: Error occured when getting property "${param}", found polluted.`);
    } else {
        return undefined;
    }
}

/**
 * @param {Object<string,any>} obj
 */
export function createSafeObject(obj) {
    if (obj.prototype) {
        Object.freeze(obj.prototype);
    }
    return new Proxy(obj, {
        get(target, key) {
            return getPropertySafe(target, key, true);
        },
        has(target, key) {
            return !!(safeObject.hasOwn?.(target, key) || safeObject.hasOwnProperty.call(target, key));
        },
        ownKeys(target) {
            const result = [];
            for (const key in target) {
                if (getPropertySafe(target, key)) {
                    result.push(target[key]);
                }
            }
            return result;
        }
    });
}

export function createBlankObject() {
    return Object.create(null);
}
