/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable indent */
"use strict";

import * as utils from "./utils.js";
import * as storage from "./storage.js";

/*
    @file ezy.js
    by Liam Lei
    Started from 2026.02.11

    Release: 0.1.0 (Stable)

    Acknowledgments:
        - Nathan Wong. Thanks for :
            + him providing his seat, as it's close to the electricity socket
        - Deepseek. Thanks for it to:
            + debug js
            + give out improvement suggestions
            + design btn css
            + give out css concepts and attribute usage
            + improve CLS
            + teach me differrent JS syntax
        - Mr. Steven L. Thanks for him providing:
            + emotional value (Why I'm listing this out is because it's mostly why I decided to continue!)
            + React concept
            + his patience for me writing this project during his lesson
        - https://heroicons.com/ & https://icons.getbootstrap.com/. Thanks for:
            + their icons. I'm bad at art.
        - https://developer.mozilla.org/. Thanks for:
            + many web knowledges
        - lumo. Thanks for it to:
            + debug js
            + give out improvement suggestions
            + teach me differrent JS syntax
*/

export const log = console.log,
    $ = document.querySelector.bind(document),
    $$ = document.createElement.bind(document),
    error = console.error.bind(console),
    warn = console.warn.bind(console);

export const keyword = new Set([
    "type", "component", "tag",
    "events", "style", "varAs",
    "listener", "times", "title",
    "if", "content", "inherit",
    "validate", "expire", "text",
    "forEach", "innerHTML", "config",
    "data", "belt", "isFragment", "evaluate"
]), errors = {
    SECURITY_ERROR: -1,
    STRUCTURE_ERROR: 1,
    ASVAR_REWRITE_ERROR: 2,
    FORMAT_ERROR: 3,
    TEMPLATE_STRUCTURE_ERROR: 4,
    VALUE_ERROR: 5,
    EVAL_ERROR: 6,
    CLASSIFY_ERROR: 7,
    PIPE_ERROR: 8,
    RENDER_ERROR: 9,
    PHARSING_ERROR: 10,
    ID_ERROR: 11,
    TYPE_ERROR: 12,
    VARIABLE_ERROR: 13
};

export const dictionary = {
    time: ["i", "index", "renderIndex"], // maintain counts of independent elements (Which means those who is independent on times duplication)
    key: ["key"],
    item: ["item", "value"]
};

// Ezy
export const body = document.body,
    head = document.head;

