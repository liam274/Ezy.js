/* eslint-disable consistent-return */
/* eslint-disable indent */
"use strict";

/*
    @file ezy.js
    by Liam Lei
    Started from 2026.02.11

    Release: 0.0.6 (Stable)

    Acknowledgments:
        - Nathan Wong. Thanks for :
            + him providing his seat, as it's close to the electricity socket
        - Deepseek. Thanks for it to:
            + debug js
            + give out improving suggestions
            + design btn css
            + give out css concepts and attribute usage
            + improve CLS
        - Mr. Steven L. Thanks for him providing:
            + emotional value (Why I'm listing this out is because it's mostly why I decided to continue!)
            + React concept
            + his patience for me writing this project during his lesson
        - https://heroicons.com/ & https://icons.getbootstrap.com/. Thanks for:
            + their icons. I'm bad at art.
        - https://developer.mozilla.org/. Thanks for:
            + many web knowledges
*/

const log = console.log,
    $ = document.querySelector.bind(document),
    $$ = document.createElement.bind(document),
    error = console.error.bind(console),
    warn = console.warn.bind(console);
function removePrefix(str, prefix) {
    return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}

const keyword = new Set([
    "type", "component", "tag",
    "events", "style", "varAs",
    "listener", "times", "title",
    "if", "content", "inherit",
    "validate", "expire", "text",
    "forEach", "innerHTML", "config",
    "data"
]), errors = {
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
    ID_ERROR: 11
};

const dictionary = {
    time: ["i", "index", "renderIndex"], // maintain counts of independent elements (Which means those who is independent on times duplication)
    key: ["key"],
    item: ["item", "value"]
},
    required = {// store required in namespace, and tell the default
    };

