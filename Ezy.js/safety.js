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
    white = new Set(white.map(_ => _.endsWith(":") ? _ : _ + ":"));
    const trimmed = url.trim().toLowerCase(),
        dangerous = new RegExp(`^\\s*(${[...dangerousProtocol].filter(_ => !white.has(_)).join("|")})\\s*:`);
    try {
        const parsed = new URL(trimmed, window.location.href),
            protocol = parsed.protocol;
        if (whiteProtocol.has(protocol) || white.has(protocol)) {
            return true;
        }
        return false;
    } catch (_) {
        if (dangerous.test(trimmed)) {
            return false;
        }
        return true;
    }
}