export const Ezy = {
    plugins: [],
    /**
     * Add plugins
     * @param {Object} plugin - plugin object
     */
    add(plugin) {
        this.plugins.push(plugin);
    },
    validates: {
        isInt(data) {
            return Number.isInteger(Number(data));
        },
        isAlphabet(data) {
            return utils.ALPHABET_REGEX.test(data);
        },
        isEmail(data) {
            return utils.EMAIL_REGEX.test(data);
        },
        isDate(data) {
            return utils.DATE_REGEX.test(data);
        },
        maxl(data, len) {
            return data.length <= len;
        },
        minl(data, len) {
            return data.length >= len;
        },
        max(data, limit) {
            return data <= limit;
        },
        min(data, limit) {
            return data >= limit;
        },
    },
    validatePipe(obj, { pipe }, traceback) {
        if (!pipe.receive || typeof pipe.receive !== "object") {
            Ezy.formatError(`Error when rendering, expected object[string,function], found ${pipe.receive}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Pipe Error");
            return obj.set(errors.PIPE_ERROR);
        }
        for (const i in pipe.receive) {
            const sobj = pipe.receive[i];
            if (typeof sobj.func !== "function") {
                Ezy.formatError(`Error when piping, expected pipe.receive.*.func as function, found ${typeof sobj.func}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Structure Error");
                return obj.set(errors.STRUCTURE_ERROR);
            }
            if (!Array.isArray(sobj.data)) {
                Ezy.formatError(`Error when piping, expected pipe.receive.*.data as array, found ${typeof sobj.data}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Structure Error");
                return obj.set(errors.STRUCTURE_ERROR);
            }
        }
        if (!pipe.name) {
            Ezy.formatError(`Error when piping, expected pipe.name, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Structure Error");
            return obj.set(errors.STRUCTURE_ERROR);
        }
    },
    validateComponentIf(obj, varage, item, traceback) {
        if (item) {
            if (!varage[item]) {
                Ezy.formatError(`render.#varage[component.if] not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Value Error");
                return obj.set(errors.VALUE_ERROR);
            }
            if (typeof varage[item] !== "function") {
                Ezy.formatError(`expected render.#varage[component.if] as function, found ${typeof varage[item]}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Type Error");
                return obj.set(errors.TYPE_ERROR);
            }
            return !varage[item]();
        }
    },
    validateValidation(obj, el, validate, traceback, parentNode) {
        const { rules, required } = validate;
        if (rules) {
            if (!Array.isArray(rules)) {
                Ezy.formatError(`Error when rendering, expected component.validate as an array, found ${typeof rules}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Type Error");
                return obj.set(errors.TYPE_ERROR);
            }
            if (required) {
                parentNode.addEventListener("submit", function (e) {
                    for (const val of rules) {
                        const [vali, ...parms] = val.split(":");
                        if (Ezy.validates[vali]) {
                            if (!Ezy.validates[vali](el.value, ...parms)) {
                                e.preventDefault();
                                validate?.onCaught();
                            }
                        } else {
                            Ezy.formatError(`Error when rendering, Ezy[component.validate] not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Render Error");
                            return obj.set(errors.RENDER_ERROR);
                        }
                    }
                });
            }
            el.addEventListener("input", function () {
                let r = true;
                for (const val of rules) {
                    const [vali, ...parms] = val.split(":");
                    if (Ezy.validates[vali]) {
                        r = r && Ezy.validates[vali](el.value, ...parms);
                    } else {
                        Ezy.formatError(`Error when rendering, Ezy[component.validate] not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Render Error");
                        return obj.set(errors.RENDER_ERROR);
                    }
                }
                if (r) {
                    el.classList.add("valid");
                    el.classList.remove("invalid");
                    validate?.onValid();
                } else {
                    el.classList.remove("valid");
                    el.classList.add("invalid");
                    validate?.onInvalid();
                }
            });
        }
    },
    /**
     * Flat an array
     * @param {Array} data - High-dimensional arrays
     * @returns {Array} - flatted array
     */
    flat(data) {
        const result = [];
        for (const i of data) {
            if (Array.isArray(i)) {
                result.push(...this.flat(i));
            }
            else {
                result.push(i);
            }
        }
        return result;
    },
    dialog: {
        /**
         * Alert the data
         * @param {Object} data
         */
        alert(data) {
            const barrier = $$("div");
            barrier.classList.add("alert-barrier");
            const back = $$("div");
            back.classList.add("alert-back");
            barrier.appendChild(back);
            const title = $$("div");
            title.classList.add("alert-title");
            title.innerHTML = data.title;
            back.appendChild(title);
            const content = $$("div");
            content.innerHTML = data.content;
            content.classList.add("alert-content");
            back.appendChild(content);
            const confirm = $$("button");
            confirm.innerHTML = "OK";
            confirm.classList.add("alert-button");
            confirm.addEventListener("click", () => {
                utils.removeChild(barrier);
                barrier.remove();
            });
            back.appendChild(confirm);
            body.appendChild(barrier);
        },
        /**
         * Ask for confirm
         * @param {Object<string,function(boolean,...any)|string>} data
         */
        confirm(data) {
            const barrier = $$("div");
            barrier.classList.add("alert-barrier");
            const back = $$("div");
            back.classList.add("alert-back");
            barrier.appendChild(back);
            const title = $$("div");
            title.classList.add("alert-title");
            title.innerHTML = data.title;
            back.appendChild(title);
            const content = $$("div");
            content.innerHTML = data.content;
            content.classList.add("alert-content");
            back.appendChild(content);
            const backk = $$("div"),
                confirm = $$("button"),
                cancel = $$("button");
            backk.classList.add("confirm-btns-container");
            confirm.innerHTML = "OK";
            confirm.classList.add("alert-button");
            confirm.addEventListener("click", () => {
                utils.removeChild(barrier);
                barrier.remove();
                data.func(true, ...(data.props || []));
            });
            backk.appendChild(confirm);
            cancel.innerHTML = "Cancel";
            cancel.classList.add("alert-button");
            cancel.addEventListener("click", () => {
                utils.removeChild(barrier);
                barrier.remove();
                data.func(false, ...(data.props || []));
            });
            backk.appendChild(cancel);
            back.appendChild(backk);
            body.appendChild(barrier);
        },
        input(data) {
            const barrier = $$("div");
            barrier.classList.add("alert-barrier");
            const back = $$("div");
            back.classList.add("alert-back");
            barrier.appendChild(back);
            const title = $$("div");
            title.classList.add("alert-title");
            title.innerHTML = data.title;
            back.appendChild(title);
            const content = $$("div");
            content.innerHTML = data.content;
            content.classList.add("password-content");
            back.appendChild(content);
            const input = $$("input");
            input.placeholder = data.placeholder;
            input.classList.add("alert-input");
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    utils.removeChild(barrier);
                    barrier.remove();
                    data.func(true, input.value, ...(data.props || []));
                }
            });
            content.appendChild(input);
            const backk = $$("div"),
                confirm = $$("button"),
                cancel = $$("button");
            backk.classList.add("confirm-btns-container");
            confirm.innerHTML = "OK";
            confirm.classList.add("alert-button");
            confirm.addEventListener("click", () => {
                utils.removeChild(barrier);
                barrier.remove();
                data.func(true, input.value, ...(data.props || []));
            });
            backk.appendChild(confirm);
            cancel.innerHTML = "Cancel";
            cancel.classList.add("alert-button");
            cancel.addEventListener("click", () => {
                utils.removeChild(barrier);
                barrier.remove();
                data.func(false, input.value, ...(data.props || []));
            });
            backk.appendChild(cancel);
            back.appendChild(backk);
            body.appendChild(barrier);
            input.focus();
        },
        password(data) {
            const barrier = $$("div");
            barrier.classList.add("alert-barrier");
            const back = $$("div");
            back.classList.add("alert-back");
            barrier.appendChild(back);
            const title = $$("div");
            title.classList.add("alert-title");
            title.innerHTML = data.title;
            back.appendChild(title);
            const content = $$("div");
            content.innerHTML = data.content;
            content.classList.add("password-content");
            back.appendChild(content);
            const { input, bind, deletor } = utils.passworder(data);
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    utils.removeChild(barrier);
                    barrier.remove();
                    data.func(true, bind(), ...(data.props || []));
                    deletor();
                }
            });
            input.classList.add("alert-input");
            content.appendChild(input);
            const backk = $$("div"),
                confirm = $$("button"),
                cancel = $$("button");
            backk.classList.add("confirm-btns-container");
            confirm.innerHTML = "OK";
            confirm.classList.add("alert-button");
            confirm.addEventListener("click", () => {
                utils.removeChild(barrier);
                barrier.remove();
                data.func(true, bind(), ...(data.props || []));
                barrier.remove();
            });
            backk.appendChild(confirm);
            cancel.innerHTML = "Cancel";
            cancel.classList.add("alert-button");
            cancel.addEventListener("click", () => {
                utils.removeChild(barrier);
                barrier.remove();
                data.func(false, bind(), ...(data.props || []));
                barrier.remove();
            });
            backk.appendChild(cancel);
            back.appendChild(backk);
            body.appendChild(barrier);
            input.focus();
        },
    },
    /**
     * format error message. ***CALLING THIS FUNCTION IS NOT SUGGEGSTED***
     * @param {string} message
     * @param {number} level
     * @param {string} error
     */
    formatError(message, level, _error) {
        error(`[ezy.js] ${Ezy.errors[level]}: ${_error.toUpperCase()}: ${message}`);
    },
    /**
     * Public Classify
     * @param {string} name - Classify Name
     * @param {Object} def - Component Object
     */
    component(name, def) {
        if (typeof name !== "string") {
            throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Expected Ezy.component(name: string, def: Object), found name as ${typeof name}`);
        }
        if (typeof def !== "object") {
            throw new Error(`[ezy.js] CRITICAL ERROR: Value Error: Expected Ezy.component(name: string, def: Object), found def as ${typeof def}`);
        }
        this.components[name] = def;
    },
    components: {},
    /**
     *
     * @param {string} data
     * @param {object} set
     * @returns {Proxy}
     */
    watchout(data, set) {
        return new Proxy(
            data, {
            set(target, key, value) {
                set.early?.(target, key, value);
                target[key] = value;
                set.late?.(target, key, value);
                return true;
            }
        }
        );
    }
};

export const errorLevels = Object.freeze(
    {
        CRITICAL_ERROR: 2,
        MAJOR_ERROR: 1,
        MINOR_ERROR: 0
    }
);

Ezy.errors = ["MINOR ERROR", "MAJOR ERROR", "CRITICAL ERROR"];

// Route Guard

export const routeGuard = {
    builtin: new Set([]),
    guards: []
};
routeGuard.guards.push(function (href) {
    return {
        allow: routeGuard.builtin.has(href)
    };
});
/**
 * Use routeGuard.guards to check whether should redirect or not
 * @param {string} href - destination
 */
Ezy.navigate = function (href) {
    let full = true;
    for (const guard of routeGuard.guards) {
        const result = guard(href);
        if (!result.allow) {
            if (result.href) {
                location.href = result.href;
                return;
            }
            full = false;
        }
    }
    if (full) {
        location.href = href;
    }
};
// render

const varage = {},// variable storage (?cold joke)
    vars = new Set(),// Ensure that third party can use the given name in asVar (name) as variable in JS
    ARGS = {
        classList: (data) => Array.from(data),
        innerHTML: (data) => data,
        id: (data) => data,
        style: (data) => {
            const result = {};
            for (const i in data) {
                if (Ezy.validates.isInt(i)) {
                    const got = utils.array2camel(data[i].split("-"));
                    result[got] = data[got];
                }
            }
            return { ...result };
        },
        title: (data) => data,
        events: (data) => {
            return { ...data };
        }
    };
export const MAXWAIT = 60000,
    HTTP_NOT_FOUND = 404,
    HTTP_TIMEOUT = 408,
    SECOND = 1000;

export const store = new storage.store();

export class render {
    #varage = {};
    #frameID = undefined;
    #builds = [];
    #oldBoys = {};
    #typeExtend = {};
    #listen2 = {};
    #debug = false;
    #pluginLeftovers = {
        timeouts: [],
        events: [],
        animationFrames: []
    };
    #confirmer = undefined;
    #reporter = undefined;
    /**
     * The constructor of class *render*
     * @param {Node} el - The main element that act as root
     * @param {Object} data - The data that used to render
     * @param {Number} maxWait - how much to wait for parm data to be definded
     * @param {Object} namespace - historical issues, just avoid it
     * @returns {render}
     */
    constructor(el, data, maxWait = MAXWAIT, namespace = {}) {
        this.maxWait = maxWait;
        this.data = data;
        this.mains = [];
        this.pipes = {};
        this.vdom = {
            children: [],
            dataset: {}
        };
        this.loadPage = [];
        if (!data) {
            this.set(errors.STRUCTURE_ERROR);
            this.loadPage.push(this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure missing.", HTTP_NOT_FOUND, this.maxWait));
            return this;
        }
        if (data.classify) {
            this.classify = data.classify;
        }
        if (!data.component) {
            this.set(errors.STRUCTURE_ERROR);
            this.loadPage.push(this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure attribute \"component\" missing.", HTTP_NOT_FOUND,
                this.maxWait, "Resource page.data.component not found"));
            return this;
        }
        this.namespace = namespace;
        if (typeof el === "string") {
            this.mainEl = $(el);
        }
        else {
            this.mainEl = el;
        }
        {
            for (const i in ARGS) {
                this.vdom[i] = ARGS[i](this.mainEl[i]);
            }
            this.vdom.tag = this.mainEl.tagName;
            this.vdom.dataset = { ...this.vdom.dataset, ...this.mainEl.dataset };
            this.vdom.config = { ...this.config };
        }
        this.original = this.mainEl.innerHTML;
        this.reload();
        if (this.statusCode !== 0) {
            return this;
        }
    }
    /**
     * reload the entire page. ***PLEASE CHECK THE STATUS CODE***
     * @returns null
     */
    reload() {
        this.config = this.data.config || {};
        // clean-up section start
        if (this.config.debug) {
            this.#debug = true;
        } else {
            this.#debug = false;
        }
        if (!this.#debug) {
            console.clear();
        }
        if (this.#frameID) {
            cancelAnimationFrame(this.#frameID);
        }
        if (this.loadPage.length) {
            for (const i of this.loadPage) {
                this.clearLoading(i);
            }
            this.loadPage.length = 0;
        }
        for (const i of this.#pluginLeftovers.timeouts) {
            clearTimeout(i);
        }
        for (const i of this.#pluginLeftovers.events) {
            document.removeEventListener(...i);
        }
        for (const i of this.#pluginLeftovers.animationFrames) {
            cancelAnimationFrame(i);
        }
        // Url filter section
        if (this.config.urlFilter) {
            const { urlFilter } = this.config,
                { confirmer, reporter, rules } = urlFilter;
            if (!this.#confirmer && typeof confirmer === "function") {// Prevent malicious replace
                this.#confirmer = confirmer;
            }
            if (!this.#confirmer) {
                Ezy.formatError("Error when trying to setup URL filter, since data.config.urlFilter.confirmer is not a function, due to security concerns, we disallowed the process.",
                    errorLevels.CRITICAL_ERROR, "Security Error");
                urlFilter.onError?.();
                return this.set(errors.SECURITY_ERROR);
            }
            if (!this.#reporter && typeof reporter === "function") {// Prevent malicious replace
                this.#reporter = reporter;
            }
            if (!this.#reporter) {
                Ezy.formatError("Error when trying to setup URL filter, since data.config.urlFilter.reporter is not a function, due to security concerns, we disallowed the process.",
                    errorLevels.CRITICAL_ERROR, "Security Error");
                urlFilter.onError?.();
                return this.set(errors.SECURITY_ERROR);
            }
            if (!navigator.serviceWorker) {
                Ezy.formatError("Error when trying to setup URL filter, since your browser doesn't support serviceWorker, we cannot provide any service.",
                    errorLevels.CRITICAL_ERROR, "Security Error");
                urlFilter.onError?.();
                return this.set(errors.SECURITY_ERROR);
            }
            if (Array.isArray(rules)) {
                if (this.#confirmer(rules) !== true) {
                    Ezy.formatError("Error when trying to setup URL filter, URL WHITELIST HAS BEEN TAMPERED.", errorLevels.CRITICAL_ERROR, "Security Error");
                    this.#reporter();
                    return this.set(errors.SECURITY_ERROR);
                }
                navigator.serviceWorker.register(new URL("./firewall.js", import.meta.url)).then(() => {
                    if (this.#debug) {
                        log("[ezy.js] URL filter Registered successful.");
                    }
                    return navigator.serviceWorker.ready;
                }).then(reg => {
                    if (navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({
                            type: "UPDATE_RULES",
                            rules: rules
                        });
                    } else if (reg.active) {
                        reg.active.postMessage({
                            type: "UPDATE_RULES",
                            rules: rules
                        });
                    }
                });
            } else {
                Ezy.formatError(`Expected data.config.urlFilter.urls as array, found ${typeof rules}`, errorLevels.CRITICAL_ERROR, "Type Error");
                urlFilter.onError?.();
                return this.set(errors.TYPE_ERROR);
            }
        } else {
            Ezy.formatError("Error when trying to setup page, config.urlFilter not found", errorLevels.CRITICAL_ERROR, "Security Error");
            return this.set(errors.SECURITY_ERROR);
        }
        // clean-up section end
        this.historyRender = +new Date();
        if (!this.data) {
            this.loadPage.push(this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure missing.", HTTP_NOT_FOUND,
                this.maxWait));
            return this.set(errors.STRUCTURE_ERROR);;
        }
        this.loadPage.push(this.loadingPage("[ezy.js] CRITICAL ERROR: Timeout Error: ", HTTP_TIMEOUT, this.maxWait, "Page render timeout"));
        this.clear();
        this.#varage = Ezy.watchout({ ...varage, ...(this.data.data || {}) }, {
            late: (function (_, key) {
                if (key in this.#listen2) {
                    const [obj, el, cleanup, options] = this.#listen2[key];
                    this.#oldBoys = {};
                    if (cleanup) {
                        if (utils._default(options.deep, true)) {
                            cleanup.innerHTML = "";
                        } else {
                            for (const node of [...cleanup.childNodes]) {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    node.remove();
                                }
                            }
                        }
                        this.render(obj, cleanup, options);
                    } else {
                        if (utils._default(options.deep, true)) {
                            el.innerHTML = "";
                        } else {
                            for (const node of [...el.childNodes]) {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    node.remove();
                                }
                            }
                        }
                        this.render(obj, el, options);
                    }
                }
            }).bind(this)
        });
        this.statusCode = 0;
        this.systemPlot = {
            time: 0
        };
        this.mains.length = 0;
        for (const key in this.pipes) {
            delete this.pipes[key];
        }
        this.interval = false;
        if (this.oldTimeout) {
            clearTimeout(this.oldTimeout);
        }
        this.oldTimeout = setTimeout(() => {
            this.interval = true; this.loop();
        }, SECOND - ((this.historyRender) % SECOND));
        if (this.config.style) {
            const s = $$("style"),
                c = [];
            for (const j in this.config.style) {
                const val = this.config.style[j],
                    d = [];
                for (const i in val) {
                    d.push(`${utils.camel2array(i).join("-")}: ${val[i]};`);
                }
                c.push(`${j}{${d.join("")}}`);
            }
            s.innerHTML = c.join("");
            this.#builds.push(s);
            head.appendChild(s);
        }
        if (this.config.typeExtend) {
            for (const i in this.config.typeExtend) {
                const val = this.config.typeExtend[i];
                if (!Array.isArray(val)) {
                    Ezy.formatError(`Expected Array, found ${typeof val}.`, errorLevels.CRITICAL_ERROR, "Type Error");
                    return this.set(errors.TYPE_ERROR);
                }
                this.#typeExtend[i] = [...val];
            }
        }
        this.render(this.data, this.mainEl);
        if (this.#debug) {
            log(`[ezy.js] Debug Message: : Render consumed ${new Date() - this.historyRender} ms`);
        }
    }
    /**
     * render at any node that you'd like to
     * @param {Object} data
     * @param {Node} root - Root element
     * @param {Object} options
     * @returns null
     */
    render(data, root, options = {}) {
        if (!data) {
            this.loadPage.push(this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure missing.", HTTP_NOT_FOUND,
                this.maxWait, "Resource page.data not found", root));
            return this.set(errors.STRUCTURE_ERROR);;
        }
        this.statusCode = 0;
        if (data.onStart) {
            this.preRender(data.onStart);
        } else if (this.#debug) {
            warn("[ezy.js] MAJOR SUGGESTION: : Suggest adding onStart function list to handle preprocess");
        }
        for (const i of Ezy.plugins) {
            const { timeouts, events, animationFrames } = i.onStart?.(data) || {};
            this.#pluginLeftovers.timeouts.push(...timeouts);
            this.#pluginLeftovers.events.push(...events);
            this.#pluginLeftovers.animationFrames.push(...animationFrames);
        }
        const el = document.createDocumentFragment();
        this.vdom.children.push(...this.sectionRender(data, el, data.name || "", data.title || "", this.contentRender, root, options));
        log(`%c[ezy.js] Render Program exits ${this.statusCode === 0 ? "" : "un"}successfully. Status Code: ${this.statusCode}`,
            this.statusCode === 0 ? "font-size: 30px; font-weight: bold;color: #e0e0e0;" : "font-size: 30px; font-weight: bold;color: red;");
        if (data.onLoad) {
            for (const i of data.onLoad) {
                i(data);
            }
        }
        else if (this.#debug) {
            warn("[ezy.js] MINOR SUGGESTION: : Suggest adding onLoad function list to handle onLoad process");
        }
        for (const i of Ezy.plugins) {
            const { timeouts, events, animationFrames } = i.onLoad?.(data) || {};
            this.#pluginLeftovers.timeouts.push(...timeouts);
            this.#pluginLeftovers.events.push(...events);
            this.#pluginLeftovers.animationFrames.push(...animationFrames);
        }
        if (this.statusCode !== 0) {
            return;
        }
        if (el) {
            root.appendChild(el);
        }
        if (this.loadPage.length) {
            for (const i of this.loadPage) {
                this.clearLoading(i);
            }
            this.loadPage.length = 0;
        }
    }
    /**
     * A loop that use requestAnimationFrame to implement. Calling it is not suggested
     */
    loop() {
        for (const i of this.mains) {
            i.func(i.obj, i.el);
        }
        cancelAnimationFrame(this.#frameID);
        if (this.interval) {
            this.#frameID = requestAnimationFrame(this.loop.bind(this));
        }
    }
    /**
     * pipe a message. ***PLEASE CHECK THE STATUS CODE***
     * @param {string} sender - The one who sends
     * @param {string} receiver - The one who recieves
     * @param {Any} data - Data
     * @returns {void}
     */
    pipe2(sender, receiver, data) {
        if (!(sender in this.pipes)) {
            Ezy.formatError(`Error when piping, trying to send message from ${sender}, not found in this.pipes`, errorLevels.CRITICAL_ERROR, "Pipe Error");
            return this.set(errors.PIPE_ERROR);
        }
        if (!(receiver in this.pipes)) {
            Ezy.formatError(`Error when piping, trying to send message to ${receiver}, not found in this.pipes`, errorLevels.CRITICAL_ERROR, "Pipe Error");
            return this.set(errors.PIPE_ERROR);
        }
        if (!(sender in this.pipes[receiver].receive)) {
            Ezy.formatError(`Error when piping, try to receive message from ${sender}, not found in this.pipes.${receiver}.receive`, errorLevels.CRITICAL_ERROR, "Pipe Error");
            return this.set(errors.PIPE_ERROR);
        }
        const obj = this.pipes[receiver].receive[sender];
        obj.func(data, ...(obj.data || []));
    }
    /**
     * edit variables
     * @param {string} key
     * @param {Any} data
     * @returns {boolean}
     */
    edit(key, data) {
        if (this.#varage[key] === data) {
            return false;
        }
        this.#varage[key] = data;
        this.#oldBoys = {};
        return true;
    }
    /**
     * Read variables
     * @param {string} key
     * @returns {Any}
     */
    read(key) {
        if (key in this.#varage) {
            return this.#varage[key];
        }
        else {
            Ezy.formatError(`Variable Error: Variable "${key}" not found`, errorLevels.CRITICAL_ERROR, "Variable Error");
            return this.set(errors.VARIABLE_ERROR);
        }
    }
    /**
     * being called before main render proc. ***CALLING IT IS NOT SUGGESTED***
     * @param {Object} data
     */
    preRender(data) {
        for (const i of data.funcs) {
            i(this.data);
        }
    }
    /**
     * Remove virtual DOM
     * @param {Object} data
     * @param {Object} rootVdom
     * @returns {boolean}
     */
    removeVdom(data, rootVdom = this.vdom) {
        const stack = [rootVdom];
        while (stack.length > 0) {
            const currentNode = stack.pop();
            for (let i = currentNode.children.length - 1; i >= 0; i--) {
                const child = currentNode.children[i];
                if (child === data) {
                    currentNode.children.splice(i, 1);
                    return true;
                }
                if (child && child.children) {
                    stack.push(child);
                }
            }
        }
        return false;
    }
    /**
     * Edit virtual DOM
     * @param {Object} data
     * @param {function(Object, number)} func - The function that will be editing the children. It should recieve
     * @param {Object} vdom
     * @returns {boolean}
     */
    editVdom(data, func, vdom = this.vdom) {
        for (let i = vdom.children.length; i > 0; i--) {
            if (vdom.children[i - 1] === data) {
                func(vdom.children, i - 1);
                return true;
            }
            if (this.editVdom(data, func, vdom.children[i - 1])) {
                return true;
            }
        }
        return false;
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {Object} sectionData
     * @param {Node} parentElement
     * @param {string} sectionName
     * @param {string} title
     * @param {function(string, Object, Object, Object)} createElement
     * @param {Node} root
     * @returns {Object|void}
     */
    sectionRender = (sectionData, parentElement, sectionName, title, createElement, root, options) => {
        const traceback = `${title} -> ${sectionName}`;
        if (!sectionData) {
            Ezy.formatError(`function found first parameter in ${sectionData}, expected object, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Type Error");
            return this.set(errors.TYPE_ERROR);
        }
        const vdom = [];
        this.systemPlot.time = 0;
        for (const i in sectionData.component) {
            const item = sectionData.component[i];
            if (Ezy.validateComponentIf(this, this.#varage, item.if, traceback)) {
                continue;
            }
            if (this.statusCode !== 0) {
                return;
            }
            const temp = createElement(i, item, { ...(sectionData.config || {}), ...(i.config || {}) }, sectionData, parentElement, root, options);
            if (this.statusCode !== 0) {
                return;
            }
            if (!(temp && temp.el && temp.obj)) {
                Ezy.formatError(`argument-function "createElement" return unexpected value, expected {el:Node(or NodeLike object),obj:vdom}, in page ${traceback}`,
                    errorLevels.CRITICAL_ERROR, "Value Error"
                );
                return this.set(errors.VALUE_ERROR);
            }
            const { el, obj } = temp;
            if (!(el instanceof Node)) {
                Ezy.formatError(`argument-function "createElement" return unexpected value, expected {el:Node(or NodeLike object),obj:vdom}, in page ${traceback}`, errorLevels.CRITICAL_ERROR, "Value Error");
                return this.set(errors.VALUE_ERROR);
            }
            parentElement.appendChild(el);
            this.systemPlot.time++;
            vdom.push(...obj);
        }
        return vdom;
    };
    #extendType(...data) {
        const result = [];
        for (const i of data) {
            result.push(...(this.#typeExtend[i] || [i]));
        }
        return result;
    }
    #logic1(card, i, fatherData, fatherElement, first, replacement, traceback, config, temp, root) {
        const [result, organic] = utils.cssCompiler(this.#extendType(...(i.type || []), ...(config.type || [])));
        card.classList.add(...organic);
        utils.applyStyles(card, result);
        if (i.expire) {
            setTimeout((function () {
                card.innerHTML = "";
                card.remove();
                if (i.pipe) {
                    delete this.pipes[i.pipe.name];
                }
                this.removeVdom(temp);
                setTimeout(() => {
                    i.expire.expired?.();
                });
            }).bind(this), i.expire.date - this.historyRender);
        }
        Ezy.validateValidation(this, card, i.validate || "", traceback, fatherElement);
        if (this.statusCode !== 0) {
            return;
        }
        if (i.main) {
            if (typeof i.main !== "function") {
                Ezy.formatError(`Error when rendering, expected component.main attribute as function, found ${typeof i.main}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Render Error");
                return this.set(errors.RENDER_ERROR);
            }
            this.mains.push({
                el: card,
                obj: i,
                func: i.main
            });
        }
        if (i.pipe) {
            Ezy.validatePipe(this, i.pipe, traceback);
            if (this.statusCode !== 0) {
                return;
            }
            this.pipes[i.pipe.name] = i.pipe;
        }
        if (i.data) {
            for (const k in i.data) {
                card.setAttribute(`data-${utils.camel2array(k).join("-")}`, this.preCompileStr(i.data[k], traceback, replacement));
                if (this.statusCode !== 0) {
                    return;
                }
            }
        }
        this.beforePlugComponent(card, traceback);
        if (this.statusCode !== 0) {
            return;
        }
        if (i.belt) {
            const { buckle, reverseBuckle } = i.belt;
            if (buckle) {
                if (!Array.isArray(buckle)) {
                    Ezy.formatError(`Expected component.belt.buckle as string[], found ${typeof buckle}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Type Error");
                    return this.set(errors.TYPE_ERROR);
                }
                for (const _buckle of buckle) {
                    if (_buckle in this.#varage) {
                        this.#listen2[_buckle] = [fatherData, card, root, i.belt.options || {}];
                    } else {
                        Ezy.formatError(`varage variable ${_buckle} not found`, errorLevels.CRITICAL_ERROR, "Variable Error");
                        return this.set(errors.VARIABLE_ERROR);
                    }
                }
            }
            if (reverseBuckle) {
                if (typeof reverseBuckle !== "string") {
                    Ezy.formatError(`Expected component.belt.reverseBuckle as string, found ${typeof reverseBuckle}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Type Error");
                    return this.set(errors.TYPE_ERROR);
                }
                if (!(reverseBuckle in this.#varage)) {
                    Ezy.formatError(`varage variable ${reverseBuckle} not found`, errorLevels.CRITICAL_ERROR, "Variable Error");
                    return this.set(errors.VARIABLE_ERROR);
                }
                card.addEventListener("input", event => {
                    this.edit(reverseBuckle, event.target.value);
                });
            }
        }
        if (first === 0 && i.varAs) {
            this.asVar(card, i.varAs, traceback);
            if (this.statusCode !== 0) {
                return;
            }
        }
        if (i.text) {
            card.title = this.preCompileStr(i.text, traceback, replacement);
        }
        if (i._type) {
            card.type = i._type;
        }
    }
    #logic2(card, i, temp, config, replacement, traceback) {
        utils.applyStyles(card, i.style);
        for (const j in (i.events || {})) {
            this.addListener(j, i, card, traceback);
            if (this.statusCode !== 0) {
                return;
            }
        }
        let r = this.preCompileStr(
            (i.content || ""),
            traceback, replacement
        );
        if (this.statusCode !== 0) {
            return;
        }
        if (this.config.escapeHTML || config.escapeHTML || i.config?.escapeHTML) {
            r = utils.htmlEscape(r);
        }
        card.innerHTML += r;
        for (const j in i) {
            if (keyword.has(j)) {
                continue;
            }
            card.setAttribute(j, this.preCompileStr(i[j], traceback, replacement));
            if (this.statusCode !== 0) {
                return;
            }
            temp[j] = card[j];
        }
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {string} _
     * @param {Object} i
     * @param {Object} config
     * @param {Object} fatherData
     * @param {Node} fatherElement
     * @param {Node} root
     * @param {Object} options
     * @returns {void|Object}
     */
    contentRender = (_, i, config, fatherData, fatherElement, root, options) => {
        options.deep = utils._default(options.deep, true);
        const title = fatherData.title || "",
            traceback = `${title}`,
            vdom = [];
        if (typeof i === "string") {
            if (Object.keys(this.classify || Ezy.components).length === 0) {
                Ezy.formatError(`Error when trying to use classify component without classify dictionary, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Classify Error");
                return this.set(errors.CLASSIFY_ERROR);
            }
            if (!(this.classify?.[i] || Ezy.components?.[i])) {
                Ezy.formatError(`Error when trying to use classify component "${i}" without definition, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Classify Error");
                return this.set(errors.CLASSIFY_ERROR);
            }
            i = this.classify?.[i] || Ezy.components?.[i];
        }
        const todo = document.createDocumentFragment(),
            frag = i.isFragment || false;
        if (i.evaluate && this.#varage[i.evaluate]) {
            const obj = JSON.parse(this.#varage[i.evaluate]);
            for (const key in obj) {
                i[key] = obj[key];
            }
        }
        if (i.forEach) {
            if (this.#varage[i.forEach] === undefined) {
                Ezy.formatError(`Error when rendering, expected forEach variable, not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Render Error");
                return this.set(errors.RENDER_ERROR);
            }
            const obj = this.#varage[i.forEach];
            if (!(obj && typeof obj === "object")) {
                Ezy.formatError(`Error when rendering, expected object as forEach variable value, found ${obj}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Render Error");
                return this.set(errors.RENDER_ERROR);
            }
            let first = -1;
            for (const k in obj) {
                first++;
                const card = (frag ? document.createDocumentFragment() : $$(i.tag || config.tag || "div")),
                    temp = {
                        children: [],
                        dataset: {}
                    },
                    replacement = {
                        ...this.systemPlot, ...(i.inherit || {}), key: k, item: obj[k]
                    };
                if (!frag) {
                    this.#logic1(card, i, fatherData, fatherElement, first, replacement, traceback, config, temp, root);
                    if (this.statusCode !== 0) {
                        return;
                    }
                }
                todo.appendChild(card);
                this.plugComponent(card, traceback);
                if (this.statusCode !== 0) {
                    return;
                }
                if (!frag) {
                    this.#logic2(card, i, temp, config, replacement, traceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                }
                if (options.deep) {
                    temp.children.push(...this.pushComponent(i, utils.isDocumentFragment(card) ? fatherElement : card, traceback, { ...config, ...(i.config || {}) }, replacement));
                }
                if (this.statusCode !== 0) {
                    return;
                }
                if (!frag) {
                    for (const i in ARGS) {
                        temp[i] = ARGS[i](card[i]);
                    }
                    temp.tag = card.tagName;
                    temp.dataset = { ...temp.dataset, ...card.dataset };
                    temp.config = { ...config };
                    vdom.push(temp);
                } else {
                    vdom.push(...temp.children);
                }
            }
        } else {
            for (let k = 0; k < (i.times || 1); k++) {
                const card = (frag ? document.createDocumentFragment() : $$(i.tag || config.tag || "div")),
                    temp = {
                        children: [],
                        dataset: {}
                    };
                if (!frag) {
                    this.#logic1(card, i, fatherData, fatherElement, k, i.inherit || {}, traceback, config, temp, root);
                    if (this.statusCode !== 0) {
                        return;
                    }
                }
                todo.appendChild(card);
                this.plugComponent(card, traceback);
                if (this.statusCode !== 0) {
                    return;
                }
                if (!frag) {
                    this.#logic2(card, i, temp, config, i.inherit || {}, traceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                }
                if (options.deep) {
                    temp.children.push(...this.pushComponent(i, utils.isDocumentFragment(card) ? fatherElement : card, traceback, { ...config, ...(i.config || {}) }, i.inherit));
                }
                if (this.statusCode !== 0) {
                    return;
                }
                if (!frag) {
                    for (const i in ARGS) {
                        temp[i] = ARGS[i](card[i]);
                    }
                    temp.tag = card.tagName;
                    temp.dataset = { ...temp.dataset, ...card.dataset };
                    temp.config = { ...config };
                    vdom.push(temp);
                } else {
                    vdom.push(...temp.children);
                }
            }
        }
        return {
            el: todo,
            obj: vdom
        };
    };
    /**
     * Set status code. ***CALLING IT IS NOT SUGGESTED***, unless you want to control the render flow.
     * @param {number} code
     */
    set(code) {
        this.statusCode = code;
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {string} expr
     * @param {string} traceback
     * @param {Object} extraScope
     * @returns {Any}
     */
    evaluateExpression(expr, traceback, extraScope) {
        expr = expr.trim();
        if (!expr) {
            return "";
        }
        let last = false,
            double = false,
            exist = false;
        for (const i of expr) {
            if (i === "|") {
                exist = true;
                if (last) {
                    double = true;
                    break;
                }
                last = true;
                continue;
            }
            last = false;
            double = false;
        }
        if (!double && exist) {
            const varName = [];
            let first = true,
                result = undefined;
            for (const char of expr) {
                if (char === "|") {
                    let name = varName.join("").trim();
                    if (first) {
                        if (extraScope[name]) {
                            result = extraScope[name];
                        }
                        else {
                            Ezy.formatError(`Error when trying to access variable ${name}, not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Parse Error");
                            return this.set(errors.PHARSING_ERROR);
                        }
                        first = false;
                    } else {
                        name = name.split(":");
                        if (extraScope[name[0]]) {
                            if (typeof extraScope[name[0]] === "function") {
                                result = this.evaluateExpression(`${name[0]}(result, ${name.filter((_, i) => i).join(", ")})`,
                                    traceback, { ...extraScope, result });
                            }
                            else {
                                Ezy.formatError(`Error when parsing, expected filter as function, found ${typeof extraScope[name[0]]}, not found, in ${traceback}`,
                                    errorLevels.CRITICAL_ERROR, "Parse Error");
                                return this.set(errors.PHARSING_ERROR);
                            }
                        }
                        else {
                            Ezy.formatError(`Error when trying to access variable ${name[0]}, not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Parse Error");
                            return this.set(errors.PHARSING_ERROR);
                        }
                    }
                    varName.length = 0;
                } else {
                    varName.push(char);
                }
            }
            let name = varName.join("").trim();
            if (first) {
                if (extraScope[name]) {
                    result = extraScope[name];
                }
                else {
                    Ezy.formatError(`Error when trying to access variable ${name}, not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Parse Error");
                    return this.set(errors.PHARSING_ERROR);
                }
                // eslint-disable-next-line no-useless-assignment
                first = false;
            } else {
                name = name.split(":");
                if (extraScope[name[0]]) {
                    if (typeof extraScope[name[0]] === "function") {
                        result = this.evaluateExpression(`${name[0]}(result, ${name.filter((_, i) => i).join(", ")})`,
                            traceback, { ...extraScope, result });
                    }
                    else {
                        Ezy.formatError(`Error when parsing, expected filter as function, found ${typeof extraScope[name[0]]}, not found, in ${traceback}`,
                            errorLevels.CRITICAL_ERROR, "Parse Error");
                        return this.set(errors.PHARSING_ERROR);
                    }
                }
                else {
                    Ezy.formatError(`Error when trying to access variable ${name[0]}, not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Parse Error");
                    return this.set(errors.PHARSING_ERROR);
                }
            }
            return result;
        }
        const keys = Object.keys(extraScope);
        const values = keys.map(k => extraScope[k]);

        try {
            const fn = new Function(...keys, `return (${expr})`);
            const result = fn(...values);
            return result === undefined ? "" : String(result);
        } catch (e) {
            if (e instanceof ReferenceError) {
                if (this.#debug) {
                    warn(`[ezy.js] Warning: Variable not defined in "${expr}" at ${traceback}`);
                }
                return "";
            }
            Ezy.formatError(`Failed to evaluate "${expr}" in ${traceback}`, errorLevels.CRITICAL_ERROR, "Eval Error");
            error(e);
            this.set(errors.EVAL_ERROR);
            return "";
        }
    }
    #setOldBoys(name, val, bool) {
        if (bool) {
            this.#oldBoys[name] = val;
        } else {
            return val;
        }
    }
    /**
     * Compile string
     * @param {string} data
     * @param {string} traceback
     * @param {Object} replacement
     * @param {Object} pipeData
     * @returns {string|void}
     */
    preCompileStr(data, traceback, replacement = {}, pipeData = {}) {
        if (typeof data !== "string") {
            Ezy.formatError(`Error when trying to parse string, expected string, found ${data}`, errorLevels.CRITICAL_ERROR, "Type Error");
            return this.set(errors.TYPE_ERROR);
        }
        const result = [];
        let skip = false,
            startVar = false,
            longVar = false,
            stop = false,
            doubleStop = false,
            varName = [];
        replacement = { ...this.systemPlot, ...replacement };
        const newReplacement = {},
            _varage = { ...this.#varage, ...pipeData },
            local = {};
        for (const i in replacement) {
            for (const t of (dictionary[i] || [i])) {
                newReplacement[t] = replacement[i];
            }
        }
        for (const i in newReplacement) {
            data = data.replaceAll(`{{${i}}}`, newReplacement[i]);
        }
        for (const i of data) {
            if (skip) {
                if (varName.length) {
                    varName.push(i);
                }
                else {
                    result.push(i);
                }
                skip = false;
                continue;
            }
            if ((stop && !longVar) || (doubleStop && longVar)) {
                varName = varName.join("").trim();
                const _var = stop ? _varage : newReplacement;
                if (varName in this.#oldBoys) {
                    result.push(this.#oldBoys[varName]);
                } else if (varName in local) {
                    result.push(local[varName]);
                } else if (_var[varName]) {
                    if ((typeof _var[varName]) === "function") {
                        const temp = String(_var[varName]());
                        result.push(temp);
                        local[varName] = this.#setOldBoys(varName, temp, stop) || temp;
                    }
                    else {
                        const temp = String(_var[varName]);
                        result.push(temp);
                        local[varName] = this.#setOldBoys(varName, temp, stop) || temp;
                    }
                } else {
                    try {
                        const temp = String(this.evaluateExpression(varName, traceback, _var));
                        result.push(temp);
                        local[varName] = this.#setOldBoys(varName, temp, stop) || temp;
                    } catch (e) {
                        Ezy.formatError(`Error when trying to eval expression ${varName}, as below, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Eval Error");
                        error(e);
                        return this.set(errors.EVAL_ERROR);
                    }
                }
                stop = false;
                doubleStop = false;
                startVar = false;
                longVar = false;
                varName = [];
            }
            if (i === "\\") {
                skip = true;
                continue;
            }
            if (i === "{") {
                if (varName.length) {
                    Ezy.formatError(`Error when formatting string, unexpected character "{" within value, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Format Error");
                    return this.set(errors.FORMAT_ERROR);
                }
                if (longVar) {
                    Ezy.formatError(`Error when formatting string, unexpected character "{" with two openings already, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Format Error");
                    return this.set(errors.FORMAT_ERROR);
                }
                if (startVar) {
                    startVar = false;
                    longVar = true;
                } else {
                    startVar = true;
                }
                continue;
            }
            if (i === "}") {
                if (!(startVar || longVar)) {
                    Ezy.formatError(`Error when formatting string, unexpected ending without any opening, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Format Error");
                    return this.set(errors.FORMAT_ERROR);
                }
                if (stop) {
                    if (startVar) {
                        Ezy.formatError(`Error when formatting string, unexpected double ending with single opening, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Format Error");
                        return this.set(errors.FORMAT_ERROR);
                    }
                    stop = false;
                    doubleStop = true;
                    continue;
                }
                if (startVar) {
                    startVar = false;
                    if (doubleStop) {
                        Ezy.formatError(`Error when formatting string, unexpected ending with single opening already, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Format Error");
                        return this.set(errors.FORMAT_ERROR);
                    }
                    stop = true;
                }
                if (longVar) {
                    if (stop) {
                        doubleStop = true;
                        stop = false;
                    } else {
                        stop = true;
                    }
                }
                continue;
            }
            if (startVar || longVar) {
                varName.push(i);
                continue;
            }
            result.push(i);
        }
        if (longVar && !doubleStop) {
            Ezy.formatError(`Error when formatting string, unclosed double opening, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Format Error");
            return this.set(errors.FORMAT_ERROR);
        }
        if (startVar && !stop) {
            Ezy.formatError(`Error when formatting string, unclosed single opening, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Format Error");
            return this.set(errors.FORMAT_ERROR);
        }
        if (skip) {
            Ezy.formatError(`Error when formatting string, expected any character after \\ in ${traceback}`, errorLevels.CRITICAL_ERROR, "Format Error");
            return this.set(errors.FORMAT_ERROR);
        }
        varName = varName.join("").trim();
        if (varName in this.#oldBoys) {
            result.push(this.#oldBoys[varName]);
        } else if (varName in local) {
            result.push(local[varName]);
        } else if (stop || doubleStop) {
            const _var = stop ? _varage : newReplacement;
            if (_var[varName]) {
                if ((typeof _var[varName]) === "function") {
                    const temp = String(_var[varName]());
                    result.push(temp);
                    local[varName] = this.#setOldBoys(varName, temp, stop) || temp;
                }
                else {
                    const temp = String(_var[varName]);
                    result.push(temp);
                    local[varName] = this.#setOldBoys(varName, temp, stop) || temp;
                }
            }
            else {
                try {
                    result.push(String(this.evaluateExpression(varName, traceback, _var)));
                } catch (e) {
                    Ezy.formatError(`Error when trying to eval expression ${varName}, as below, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Eval Error");
                    error(e);
                    return this.set(errors.EVAL_ERROR);
                }
            }
        }
        return result.join("");
    }
    #pushLogic(j, el, replace, temp, config, traceback, myTraceback, first, parentNode, i) {
        for (const evt in j.events) {
            this.addListener(evt, j, el, myTraceback);
            if (this.statusCode !== 0) {
                return;
            }
        }
        for (const parm in j) {
            if (keyword.has(parm)) {
                continue;
            }
            el.setAttribute(parm, this.preCompileStr(j[parm], myTraceback, replace));
            if (this.statusCode !== 0) {
                return;
            }
            temp[parm] = el[parm];
        }
        let r = this.preCompileStr(
            (j.content || ""), myTraceback, replace
        );
        if (this.statusCode !== 0) {
            return;
        }
        if (this.config.escapeHTML || config.escapeHTML || j.config?.escapeHTML) {
            r = utils.htmlEscape(r);
        }
        el.innerHTML += r;
        if (j.expire) {
            setTimeout((function () {
                el.innerHTML = "";
                el.remove();
                if (j.pipe) {
                    delete this.pipes[j.pipe.name];
                }
                this.removeVdom(temp);
                setTimeout(() => {
                    j.expire.expired?.();
                });
            }).bind(this), j.expire.date - this.historyRender);
        }
        Ezy.validateValidation(this, el, j.validate || "", traceback, parentNode);
        if (this.statusCode !== 0) {
            return;
        }
        if (j.main) {
            if (typeof j.main !== "function") {
                Ezy.formatError(`Error when rendering, expected component.main attribute as function, found ${typeof j.main}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Render Error");
                return this.set(errors.RENDER_ERROR);
            }
            this.mains.push({
                el,
                obj: j,
                func: j.main
            });
        }
        if (j.pipe) {
            Ezy.validatePipe(this, j.pipe, traceback);
            if (this.statusCode !== 0) {
                return;
            }
            this.pipes[j.pipe.name] = j.pipe;
        }
        if (j.text) {
            el.title = this.preCompileStr(j.text, myTraceback, replace);
        }
        if (j._type) {
            el.type = j._type;
        }
        if (j.data) {
            for (const k in j.data) {
                el.setAttribute(`data-${utils.camel2array(k).join("-")}`, this.preCompileStr(j.data[k], myTraceback, replace));
                if (this.statusCode !== 0) {
                    return;
                }
            }
        }
        this.beforePlugComponent(el, myTraceback);
        if (this.statusCode !== 0) {
            return;
        }
        if (j.belt) {
            const { buckle, reverseBuckle } = j.belt;
            if (buckle) {
                if (!Array.isArray(buckle)) {
                    Ezy.formatError(`Expected component.belt.buckle as string[], found ${typeof buckle}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Type Error");
                    return this.set(errors.TYPE_ERROR);
                }
                for (const _buckle of buckle) {
                    if (_buckle in this.#varage) {
                        this.#listen2[_buckle] = [i, parentNode, undefined, j.belt.options || {}];
                    } else {
                        Ezy.formatError(`varage variable ${_buckle} not found`, errorLevels.CRITICAL_ERROR, "Variable Error");
                        return this.set(errors.VARIABLE_ERROR);
                    }
                }
            }
            if (reverseBuckle) {
                if (typeof reverseBuckle !== "string") {
                    Ezy.formatError(`Expected component.belt.reverseBuckle as string, found ${typeof reverseBuckle}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Type Error");
                    return this.set(errors.TYPE_ERROR);
                }
                if (!(reverseBuckle in this.#varage)) {
                    Ezy.formatError(`varage variable ${reverseBuckle} not found`, errorLevels.CRITICAL_ERROR, "Variable Error");
                    return this.set(errors.VARIABLE_ERROR);
                }
                el.addEventListener("input", event => {
                    this.edit(reverseBuckle, event.target.value);
                });
            }
        }
        if (first === 0 && j.varAs) {
            this.asVar(el, j.varAs, myTraceback);
            if (this.statusCode !== 0) {
                return;
            }
        }
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {Object} i
     * @param {Node} parentNode
     * @param {string} traceback
     * @param {Object} replacement
     * @returns {Object}
     */
    pushComponent(i, parentNode, traceback, config = {}, replacement = {}) {
        const own = {
            time: 0
        },
            todo = document.createDocumentFragment(),
            vdom = [],
            frag = i.isFragment || false;
        for (let j of (i.component || [])) {
            if (typeof j === "string") {
                if (!this.classify) {
                    Ezy.formatError(`Error when trying to use classify component without classify dictionary, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Classify Error");
                    return this.set(errors.CLASSIFY_ERROR);
                }
                if (!(this.classify[j] || Ezy.components[j])) {
                    Ezy.formatError(`Error when trying to use classify component "${j}" without definition, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Classify Error");
                    return this.set(errors.CLASSIFY_ERROR);
                }
                j = this.classify[j] || Ezy.components[j];
            }
            if (Ezy.validateComponentIf(this, this.#varage, j.if, traceback)) {
                continue;
            }
            if (this.statusCode !== 0) {
                return;
            }
            if (j.evaluate && this.#varage[j.evaluate]) {
                const obj = JSON.parse(this.#varage[j.evaluate]);
                for (const key in obj) {
                    j[key] = obj[key];
                }
            }
            if (j.forEach) {
                if (this.#varage[j.forEach] === undefined) {
                    Ezy.formatError(`Error when rendering, expected forEach variable, not found, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Render Error");
                    return this.set(errors.RENDER_ERROR);
                }
                const obj = this.#varage[j.forEach];
                if (!(obj && typeof obj === "object")) {
                    Ezy.formatError(`Error when rendering, expected object as forEach variable value, found ${obj}, in ${traceback}`, errorLevels.CRITICAL_ERROR, "Render Error");
                    return this.set(errors.RENDER_ERROR);
                }
                let first = -1;
                for (const k in obj) {
                    first++;
                    const el = (frag ? document.createDocumentFragment() : $$(j.tag || config.tag || j.config?.tag || "div")),
                        temp = {
                            children: [],
                            dataset: {}
                        };
                    if (!frag) {
                        const [result, organic] = utils.cssCompiler(this.#extendType(...(j.type || []), ...(config.type || [])));
                        el.classList.add(...organic);
                        utils.applyStyles(el, result);
                        utils.applyStyles(el, j.style);
                    }
                    const myTraceback = frag ? traceback : (traceback + ` -> ${el.tagName}${el.id ? "#" + el.id : ""}.${[...el.classList].join(".")}`),
                        replace = { ...replacement, ...j.inherit, key: k, item: obj[k], ...own };
                    if (!frag) {
                        this.#pushLogic(j, el, replace, temp, config, traceback, myTraceback, first, parentNode, i);
                        if (this.statusCode !== 0) {
                            return;
                        }
                    }
                    todo.appendChild(el);
                    this.plugComponent(el, myTraceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                    temp.children.push(...this.pushComponent(j, utils.isDocumentFragment(el) ? parentNode : el, myTraceback, { ...config, ...(j.config || {}) }, replace));
                    if (this.statusCode !== 0) {
                        return;
                    }
                    if (!frag) {
                        for (const i in ARGS) {
                            temp[i] = ARGS[i](el[i]);
                        }
                        temp.tag = el.tagName;
                        temp.dataset = { ...temp.dataset, ...el.dataset };
                        temp.config = { ...i.config, ...j.config };
                        vdom.push(temp);
                    } else {
                        vdom.push(...temp.children);
                    }
                }
            } else {
                for (let k = 0; k < (j.times || 1); k++) {
                    const el = (frag ? document.createDocumentFragment() : $$(j.tag || config.tag || j.config?.tag || "div")),
                        temp = {
                            children: [],
                            dataset: {}
                        };
                    if (!frag) {
                        const [result, organic] = utils.cssCompiler(this.#extendType(...(j.type || []), ...(config.type || [])));
                        el.classList.add(...organic);
                        utils.applyStyles(el, result);
                        utils.applyStyles(el, j.style);
                    }
                    const myTraceback = frag ? traceback : (traceback + ` -> ${el.tagName}${el.id ? "#" + el.id : ""}.${[...el.classList].join(".")}`);
                    if (!frag) {
                        this.#pushLogic(j, el, { ...replacement, ...j.inherit, ...own }, temp, config, traceback, myTraceback, k, parentNode, i);
                        if (this.statusCode !== 0) {
                            return;
                        }
                    }
                    todo.appendChild(el);
                    this.plugComponent(el, myTraceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                    temp.children.push(...this.pushComponent(j, utils.isDocumentFragment(el) ? parentNode : el, myTraceback,
                        { ...config, ...(j.config || {}) }, { ...replacement, ...j.inherit, ...own }));
                    if (this.statusCode !== 0) {
                        return;
                    }
                    if (!frag) {
                        for (const i in ARGS) {
                            temp[i] = ARGS[i](el[i]);
                        }
                        temp.tag = el.tagName;
                        temp.dataset = { ...temp.dataset, ...el.dataset };
                        temp.config = { ...i.config, ...j.config };
                        vdom.push(temp);
                    } else {
                        vdom.push(...temp.children);
                    }
                }
            }
            own.time++;
            parentNode.appendChild(todo);
            todo.replaceChildren();
        }
        return vdom;
    }
    /**
     * This function will promise that the Ezy.js will not collide the id. Without other JavaScript actions, you may use the varAs as the variable name to access the DOM.
     * @param {Node} el - The element that you wanted to stored in variable
     * @param {string} varAs - The variable name that you want to use to access el
     * @param {string} traceback
     * @returns null
     */
    asVar(el, varAs, traceback) {
        if (varAs) {
            if (vars.has(varAs)) {
                Ezy.formatError(`when rendering ${el.tagName}.${[...el.classList].join(".")}, id collide to "${varAs}", in ${traceback}`, errorLevels.CRITICAL_ERROR, "ID Error");
                return this.set(errors.ID_ERROR);
            }
            vars.add(varAs);
            el.id = varAs;
        }
    }
    /**
     * Clear the datas.
     */
    clear() {
        for (const i of vars) {
            window[i].id = "";
        }
        utils.removeChild(this.mainEl);
        this.mainEl.innerHTML = this.original;
        this.vdom = {
            children: [],
            dataset: {}
        };
        this.#builds = this.#builds.filter((val) => {
            val.remove();
            return false;
        });
        this.#oldBoys = {};
        this.#listen2 = {};
        vars.clear();
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {Node} el
     * @param {string} traceback
     * @returns null
     */
    plugComponent(el, traceback) {
        for (const i of Ezy.plugins) {
            const { timeouts, events, animationFrames } = i.onComponentLoad?.(this, el, traceback) || {};
            this.#pluginLeftovers.timeouts.push(...timeouts);
            this.#pluginLeftovers.events.push(...events);
            this.#pluginLeftovers.animationFrames.push(...animationFrames);
            if (this.statusCode !== 0) {
                return;
            }
        }
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {Node} el
     * @param {string} traceback
     * @returns null
     */
    beforePlugComponent(el, traceback) {
        for (const i of Ezy.plugins) {
            const { timeouts, events, animationFrames } = i.beforeComponentLoad?.(this, el, traceback) || {};
            this.#pluginLeftovers.timeouts.push(...timeouts);
            this.#pluginLeftovers.events.push(...events);
            this.#pluginLeftovers.animationFrames.push(...animationFrames);
            if (this.statusCode !== 0) {
                return;
            }
        }
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {string} j - Event name
     * @param {Object} i - render.data son object
     * @param {Node} el - Node that wants to have listeners
     * @param {string} traceback
     * @returns null
     */
    addListener(j, i, el, traceback) {
        const obj = i.events[j],
            { listener } = obj;
        if (!listener) {
            Ezy.formatError(`Expected "listener" attribute in second parameter -> events[first parameter], in ${traceback}`, errorLevels.MINOR_ERROR, "Value Error");
            return this.set(errors.VALUE_ERROR);
        }
        if (obj.preventDefault) {
            el.addEventListener(utils.removePrefix(j, "on").toLowerCase(), function (e) {
                e.preventDefault();
                for (const i of listener) {
                    i(e);
                }
            });
        }
        else {
            el.addEventListener(utils.removePrefix(j, "on").toLowerCase(), function (e) {
                for (const i of listener) {
                    i(e);
                }
            });
        }
    }
    /**
     * Add a loading page to the give node.
     * @param {string} msg - Shown message on the error page, if timeout
     * @param {number} errorCode - The HTTP error code on the error page, if timeout
     * @param {number} guillotine - Timeout time limit
     * @param {string} reason - Timeout for what
     * @param {Node} parentNode
     * @returns {Object<string,Node|number>}
     */
    loadingPage(msg, errorCode, guillotine = MAXWAIT, reason = "Resource page.data not found", parentNode = body) {// dark joke
        const pot = $$("div");
        const [result, organic] = utils.cssCompiler(["display-flex", "horizontal-mid", "vertical-mid", "bg-color-white"]);
        utils.applyStyles(pot, result);
        pot.classList.add(...organic);
        pot.style.width = "100%";
        pot.style.height = parentNode === body ? "100vh" : "100%";
        const temp = $$("img");
        temp.src = "/assets/loading.svg";
        pot.appendChild(temp);
        parentNode.appendChild(pot);
        return {
            obj: pot,
            id: setTimeout(() => {
                pot.remove();
                this.errorPage(msg, errorCode, reason, parentNode).remove();
            }, guillotine)
        };
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {string} msg
     * @param {number} errorCode
     * @param {string} reason
     * @param {Node} parentNode
     * @returns {Object<string,function>}
     */
    errorPage(msg, errorCode, reason, parentNode = body) {
        error(msg);
        const pot = $$("div");
        const [result, organic] = utils.cssCompiler(["display-flex", "bg-color-white", "horizontal-mid", "vertical-mid"]);
        utils.applyStyles(pot, result);
        pot.classList.add(...organic);
        pot.style.width = "100%";
        pot.style.height = parentNode === body ? "100vh" : "100%";
        const div = $$("div");
        div.innerHTML = errorCode || "404";
        div.style.fontSize = "20px";
        div.style.border = "1px solid black";
        div.style.borderWidth = "0 1px 0 0";
        div.style.padding = "0 50px";
        div.style.color = "black";
        div.style.width = "auto";
        div.style.height = "auto";
        const another = $$("div");
        another.innerHTML = reason;
        another.style.fontSize = "18px";
        another.style.color = "black";
        another.style.padding = "0 50px";
        another.style.width = "auto";
        another.style.height = "auto";
        pot.appendChild(div);
        pot.appendChild(another);
        parentNode.appendChild(pot);
        return {
            remove() {
                pot.remove();
            }
        };
    }
    /**
     * Clear the loading page. Please call it if you don't need the loading page any longer.
     * @returns null
     */
    clearLoading({ id, obj }) {
        if (!(id && obj)) {
            return;
        }
        clearTimeout(id);
        obj.remove();
    }
    /**
     * Get the varage object's copy
     * @returns {Object}
     */
    varage() {
        return { ...this.#varage };
    }
};

log("%c[ezy.js] Welcome to the world of Ezy.js framework!", "font-size: 60px; font-weight: bold;color: yellow;");