const UPPERCASE_REGEX = /[A-Z]/g,
    ALPHABET_REGEX = /^[a-zA-Z]+$/,
    EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    DATE_REGEX = /^(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2([0-9]{2})?[0-9]{2}$/;
// class

class unknownVariableError extends Error {
    constructor(...data) {
        super(...data);
        this.name = "unknownVariableError";
    }
    getName() {
        return "unknownVariableError";
    }
};

// global functions
/**
 * Change camelcase to array
 * @param {String} data - Input a string that's in camel case
 * @returns {string[]} Output a string array that split via uppercases
 */
const camel2array = (data) => data.replace(UPPERCASE_REGEX, "-$&").toLowerCase().split("-");

/**
 * Apply style to element
 * @param {Node} el - Element that needs to apply style
 * @param {object} styles - Styles that needs to be applied
 * @returns null
 */
function applyStyles(el, styles) {
    if (!styles) {
        return;
    }
    for (const prop in styles) {
        el.style.setProperty(camel2array(prop).join("-"), styles[prop]);
    }
}

/**
 * Remove every child of an element
 * @param {Node} el - Element
 */
function removeChild(el) {
    for (const i of el.children) {
        el.replaceChildren(i);
    }
}
/**
 * Join array to camelcase
 * @param {string[]} data
 * @returns {string}
 */
function array2camel(data) {
    const result = [];
    let sec,
        first = false;
    for (const i of data) {
        sec = true;
        for (const char of i) {
            result.push(sec && first ? char.toLocaleUpperCase() : char);
            sec = false;
        }
        first = true;
    }
    return result.join("");
}

// Ezy
const body = document.body;

const Ezy = {
    plugins: [],
    /**
     * Add plugins
     * @param {Object} plugin - plugin object
     */
    add(plugin) {
        this.plugins.push(plugin);
    },
    render() {
        // implementation here
    },
    isInt(data) {
        return Number.isInteger(Number(data));
    },
    isAlphabet(data) {
        return ALPHABET_REGEX.test(data);
    },
    isEmail(data) {
        return EMAIL_REGEX.test(data);
    },
    isDate(data) {
        return DATE_REGEX.test(data);
    },
    validatePipe(obj, data, traceback) {
        if (!data.pipe.receive || typeof data.pipe.receive !== "object") {
            Ezy.formatError(`Error when rendering, expected object[string,function], found ${data.pipe.receive}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Pipe Error");
            return obj.set(errors.PIPE_ERROR);
        }
        for (const i in data.pipe.receive) {
            const sobj = data.pipe.receive[i];
            if (typeof sobj.func !== "function") {
                Ezy.formatError(`Error when piping, expected data.pipe.receive.*.func as function, found ${typeof sobj.func}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Structure Error");
                return obj.set(errors.STRUCTURE_ERROR);
            }
            if (!Array.isArray(sobj.data)) {
                Ezy.formatError(`Error when piping, expected data.pipe.receive.*.data as array, found ${typeof sobj.data}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Structure Error");
                return obj.set(errors.STRUCTURE_ERROR);
            }
        }
        if (!data.pipe.name) {
            Ezy.formatError(`Error when piping, expected data.pipe.name, in ${traceback}`, Ezy.CRITICAL_ERROR, "Structure Error");
            return obj.set(errors.STRUCTURE_ERROR);
        }
    },
    validateComponentIf(obj, item, traceback) {
        if (item) {
            if (!obj.varage[item]) {
                Ezy.formatError(`render.varage[component.if] not found, in ${traceback}`, Ezy.CRITICAL_ERROR, "Value Error");
                return obj.set(errors.VALUE_ERROR);
            }
            if (typeof obj.varage[item] !== "function") {
                Ezy.formatError(`expected render.varage[component.if] as function, found ${typeof obj.varage[item]}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Value Error");
                return obj.set(errors.VALUE_ERROR);
            }
            return !obj.varage[item]();
        }
    },
    validateValidation(obj, el, validate, traceback) {
        if (validate && typeof validate === "string") {
            if (Ezy[validate]) {
                if (typeof Ezy[validate] === "function") {
                    el.addEventListener("input", function (e) {
                        if (Ezy[validate](e.target.value)) {
                            el.classList.add("valid");
                            el.classList.remove("invalid");
                        } else {
                            el.classList.remove("valid");
                            el.classList.add("invalid");
                        }
                    });
                }
                else {
                    Ezy.formatError(`Error when rendering, expected component.validate in Ezy as function, found ${typeof Ezy[validate]}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
                    return obj.set(errors.RENDER_ERROR);
                }
            }
            else {
                Ezy.formatError(`Error when rendering, Ezy[component.validate] not found, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
                return obj.set(errors.RENDER_ERROR);
            }
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
            removeChild(barrier);
            body.removeChild(barrier);
            barrier.remove();
        });
        back.appendChild(confirm);
        body.appendChild(barrier);
    },
    /**
     * format error message
     * @param {string} message
     * @param {number} level
     * @param {string} error
     */
    formatError(message, level, error) {
        error(`[ezy.js] ${Ezy.errors[level]}: ${error.toLocaleUpperCase()}: ${message}`);
    },
    CRITICAL_ERROR: 2,
    MAJOR_ERROR: 1,
    MINOR_ERROR: 0
};

Ezy.errors = ["MINOR ERROR", "MAJOR ERROR", "CRITICAL ERROR"];

// Route Guard

const routeGuard = {
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
                // eslint-disable-next-line no-undef
                location.href = result.href;
            }
            full = false;
        }
    }
    if (full) {
        // eslint-disable-next-line no-undef
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
                if (Ezy.isInt(i)) {
                    const got = array2camel(data[i].split("-"));
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
const MAXWAIT = 60000,
    HTTP_NOT_FOUND = 404,
    HTTP_TIMEOUT = 408,
    SECOND = 1000;
// eslint-disable-next-line no-unused-vars
class render {
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
        this.frameID = undefined;
        this.vdom = {
            children: [],
            dataset: {}
        };
        if (!data) {
            this.set(errors.STRUCTURE_ERROR);
            this.loadPage = this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure missing.", HTTP_NOT_FOUND, this.maxWait);
            return this;
        }
        for (const i in required) {
            namespace[i] = namespace[i] || required[i];
        }
        if (data.classify) {
            this.classify = data.classify;
        }
        if (!this.data.main) {
            this.set(errors.STRUCTURE_ERROR);
            this.loadPage = this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure attribute \"main\" missing.", HTTP_NOT_FOUND,
                this.maxWait, "Resource page.data.main not found");
            return this;
        }
        this.config = data.config || {};
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
        }
        this.original = this.mainEl.innerHTML;
        this.el = document.createDocumentFragment();
        this.reRender();
        if (this.statusCode !== 0) {
            return this;
        }
    }
    /**
     * reRender the entire page. ***PLEASE CHECK THE STATUS CODE***
     * @returns null
     */
    reRender() {
        if (this.config && !this.config.keepConsole) {
            console.clear();
        }
        this.historyRender = +new Date();
        if (this.loadPage) {
            this.clearLoading();
        }
        if (!this.data) {
            this.set(errors.STRUCTURE_ERROR);
            this.loadPage = this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure missing.", HTTP_NOT_FOUND,
                this.maxWait);
            return;
        }
        this.loadPage = this.loadingPage("[ezy.js] CRITICAL ERROR: Timeout Error: ", HTTP_TIMEOUT, this.maxWait, "Page render timeout");
        this.clear();
        this.varage = { ...varage, ...(this.data.data || {}) };
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
            // eslint-disable-next-line no-undef
            clearTimeout(this.oldTimeout);
        }
        // eslint-disable-next-line no-undef
        this.oldTimeout = setTimeout(() => { this.interval = true; this.loop(); }, SECOND - ((this.historyRender) % SECOND));
        this.main();
        if (this.statusCode !== 0) {
            return;
        }
        if (this.el) {
            this.mainEl.appendChild(this.el);
        }
        this.clearLoading();
        log(`[ezy.js] Debug Message: : Render consumed ${new Date() - this.historyRender} ms`);
    }
    /**
     * main proc. ***CALLING IT IS NOT SUGGESTED***
     * @returns null
     */
    main() {
        this.statusCode = 0;
        if (this.data.onStart) {
            this.preRender(this.data.onStart);
        } else {
            warn("[ezy.js] MAJOR SUGGESTION: : Suggest adding onStart function list to handle preprocess");
        }
        for (const i of Ezy.plugins) {
            i.onStart?.(this.data);
        }
        if (!this.data.main) {
            this.set(errors.STRUCTURE_ERROR);
            Ezy.formatError("Data structure incomplete.", Ezy.CRITICAL_ERROR, "Structure Error");
            this.loadPage = this.loadingPage("", HTTP_NOT_FOUND, this.maxWait, "Resouce page.data.main not found");
            return;
        }
        this.mainRender(this.data.main);
        if (this.statusCode !== 0) {
            return;
        }
        log(`[ezy.js] Render Program exits ${this.statusCode === 0 ? "" : "un"}successfully. Status Code: ${this.statusCode}`);
        if (this.data.onLoad) {
            for (const i of this.data.onLoad) {
                i(this.data);
            }
        }
        else {
            warn("[ezy.js] MINOR SUGGESSION: : Suggest adding onLoad function list to handle onLoad process");
        }
        for (const i of Ezy.plugins) {
            i.onLoad?.(this.data);
        }
        if (this.statusCode !== 0) {
            return;
        }
    }
    /**
     * A loop that use requestAnimationFrame to implement. Calling it is not suggested
     */
    loop() {
        for (const i of this.mains) {
            i.func(i.obj, i.el);
        }
        // eslint-disable-next-line no-undef
        cancelAnimationFrame(this.frameID);
        if (this.interval) {
            // eslint-disable-next-line no-undef
            this.frameID = requestAnimationFrame(this.loop.bind(this));
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
            Ezy.formatError(`Error when piping, trying to send message from ${sender}, not found in this.pipes`, Ezy.CRITICAL_ERROR, "Pipe Error");
            return this.set(errors.PIPE_ERROR);
        }
        if (!(receiver in this.pipes)) {
            Ezy.formatError(`Error when piping, trying to send message to ${receiver}, not found in this.pipes`, Ezy.CRITICAL_ERROR, "Pipe Error");
            return this.set(errors.PIPE_ERROR);
        }
        if (!(sender in this.pipes[receiver].receive)) {
            Ezy.formatError(`Error when piping, try to receive message from ${sender}, not found in this.pipes.${receiver}.receive`, Ezy.CRITICAL_ERROR, "Pipe Error");
            return this.set(errors.PIPE_ERROR);
        }
        const obj = this.pipes[receiver].receive[sender];
        obj.func(data, ...obj.data);
    }
    /**
     * edit variables
     * @param {string} key
     * @param {Any} data
     */
    edit(key, data) {
        this.varage[key] = data;
    }
    /**
     * Read variables
     * @param {string} key
     * @returns {Any}
     */
    read(key) {
        if (key in this.varage) {
            return this.varage[key];
        }
        else {
            throw new unknownVariableError(`[ezy.js] Critical Error: Variable Error: Variable "${key}" not found`);
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
     * @param {Object} vdom
     * @returns {boolean}
     */
    removeVdom(data, vdom = this.vdom) {
        for (let i = vdom.children.length; i > 0; i--) {
            if (vdom.children[i - 1] === data) {
                delete vdom.children[i - 1];
                return true;
            }
            if (this.removeVdom(data, vdom.children[i - 1])) {
                return true;
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
     * @param {function(string, Object, Object)} createElement
     * @returns {Object|void}
     */
    sectionRender = (sectionData, parentElement, sectionName, title, createElement) => {
        const traceback = `page ${title} -> ${sectionName}`;
        if (!sectionData) {
            Ezy.formatError(`function found first parameter in ${sectionData}, expected object, in ${traceback}`, Ezy.CRITICAL_ERROR, "Value Error");
            return this.set(errors.VALUE_ERROR);
        }
        const todo = document.createDocumentFragment(),
            vdom = [];
        this.systemPlot.time = 0;
        for (const i in sectionData) {
            const item = sectionData[i];
            if (Ezy.validateComponentIf(this, item.if, traceback)) {
                continue;
            }
            if (this.statusCode !== 0) {
                return;
            }
            const temp = createElement(i, item, i.config || {});
            if (this.statusCode !== 0) {
                return;
            }
            if (!(temp && temp.el && temp.obj)) {
                Ezy.formatError(`argument-function "createElement" return unexpected value, expected {el:Node(or NodeLike object),obj:vdom}, in page ${traceback}`,
                    Ezy.CRITICAL_ERROR, "Value Error"
                );
                return this.set(errors.VALUE_ERROR);
            }
            const { el, obj } = temp;
            // eslint-disable-next-line no-undef
            if (!(el instanceof Node)) {
                Ezy.formatError(`argument-function "createElement" return unexpected value, expected {el:Node(or NodeLike object),obj:vdom}, in page ${traceback}`, Ezy.CRITICAL_ERROR, "Value Error");
                return this.set(errors.VALUE_ERROR);
            }
            todo.appendChild(el);
            this.systemPlot.time++;
            vdom.push(...obj);
        }
        parentElement.appendChild(todo);
        return vdom;
    };
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {string} _
     * @param {Object} i
     * @param {Object} config
     * @returns {void|Object}
     */
    contentRender = (_, i, config) => {
        const title = this.data.main.title,
            traceback = `page ${title} -> content`,
            vdom = [];
        if (typeof i === "string") {
            if (!this.classify) {
                Ezy.formatError(`Error when trying to use classify component without classify dictionary, in ${traceback}`, Ezy.CRITICAL_ERROR, "Classify Error");
                return this.set(errors.CLASSIFY_ERROR);
            }
            if (!this.classify[i]) {
                Ezy.formatError(`Error when trying to use classify component "${i}" without definition, in ${traceback}`, Ezy.CRITICAL_ERROR, "Classify Error");
                return this.set(errors.CLASSIFY_ERROR);
            }
            i = this.classify[i];
        }
        const todo = document.createDocumentFragment();
        if (i.forEach) {
            if (this.varage[i.forEach] === undefined) {
                Ezy.formatError(`Error when rendering, expected forEach variable, not found, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
                return this.set(errors.RENDER_ERROR);
            }
            const obj = this.varage[i.forEach];
            if (!(obj && typeof obj === "object")) {
                Ezy.formatError(`Error when rendering, expected object as forEach variable value, found ${obj}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
                return this.set(errors.RENDER_ERROR);
            }
            let first = -1;
            for (const k in obj) {
                first++;
                const card = $$(i.tag || config.tag || "div"),
                    temp = {
                        children: [],
                        dataset: {}
                    };
                card.classList.add(...(i.type || []), ...(config.type || []));
                if (i.expire) {
                    // eslint-disable-next-line no-undef
                    setTimeout((function () {
                        card.innerHTML = "";
                        card.parentNode.removeChild(card);
                        if (i.pipe) {
                            delete this.pipes[i.pipe.name];
                        }
                        this.removeVdom(temp);
                        // eslint-disable-next-line no-undef
                        setTimeout(() => {
                            i.expire.expired?.();
                        });
                    }).bind(this), i.expire.date - this.historyRender);
                }
                Ezy.validateValidation(this, card, i.validate, traceback);
                if (this.statusCode !== 0) {
                    return;
                }
                if (i.main) {
                    if (typeof i.main !== "function") {
                        Ezy.formatError(`Error when rendering, expected component.main attribute as function, found ${typeof i.main}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
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
                const replacement = {
                    ...this.systemPlot, ...(i.inherit || {}), key: k, item: obj[k]
                };
                if (i.data) {
                    for (const k in i.data) {
                        card.setAttribute(`data-${camel2array(k).join("-")}`, this.preCompileStr(i.data[k], traceback, replacement));
                    }
                }
                this.beforePlugComponent(card, traceback);
                if (this.statusCode !== 0) {
                    return;
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
                todo.appendChild(card);
                this.plugComponent(card, traceback);
                if (this.statusCode !== 0) {
                    return;
                }
                applyStyles(card, i.style);
                for (const j in (i.events || {})) {
                    this.addListener(j, i, card, traceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                }
                card.innerHTML += this.preCompileStr(
                    (i.content || ""),
                    traceback, replacement
                );
                if (this.statusCode !== 0) {
                    return;
                }
                for (const j in i) {
                    if (keyword.has(j)) {
                        continue;
                    }
                    card.setAttribute(j, this.preCompileStr(i[j], traceback, replacement));
                    temp[j] = card[j];
                }
                temp.children.push(...this.pushComponent(i, card, traceback, replacement));
                if (this.statusCode !== 0) {
                    return;
                }
                {
                    for (const i in ARGS) {
                        temp[i] = ARGS[i](card[i]);
                    }
                    temp.tag = card.tagName;
                    temp.dataset = { ...temp.dataset, ...card.dataset };
                };
                vdom.push(temp);
            }
        } else {
            for (let k = 0; k < (i.times || 1); k++) {
                const card = $$(i.tag || config.tag || "div"),
                    temp = {
                        children: [],
                        dataset: {}
                    };
                card.classList.add(...(i.type || []), ...(config.type || []));
                if (i.expire) {
                    // eslint-disable-next-line no-undef
                    setTimeout((function () {
                        card.innerHTML = "";
                        card.parentNode.removeChild(card);
                        if (i.pipe) {
                            delete this.pipes[i.pipe.name];
                        }
                        this.removeVdom(temp);
                        // eslint-disable-next-line no-undef
                        setTimeout(() => {
                            i.expire.expired?.();
                        });
                    }).bind(this), i.expire.date - this.historyRender);
                }
                Ezy.validateValidation(this, card, i.validate, traceback);
                if (this.statusCode !== 0) {
                    return;
                }
                if (i.main) {
                    if (typeof i.main !== "function") {
                        Ezy.formatError(`Error when rendering, expected component.main attribute as function, found ${typeof i.main}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
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
                        card.setAttribute(`data-${camel2array(k).join("-")}`, this.preCompileStr(i.data[k], traceback, i.inherit || {}));
                    }
                }
                this.beforePlugComponent(card, traceback);
                if (this.statusCode !== 0) {
                    return;
                }
                if (k === 0 && i.varAs) {
                    this.asVar(card, i.varAs, traceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                }
                if (i.text) {
                    card.title = this.preCompileStr(i.text, traceback, i.inherit || {});
                }
                todo.appendChild(card);
                this.plugComponent(card, traceback);
                if (this.statusCode !== 0) {
                    return;
                }
                applyStyles(card, i.style);
                for (const j in (i.events || {})) {
                    this.addListener(j, i, card, traceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                }
                card.innerHTML += this.preCompileStr(
                    (i.content || ""),
                    traceback, i.inherit || {}
                );
                if (this.statusCode !== 0) {
                    return;
                }
                for (const j in i) {
                    if (keyword.has(j)) {
                        continue;
                    }
                    card.setAttribute(j, this.preCompileStr(i[j], traceback, i.inherit));
                    temp[j] = card[j];
                }
                temp.children.push(...this.pushComponent(i, card, traceback, i.inherit));
                if (this.statusCode !== 0) {
                    return;
                }
                {
                    for (const i in ARGS) {
                        temp[i] = ARGS[i](card[i]);
                    }
                    temp.tag = card.tagName;
                    temp.dataset = { ...temp.dataset, ...card.dataset };
                };
                vdom.push(temp);
            }
        }
        return {
            el: todo,
            obj: vdom
        };
    };
    /**
     * main render proc, it's a historical problem. ***CALLING IT IS NOT SUGGESTED***
     * @param {Object} pageData
     * @returns null
     */
    mainRender(pageData) {
        // Ezy.js is firstly a function, and this its body.
        this.vdom.children.push(...this.sectionRender(pageData, this.el, pageData.name || "", pageData.title || "", this.contentRender));
    }
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
     * @returns Any
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
                            Ezy.formatError(`Error when trying to access variable ${name}, not found, in ${traceback}`, Ezy.CRITICAL_ERROR, "Parse Error");
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
                                    Ezy.CRITICAL_ERROR, "Parse Error");
                                return this.set(error.PHARSING_ERROR);
                            }
                        }
                        else {
                            Ezy.formatError(`Error when trying to access variable ${name[0]}, not found, in ${traceback}`, Ezy.CRITICAL_ERROR, "Parse Error");
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
                    Ezy.formatError(`Error when trying to access variable ${name}, not found, in ${traceback}`, Ezy.CRITICAL_ERROR, "Parse Error");
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
                            Ezy.CRITICAL_ERROR, "Parse Error");
                        return this.set(errors.PHARSING_ERROR);
                    }
                }
                else {
                    Ezy.formatError(`Error when trying to access variable ${name[0]}, not found, in ${traceback}`, Ezy.CRITICAL_ERROR, "Parse Error");
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
                warn(`[ezy.js] Warning: Variable not defined in "${expr}" at ${traceback}`);
                return "";
            }
            Ezy.formatError(`Failed to evaluate "${expr}" in ${traceback}`, Ezy.CRITICAL_ERROR, "Eval Error");
            error(e);
            this.set(errors.EVAL_ERROR);
            return "";
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
        const result = [];
        let skip = false,
            startVar = false,
            longVar = false,
            stop = false,
            doubleStop = false,
            varName = [];
        replacement = { ...this.systemPlot, ...replacement };
        const newReplacement = {};
        const _varage = { ...this.varage, ...pipeData };
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
                if (_var[varName]) {
                    if ((typeof _var[varName]) === "function") {
                        result.push(String(_var[varName]()));
                    }
                    else {
                        result.push(String(_var[varName]));
                    }
                }
                else {
                    try {
                        result.push(String(this.evaluateExpression(varName, traceback, _var)));
                    } catch (e) {
                        Ezy.formatError(`Error when trying to eval expression ${varName}, as below, in ${traceback}`, Ezy.CRITICAL_ERROR, "Eval Error");
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
                    Ezy.formatError(`Error when formatting string, unexpected character "{" within value, in ${traceback}`, Ezy.CRITICAL_ERROR, "Format Error");
                    return this.set(errors.FORMAT_ERROR);
                }
                if (longVar) {
                    Ezy.formatError(`Error when formatting string, unexpected character "{" with two openings already, in ${traceback}`, Ezy.CRITICAL_ERROR, "Format Error");
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
                    Ezy.formatError(`Error when formatting string, unexpected ending without any opening, in ${traceback}`, Ezy.CRITICAL_ERROR, "Format Error");
                    return this.set(errors.FORMAT_ERROR);
                }
                if (stop) {
                    if (startVar) {
                        Ezy.formatError(`Error when formatting string, unexpected double ending with single opening, in ${traceback}`, Ezy.CRITICAL_ERROR, "Format Error");
                        return this.set(errors.FORMAT_ERROR);
                    }
                    stop = false;
                    doubleStop = true;
                    continue;
                }
                if (startVar) {
                    startVar = false;
                    if (doubleStop) {
                        Ezy.formatError(`Error when formatting string, unexpected ending with single opening already, in ${traceback}`, Ezy.CRITICAL_ERROR, "Format Error");
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
            Ezy.formatError(`Error when formatting string, unclosed double opening, in ${traceback}`, Ezy.CRITICAL_ERROR, "Format Error");
            return this.set(errors.FORMAT_ERROR);
        }
        if (startVar && !stop) {
            Ezy.formatError(`Error when formatting string, unclosed single opening, in ${traceback}`, Ezy.CRITICAL_ERROR, "Format Error");
            return this.set(errors.FORMAT_ERROR);
        }
        if (skip) {
            Ezy.formatError(`Error when formatting string, expected any character after \\ in ${traceback}`, Ezy.CRITICAL_ERROR, "Format Error");
            return this.set(errors.FORMAT_ERROR);
        }
        varName = varName.join("").trim();
        if (stop || doubleStop) {
            const _var = stop ? _varage : newReplacement;
            if (_var[varName]) {
                if ((typeof _var[varName]) === "function") {
                    result.push(String(_var[varName]()));
                }
                else {
                    result.push(String(_var[varName]));
                }
            }
            else {
                try {
                    result.push(String(this.evaluateExpression(varName, traceback, _var)));
                } catch (e) {
                    Ezy.formatError(`Error when trying to eval expression ${varName}, as below, in ${traceback}`, Ezy.CRITICAL_ERROR, "Eval Error");
                    error(e);
                    return this.set(errors.EVAL_ERROR);
                }
            }
        }
        return result.join("");
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {Object} i
     * @param {Node} parentNode
     * @param {string} traceback
     * @param {Object} replacement
     * @returns {Object}
     */
    pushComponent(i, parentNode, traceback, replacement = {}) {
        const own = {
            time: 0
        },
            todo = document.createDocumentFragment();
        const config = i.config || {},
            vdom = [];
        for (let j of (i.component || [])) {
            if (typeof j === "string") {
                if (!this.classify) {
                    Ezy.formatError(`Error when trying to use classify component without classify dictionary, in ${traceback}`, Ezy.CRITICAL_ERROR, "Classify Error");
                    return this.set(errors.CLASSIFY_ERROR);
                }
                if (!this.classify[j]) {
                    Ezy.formatError(`Error when trying to use classify component "${j}" without definition, in ${traceback}`, Ezy.CRITICAL_ERROR, "Classify Error");
                    return this.set(errors.CLASSIFY_ERROR);
                }
                j = this.classify[j];
            }
            if (Ezy.validateComponentIf(this, j.if, traceback)) {
                continue;
            }
            if (this.statusCode !== 0) {
                return;
            }
            if (j.forEach) {
                if (this.varage[j.forEach] === undefined) {
                    Ezy.formatError(`Error when rendering, expected forEach variable, not found, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
                    return this.set(errors.RENDER_ERROR);
                }
                const obj = this.varage[j.forEach];
                if (!(obj && typeof obj === "object")) {
                    Ezy.formatError(`Error when rendering, expected object as forEach variable value, found ${obj}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
                    return this.set(errors.RENDER_ERROR);
                }
                let first = -1;
                for (const k in obj) {
                    first++;
                    const el = $$(j.tag || config.tag || "div"),
                        temp = {
                            children: [],
                            dataset: {}
                        };
                    el.classList.add(...(j.type || []), ...(config.type || []));
                    applyStyles(el, j.style);
                    const myTraceback = traceback + ` -> ${el.tagName}${el.id ? "#" + el.id : ""}.${[...el.classList].join(".")}`;
                    for (const evt in j.events) {
                        this.addListener(evt, j, el, myTraceback);
                        if (this.statusCode !== 0) {
                            return;
                        }
                    }
                    const replace = { ...replacement, ...j.inherit, key: k, item: obj[k], ...own };
                    for (const parm in j) {
                        if (keyword.has(parm)) {
                            continue;
                        }
                        el.setAttribute(parm, this.preCompileStr(j[parm], myTraceback, replace));
                        temp[parm] = el[parm];
                    }
                    el.innerHTML = this.preCompileStr(
                        (j.content || ""), myTraceback, replace
                    );
                    if (this.statusCode !== 0) {
                        return;
                    }
                    if (j.expire) {
                        // eslint-disable-next-line no-undef
                        setTimeout((function () {
                            el.innerHTML = "";
                            el.parentNode.removeChild(el);
                            if (j.pipe) {
                                delete this.pipes[j.pipe.name];
                            }
                            this.removeVdom(temp);
                            // eslint-disable-next-line no-undef
                            setTimeout(() => {
                                j.expire.expired?.();
                            });
                        }).bind(this), j.expire.date - this.historyRender);
                    }
                    Ezy.validateValidation(this, el, j.validate, traceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                    if (j.main) {
                        if (typeof j.main !== "function") {
                            Ezy.formatError(`Error when rendering, expected component.main attribute as function, found ${typeof j.main}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
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
                    if (j.data) {
                        for (const k in j.data) {
                            el.setAttribute(`data-${camel2array(k).join("-")}`, this.preCompileStr(j.data[k], myTraceback, replace));
                        }
                    }
                    this.beforePlugComponent(el, myTraceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                    if (first === 0) {
                        this.asVar(el, j.varAs, myTraceback);
                        if (this.statusCode !== 0) {
                            return;
                        }
                    }
                    todo.appendChild(el);
                    this.plugComponent(el, myTraceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                    temp.children.push(...this.pushComponent(j, el, myTraceback, replace));
                    if (this.statusCode !== 0) {
                        return;
                    }
                    {
                        for (const i in ARGS) {
                            temp[i] = ARGS[i](el[i]);
                        }
                        temp.tag = el.tagName;
                        temp.dataset = { ...temp.dataset, ...el.dataset };
                    };
                    vdom.push(temp);
                }
            } else {
                for (let k = 0; k < (j.times || 1); k++) {
                    const el = $$(j.tag || config.tag || "div"),
                        temp = {
                            children: [],
                            dataset: {}
                        };
                    el.classList.add(...(j.type || []), ...(config.type || []));
                    applyStyles(el, j.style);
                    const myTraceback = traceback + ` -> ${el.tagName}${el.id ? "#" + el.id : ""}.${[...el.classList].join(".")}`;
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
                        el.setAttribute(parm, this.preCompileStr(j[parm], myTraceback, { ...replacement, ...j.inherit, ...own }));
                        temp[parm] = el[parm];
                    }
                    el.innerHTML = this.preCompileStr(
                        (j.content || ""), myTraceback, { ...replacement, ...j.inherit, ...own }
                    );
                    if (this.statusCode !== 0) {
                        return;
                    }
                    if (j.expire) {
                        // eslint-disable-next-line no-undef
                        setTimeout((function () {
                            el.innerHTML = "";
                            if (el.parentNode && el.parentNode.contains(el)) {
                                el.parentNode.removeChild(el);
                            }
                            if (j.pipe) {
                                delete this.pipes[j.pipe.name];
                            }
                            this.removeVdom(temp);
                            // eslint-disable-next-line no-undef
                            setTimeout(() => {
                                if (j.expire.expired) {
                                    j.expire.expired();
                                }
                            });
                        }).bind(this), j.expire.date - this.historyRender);
                    }
                    Ezy.validateValidation(this, el, j.validate, traceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                    if (j.main) {
                        if (typeof j.main !== "function") {
                            Ezy.formatError(`Error when rendering, expected component.main attribute as function, found ${typeof j.main}, in ${traceback}`, Ezy.CRITICAL_ERROR, "Render Error");
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
                        el.title = this.preCompileStr(j.text, myTraceback, { ...replacement, ...j.inherit, ...own });
                    }
                    if (j.data) {
                        for (const k in j.data) {
                            el.setAttribute(`data-${camel2array(k).join("-")}`, this.preCompileStr(j.data[k], myTraceback, { ...replacement, ...j.inherit, ...own }));
                        }
                    }
                    this.beforePlugComponent(el, myTraceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                    if (k === 0) {
                        this.asVar(el, j.varAs, myTraceback);
                        if (this.statusCode !== 0) {
                            return;
                        }
                    }
                    todo.appendChild(el);
                    this.plugComponent(el, myTraceback);
                    if (this.statusCode !== 0) {
                        return;
                    }
                    temp.children.push(...this.pushComponent(j, el, myTraceback, { ...replacement, ...j.inherit, ...own }));
                    if (this.statusCode !== 0) {
                        return;
                    }
                    {
                        for (const i in ARGS) {
                            temp[i] = ARGS[i](el[i]);
                        }
                        temp.tag = el.tagName;
                        temp.dataset = { ...temp.dataset, ...el.dataset };
                    };
                    vdom.push(temp);
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
                Ezy.formatError(`when rendering ${el.tagName}.${[...el.classList].join(".")}, id collide to "${varAs}", in ${traceback}`, Ezy.CRITICAL_ERROR, "ID Error");
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
        removeChild(this.mainEl);
        this.mainEl.innerHTML = this.original;
        this.vdom = {
            children: [],
            dataset: {}
        };
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
            i.onComponentLoad?.(this, el, traceback);
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
            i.beforeComponentLoad?.(this, el, traceback);
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
            Ezy.formatError(`Expected "listener" attribute in second parameter -> events[first parameter], in ${traceback}`, Ezy.MINOR_ERROR, "Value Error");
            return this.set(errors.VALUE_ERROR);
        }
        if (obj.preventDefault) {
            el.addEventListener(removePrefix(j, "on"), function (e) {
                e.preventDefault();
                for (const i of listener) {
                    i(e);
                }
            });
        }
        else {
            el.addEventListener(removePrefix(j, "on"), function (e) {
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
     * @returns {Object}
     */
    loadingPage(msg, errorCode, guillotine = MAXWAIT, reason = "Resource page.data not found", parentNode = body) {// dark joke
        const pot = $$("div");
        pot.classList.add("flex", "horizontal-mid", "vertical-mid", "bg-white");
        pot.style.width = "100%";
        pot.style.height = "100%";
        const temp = $$("img");
        temp.src = "./assets/loading.svg";
        pot.appendChild(temp);
        parentNode.appendChild(pot);
        return {
            obj: pot,
            parent: parentNode,
            // eslint-disable-next-line no-undef
            id: setTimeout(() => {
                parentNode.removeChild(pot);
                this.errorPage(msg, errorCode, reason, parentNode);
            }, guillotine)
        };
    }
    /**
     * ***CALLING IT IS NOT SUGGESTED***
     * @param {string} msg
     * @param {number} errorCode
     * @param {string} reason
     * @param {Node} parentNode
     */
    errorPage(msg, errorCode, reason, parentNode = body) {
        error(msg);
        const pot = $$("div");
        pot.classList.add("flex", "bg-white", "horizontal-mid", "vertical-mid");
        pot.style.width = "100%";
        pot.style.height = "100%";
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
    }
    /**
     * Clear the loading page. Please call it if you don't need the loading page any longer.
     * @returns null
     */
    clearLoading() {
        if (!this.loadPage) {
            return;
        }
        // eslint-disable-next-line no-undef
        clearTimeout(this.loadPage.id);
        if (this.loadPage.parent.contains(this.loadPage.obj)) {
            this.loadPage.parent.removeChild(this.loadPage.obj);
        }
        this.loadPage = undefined;
    }
};

log("[ezy.js] Welcome using Ezy.js framework!");
