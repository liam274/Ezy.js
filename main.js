"use strict";

/*
    ezy.js
    by Liam Lei
    Started from 2026.02.11

    Release: 0.0.4 (Stable)

    Acknowledgments:
        - Nathan Wong. Thanks for him providing his seat, as it's close to the electricity socket
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
        - https://heroicons.com/ & https://icons.getbootstrap.com/
            + thanks for their icons. I'm bad at art.
*/

const log = console.log,
    $ = document.querySelector.bind(document),
    $$ = document.createElement.bind(document),
    error = console.error.bind(console);
function removePrefix(str, prefix) {
    return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}

const keyword = new Set([
    "type", "component", "tag",
    "events", "style", "varAs",
    "listener", "times", "title",
    "if", "content", "inherit",
    "validate", "expire", "text",
    "forEach", "location", "innerHTML",
    "config", "data"
]), errorMsg = {
    1: "data structure error",
    2: "this.asVar rewrite error",
    3: "format error",
    4: "template structure error",
    5: "value error",
    6: "eval error",
    7: "classify error",
    8: "pipe error"
};

const dictionary = {
    time: ["i", "index", "renderIndex"], // maintain counts of independent elements (Which means those who is independent on times duplication)
    key: ["key"],
    item: ["item", "value"]
},
    required = {// store required in namespace, and tell the default
    };
// class

class unknownVariableError extends Error {
    getName() {
        return "unknownVariableError";
    }
};

// global functions

function applyStyles(el, styles) {
    if (!styles) return;
    for (let prop in styles) {
        el.style[prop] = styles[prop];
    }
}

function removeChild(el) {
    let list = [...el.children];
    for (let i of list) {
        el.removeChild(i);
        removeChild(i);
        // i.remove();
    }
}

function emptyFunc() { }

function camel2array(data) {
    let result = [],
        word = [];
    for (let i of data) {
        if (i === i.toLocaleUpperCase() && /[A-Za-z]/.test(i)) {
            result.push(word.join(""));
            word.length = 0;
            word.push(i.toLocaleLowerCase());
        } else word.push(i);
    }
    if (word.length) result.push(word.join(""));
    return result;
}

function equal(data) {
    let last;
    for (let i of data) {
        last = null;
        for (let k in i) {
            if (i[k] === null) return "NULL IS NOT ACCEPTED";
            if (last === null) {
                last = i[k];
                continue;
            }
            if (last !== i[k]) return false;
        }
    }
    return true;
}

function max(data) {
    let maxV = "",
        max = -Infinity;
    for (let i in data)
        if (data[i] > max) {
            maxV = i;
            max = data[i];
        }
    return maxV;
}

// Ezy
const head = document.head,
    body = document.body;

const Ezy = {
    plugins: [],
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
        return /^[a-zA-Z]+$/.test(data);
    },
    isEmail(data) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
    },
    isDate(data) {
        return /^(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2([0-9]{2})?[0-9]{2}$/.test(data);
    },
    validatePipe(obj, data, traceback) {
        if (!data.pipe.receive || typeof data.pipe.receive !== "object") {
            error(`[ezy.js] CRITICAL ERROR: Pipe Error: Error when rendering, expected object[string,function], found ${data.pipe.receive}, in ${traceback}`);
            return obj.set(8);
        }
        for (let i in data.pipe.receive) {
            const sobj = data.pipe.receive[i];
            if (typeof sobj.func !== "function") {
                error(`[ezy.js] CRITICAL ERROR: Structure Error: Error when piping, expected data.pipe.receive.*.func as function, found ${typeof sobj.func}, in ${traceback}`);
                return obj.set(1);
            }
            if (!Array.isArray(sobj.data)) {
                error(`[ezy.js] CRITICAL ERROR: Structure Error: Error when piping, expected data.pipe.receive.*.data as array, found ${typeof sobj.data}, in ${traceback}`);
                return obj.set(1);
            }
        }
        if (!data.pipe.name) {
            error(`[ezy.js] CRITICAL ERROR: Structure Error: Error when piping, expected data.pipe.name, in ${traceback}`);
            return obj.set(1);
        }
    },
    validateComponentIf(obj, item, traceback) {
        if (item) {
            if (!obj.varage[item]) {
                error(`[ezy.js] CRITICAL ERROR: Value Error: render.varage[component.if] not found, in ${traceback}`);
                return obj.set(5);
            }
            if (typeof obj.varage[item] !== "function") {
                error(`[ezy.js] CRITICAL ERROR: Value Error: expected render.varage[component.if] as function, found ${typeof obj.varage[item]}, in ${traceback}`);
                return obj.set(5);
            }
            return !obj.varage[item]();
        }
    },
    validateValidation(obj, el, validate, traceback) {
        if (validate && typeof validate === "string") {
            if (Ezy[validate])
                if (typeof Ezy[validate] === "function")
                    el.addEventListener("input", function (e) {
                        if (Ezy[validate](e.target.value)) {
                            el.classList.add("valid");
                            el.classList.remove("invalid");
                        } else {
                            el.classList.remove("valid");
                            el.classList.add("invalid");
                        }
                    });
                else {
                    error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected component.validate in Ezy as function, found ${typeof Ezy[validate]}, in ${traceback}`);
                    return obj.set(3);
                }
            else {
                error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, Ezy[component.validate] not found, in ${traceback}`);
                return obj.set(3);
            }
        }
    },
    split(data, chars, dis) {
        const spliters = new Set(chars),
            disallows = {},
            result = [],
            stack = [],
            secondResult = [];
        for (let i of dis) {
            disallows[i[0]] = i[1];
            disallows[i[1]] = i[0];
        }
        let last = "",
            temporary = [];
        for (let char of data) {
            if (spliters.has(char) && equal(stack)) {
                secondResult.push(temporary.join(""));
                if (last !== char) {
                    result.push([...secondResult]);
                    secondResult.length = 0;
                }
                temporary.length = 0;
                last = char;
                continue;
            }
            if (char in disallows) {
                if (stack.length !== 0 && char in stack[stack.length - 1]) {
                    stack[stack.length - 1][char]++;
                } else {
                    if (!equal([stack[stack.length - 1]])) {
                        throw new Error(`[ezy.js] CRITICAL ERROR: Parsing Error: Error when parsing, unclosed ${max(stack[stack.length - 1])}.`);
                    }
                    let _ = {};
                    _[char] = 1;
                    _[disallows[char]] = 0;
                    stack.push(_);
                }
            }
            temporary.push(char);
        }
        if (temporary) secondResult.push(temporary.join(""));
        if (secondResult) result.push([...secondResult]);
        return result;
    },
    flat(data) {
        let result = [];
        for (let i of data) {
            if (Array.isArray(i)) result.push(...this.flat(i));
            else result.push(i);
        }
        return result;
    },
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
};

// render

const varage = {},// variable storage (?cold joke)
    vars = new Set(["content", "toolbar", "userbar", "footer"]);// Ensure that third party can use the given name in asVar (name) as variable in JS
class render {
    constructor(el, data, maxWait = 60000, namespace = {}) {
        this.maxWait = maxWait;
        this.data = data;
        this.expireEls = [];
        this.mains = [];
        this.pipes = {};
        this.frameID = undefined;
        if (!data) {
            this.set(1);
            this.loadPage = this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure missing.", 404, this.maxWait);
            return this;
        }
        for (let i in required) {
            namespace[i] = namespace[i] || required[i];
        }
        if (data.classify) {
            this.classify = data.classify;
        }
        if (!this.data.main) {
            this.set(1);
            this.loadPage = this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure attribute \"main\" missing.", 404, this.maxWait);
            return this;
        }
        this.config = data.config || {};
        this.namespace = namespace;
        if (typeof el === "string") this.mainEl = $(el);
        else this.mainEl = el;
        this.original = this.mainEl.innerHTML;
        this.el = document.createDocumentFragment();
        this.reRender();
        if (this.statusCode !== 0) return this;
    }
    reRender() {
        if (!this.config.keepConsole) console.clear();
        this.historyRender = +new Date();
        if (this.loadPage) this.clearLoading();
        if (!this.data) {
            this.set(1);
            this.loadPage = this.loadingPage("[ezy.js] CRITICAL ERROR: Structure Error: Data structure missing.", 404, this.maxWait);
            return;
        }
        this.loadPage = this.loadingPage("", 404, this.maxWait);
        this.clear();
        this.varage = { ...varage, ...(this.data.data || {}) };
        this.statusCode = 0;
        this.systemPlot = {
            time: 0
        };
        this.expireEls.length = 0;
        this.mains.length = 0;
        for (var key in this.pipes) {
            delete this.pipes[key];
        }
        this.interval = false;
        if (this.oldTimeout) clearTimeout(this.oldTimeout);
        this.oldTimeout = setTimeout(() => { this.interval = true; this.loop(); }, 1000 - ((+new Date()) % 1000));
        this.main();
        if (this.statusCode !== 0) return;
        if (this.el) this.mainEl.appendChild(this.el);
        this.clearLoading();
        log(`[noReact] Debug Message: : Render consumed ${new Date() - this.historyRender} ms`);
    }
    main() {
        this.statusCode = 0;
        if (this.data.onStart) {
            this.preRender(this.data.onStart);
        } else console.warn("MAJOR SUGGESTION: : Suggest adding onStart function list to handle preprocess");
        for (let i of Ezy.plugins) i.onStart?.(this.data);
        if (!this.data.main) {
            this.set(1);
            error("[ezy.js] CRITICAL ERROR: Structure Error: Data structure incomplete.");
            this.loadPage = this.loadingPage("", 404, this.maxWait, "page.data.main");
            return;
        }
        this.mainRender(this.data.main);
        if (this.statusCode !== 0) return;
        log(`[ezy.js] Render Program exits ${this.statusCode == 0 ? "" : "un"}successfully. Status Code: ${this.statusCode}`);
        if (this.data.onLoad) for (let i of this.data.onLoad) i(this.data);
        else console.warn("[ezy.js] MINOR SUGGESSION: : Suggest adding onLoad function list to handle onLoad process");
        for (let i of Ezy.plugins) i.onLoad?.(this.data);
        if (this.statusCode !== 0) return;
    }
    loop() {
        const date = +new Date();
        let t = 0;
        for (let i of [...this.expireEls]) {
            if (i.date <= date) {
                i.el.innerHTML = "";
                i.el.parentNode.removeChild(i.el);
                if (i.obj.pipe) delete this.pipes[i.obj.pipe.name];
                this.expireEls.splice(t, 1);
                setTimeout(() => {
                    if (i.expired) i.expired();
                }, 0);
                t--;
            }
            t++;
        }
        for (let i of this.mains) {
            i.func(i.obj, i.el);
        }
        cancelAnimationFrame(this.frameID);
        if (this.interval)
            this.frameID = requestAnimationFrame(this.loop.bind(this));
    }
    pipe2(sender, receiver, data) {
        if (!(sender in this.pipes)) {
            error(`[ezy.js] CRITICAL ERROR: Pipe Error: Error when piping, trying to send message from ${sender}, not found in this.pipes`);
            return this.set(8);
        }
        if (!(receiver in this.pipes)) {
            error(`[ezy.js] CRITICAL ERROR: Pipe Error: Error when piping, trying to send message to ${receiver}, not found in this.pipes`);
            return this.set(8);
        }
        if (!(sender in this.pipes[receiver].receive)) {
            error(`[ezy.js] CRITICAL ERROR: Pipe Error: Error when piping, try to receive message from ${sender}, not found in this.pipes.${receiver}.receive`);
            return this.set(8);
        }
        const obj = this.pipes[receiver].receive[sender];
        obj.func(data, ...obj.data);
    }
    edit(key, data) {
        this.varage[key] = data;
    }
    read(key) {
        if (key in this.varage) return this.varage[key];
        else throw new unknownVariableError(`[ezy.js] Critical Error: Variable Error: Variable "${key}" not found`);
    }
    preRender(data) {
        for (let i of data.funcs) {
            i(this.data);
        }
    }
    sectionRender = (sectionData, parentElement, sectionName, title, createElement, special = false) => {
        const traceback = `page ${title} -> ${sectionName}`;
        if (!sectionData) {
            error(`[ezy.js] CRITICAL ERROR: Value Error: function found first parameter in ${sectionData}, expected object, in ${traceback}`);
            return this.set(5);
        }
        const todo = document.createDocumentFragment();
        this.systemPlot.time = 0;
        for (let i in sectionData) {
            const item = sectionData[i];
            if (Ezy.validateComponentIf(this, item.if, traceback)) continue;
            if (this.statusCode !== 0) return;
            const el = createElement(i, item, i.config || {});
            if (this.statusCode !== 0) return;
            if (!(el instanceof Node)) {
                error(`[ezy.js] CRITICAL ERROR: Value Error: argument-function "createElement" return unexpected value, expected Node(or NodeLike object), in page ${traceback}`);
                return this.set(5);
            }
            if (!special) {
                this.beforePlugComponent(el, traceback);
                if (this.statusCode !== 0) return;
                if (item.varAs) this.asVar(el, i, traceback);
                if (this.statusCode !== 0) return;
                this.plugComponent(el, traceback);
                if (this.statusCode !== 0) return;
            }
            todo.appendChild(el);
            this.systemPlot.time++;
        }
        parentElement.appendChild(todo);
    };
    contentRender = (_, i, config) => {
        const title = this.data.main.title,
            traceback = `page ${title} -> content`;
        if (typeof i === "string") {
            if (!this.classify) {
                error(`[ezy.js] CRITICAL ERROR: Classify Error: Error when trying to use classify component without classify dictionary, in ${traceback}`);
                return this.set(7);
            }
            if (!this.classify[i]) {
                error(`[ezy.js] CRITICAL ERROR: Classify Error: Error when trying to use classify component "${i}" without definition, in ${traceback}`);
                return this.set(7);
            }
            i = this.classify[i];
        }
        const todo = document.createDocumentFragment();
        if (i.forEach) {
            if (this.varage[i.forEach] === undefined) {
                error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected forEach variable, not found, in ${traceback}`);
                return this.set(3);
            }
            const obj = this.varage[i.forEach];
            if (!(obj && typeof obj === "object")) {
                error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected object as forEach variable value, found ${obj}, in ${traceback}`);
                return this.set(3);
            }
            let first = -1;
            for (let k in obj) {
                first++;
                const card = $$(i.tag || config.tag || "div");
                card.classList.add(...(i.type || []), ...(config.type || []));
                if (i.expire) {
                    this.expireEls.push({
                        el: card,
                        date: i.expire.date,
                        expired: i.expire.expired || emptyFunc,
                        obj: i
                    });
                }
                Ezy.validateValidation(this, card, i.validate, traceback);
                if (this.statusCode !== 0) return;
                if (i.main) {
                    if (typeof i.main !== "function") {
                        error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected component.main attribute as function, found ${typeof i.main}, in ${traceback}`);
                        return this.set(3);
                    }
                    this.mains.push({
                        el: card,
                        obj: i,
                        func: i.main
                    });
                }
                if (i.pipe) {
                    Ezy.validatePipe(this, i.pipe, traceback);
                    if (this.statusCode !== 0) return;
                    this.pipes[i.pipe.name] = i.pipe;
                }
                const replacement = {
                    ...this.systemPlot, ...(i.inherit || {}), key: k, item: obj[k]
                };
                if (i.data) for (let k in i.data) {
                    card.setAttribute(`data-${camel2array(k).join("-")}`, this.preCompileStr(i.data[k], traceback, replacement));
                }
                this.beforePlugComponent(card, traceback);
                if (this.statusCode !== 0) return;
                if (first == 0 && i.varAs) {
                    this.asVar(card, i.varAs, traceback);
                    if (this.statusCode !== 0) return;
                }
                if (i.text) card.title = this.preCompileStr(i.text, traceback, replacement);
                todo.appendChild(card);
                this.plugComponent(card, traceback);
                if (this.statusCode !== 0) return;
                applyStyles(card, i.style);
                for (let j in (i.events || {})) {
                    this.addListener(j, i, card, traceback);
                    if (this.statusCode !== 0) return;
                }
                card.innerHTML += this.preCompileStr(
                    (i.content || ""),
                    traceback, replacement
                );
                if (this.statusCode !== 0) return;
                for (let j in i) {
                    if (keyword.has(j)) continue;
                    card.setAttribute(j, this.preCompileStr(i[j], traceback, replacement));
                }
                this.pushComponent(i, card, traceback, replacement);
                if (this.statusCode !== 0) return;
            }
        } else
            for (let k = 0; k < (i.times || 1); k++) {
                const card = $$(i.tag || config.tag || "div");
                card.classList.add(...(i.type || []), ...(config.type || []));
                if (i.expire) {
                    this.expireEls.push({
                        el: card,
                        date: i.expire.date,
                        expired: i.expire.expired || emptyFunc,
                        obj: i
                    });
                }
                Ezy.validateValidation(this, card, i.validate, traceback);
                if (this.statusCode !== 0) return;
                if (i.main) {
                    if (typeof i.main !== "function") {
                        error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected component.main attribute as function, found ${typeof i.main}, in ${traceback}`);
                        return this.set(3);
                    }
                    this.mains.push({
                        el: card,
                        obj: i,
                        func: i.main
                    });
                }
                if (i.pipe) {
                    Ezy.validatePipe(this, i.pipe, traceback);
                    if (this.statusCode !== 0) return;
                    this.pipes[i.pipe.name] = i.pipe;
                }
                if (i.data) for (let k in i.data) {
                    card.setAttribute(`data-${camel2array(k).join("-")}`, this.preCompileStr(i.data[k], traceback, i.inherit || {}));
                }
                this.beforePlugComponent(card, traceback);
                if (this.statusCode !== 0) return;
                if (k == 0 && i.varAs) {
                    this.asVar(card, i.varAs, traceback);
                    if (this.statusCode !== 0) return;
                }
                if (i.text) card.title = this.preCompileStr(i.text, traceback, i.inherit || {});
                todo.appendChild(card);
                this.plugComponent(card, traceback);
                if (this.statusCode !== 0) return;
                applyStyles(card, i.style);
                for (let j in (i.events || {})) {
                    this.addListener(j, i, card, traceback);
                    if (this.statusCode !== 0) return;
                }
                card.innerHTML += this.preCompileStr(
                    (i.content || ""),
                    traceback, i.inherit || {}
                );
                if (this.statusCode !== 0) return;
                for (let j in i) {
                    if (keyword.has(j)) continue;
                    card.setAttribute(j, this.preCompileStr(i[j], traceback, i.inherit));
                }
                this.pushComponent(i, card, traceback, i.inherit);
                if (this.statusCode !== 0) return;
            }
        return todo;
    };
    mainRender(pageData) {
        this.sectionRender(pageData, this.el, pageData.name || "", pageData.title || "", this.contentRender, true);
        if (this.statusCode !== 0) return;
    }
    set(code) {
        this.statusCode = code;
    }
    evaluateExpression(expr, traceback, extraScope) {
        expr = expr.trim();
        if (!expr) return "";
        let last = false,
            double = false,
            exist = false;
        for (let i of expr) {
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
            let varName = [],
                first = true,
                result = undefined;
            for (let char of expr) {
                if (char === "|") {
                    let name = varName.join("").trim();
                    if (first) {
                        if (extraScope[name]) {
                            result = extraScope[name];
                        }
                        else {
                            error(`[ezy.js] CRITICAL ERROR: Parsing Error: Error when trying to access variable ${name}, not found, in ${traceback}`);
                            return this.set(5);
                        }
                        first = false;
                    } else {
                        name = Ezy.flat(Ezy.split(name, [":"], [["{", "}"], ["\"", "\""], ["'", "'"]]));
                        if (extraScope[name[0]]) {
                            if (typeof extraScope[name[0]] === "function") result = this.evaluateExpression(`${name[0]}(result, ${name.filter((_, i) => i).join(", ")})`,
                                traceback, { ...extraScope, result: result });
                            else {
                                error(`[ezy.js] CRITICAL ERROR: Parsing Error: Error when parsing, expected filter as function, found ${typeof extraScope[name[0]]}, not found, in ${traceback}`);
                                return this.set(5);
                            }
                        }
                        else {
                            error(`[ezy.js] CRITICAL ERROR: Parsing Error: Error when trying to access variable ${name[0]}, not found, in ${traceback}`);
                            return this.set(5);
                        }
                    }
                    varName.length = 0;
                } else varName.push(char);
            }
            let name = varName.join("").trim();
            if (first) {
                if (extraScope[name]) {
                    result = extraScope[name];
                }
                else {
                    error(`[ezy.js] CRITICAL ERROR: Parsing Error: Error when trying to access variable ${name}, not found, in ${traceback}`);
                    return this.set(5);
                }
                first = false;
            } else {
                name = Ezy.flat(Ezy.split(name, [":"], [["{", "}"], ["\"", "\""], ["'", "'"]]));
                if (extraScope[name[0]]) {
                    if (typeof extraScope[name[0]] === "function") result = this.evaluateExpression(`${name[0]}(result, ${name.filter((_, i) => i).join(", ")})`,
                        traceback, { ...extraScope, result: result });
                    else {
                        error(`[ezy.js] CRITICAL ERROR: Parsing Error: Error when parsing, expected filter as function, found ${typeof extraScope[name[0]]}, not found, in ${traceback}`);
                        return this.set(5);
                    }
                }
                else {
                    error(`[ezy.js] CRITICAL ERROR: Parsing Error: Error when trying to access variable ${name[0]}, not found, in ${traceback}`);
                    return this.set(5);
                }
            }
            return result;
        }
        const keys = Object.keys(extraScope);
        const values = keys.map(k => extraScope[k]);

        try {
            const fn = new Function(...keys, `return (${expr})`);
            const result = fn(...values);
            return result === undefined ? '' : String(result);
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.warn(`[ezy.js] Warning: Variable not defined in "${expr}" at ${traceback}`);
                return '';
            }
            error(`[ezy.js] CRITICAL ERROR: Failed to evaluate "${expr}" in ${traceback}`, e);
            this.set(6);
            return '';
        }
    }
    preCompileStr(data, traceback, replacement = {}, pipeData = {}) {
        let result = [],
            skip = false,
            startVar = false,
            longVar = false,
            stop = false,
            doubleStop = false,
            varName = [];
        replacement = { ...this.systemPlot, ...replacement };
        let newReplacement = {};
        const _varage = { ...this.varage, ...pipeData };
        for (let i in replacement) {
            for (let t of (dictionary[i] || [i])) {
                newReplacement[t] = replacement[i];
            }
        }
        for (let i in newReplacement)
            data = data.replaceAll(`{{${i}}}`, newReplacement[i]);
        for (let i of data) {
            if (skip) {
                if (varName.length) varName.push(i);
                else result.push(i);
                skip = false;
                continue;
            }
            if ((stop && !longVar) || (doubleStop && longVar)) {
                varName = varName.join("").trim();
                const _var = stop ? _varage : newReplacement;
                if (_var[varName])
                    if ((typeof _var[varName]) === "function")
                        result.push(String(_var[varName]()));
                    else
                        result.push(String(_var[varName]));
                else {
                    try {
                        result.push(String(this.evaluateExpression(varName, traceback, _var)));
                    } catch (e) {
                        error(`[ezy.js] CRITICAL ERROR: EVAL Error: Error when trying to eval expression ${varName}, as below, in ${traceback}`);
                        error(e);
                        return this.set(6);
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
                    error(`[ezy.js] CRITICAL ERROR: Formatting Error: Error when formatting string, unexpected character "{" within value, in ${traceback}`);
                    return this.set(3);
                }
                if (longVar) {
                    error(`[ezy.js] CRITICAL ERROR: Formatting Error: Error when formatting string, unexpected character "{" with two openings already, in ${traceback}`);
                    return this.set(3);
                }
                if (startVar) {
                    startVar = false;
                    longVar = true;
                } else
                    startVar = true;
                continue;
            }
            if (i === "}") {
                if (!(startVar || longVar)) {
                    error(`[ezy.js] CRITICAL ERROR: Formatting Error: Error when formatting string, unexpected ending without any opening, in ${traceback}`);
                    return this.set(3);
                }
                if (stop) {
                    if (startVar) {
                        error(`[ezy.js] CRITICAL ERROR: Formatting Error: Error when formatting string, unexpected double ending with single opening, in ${traceback}`);
                        return this.set(3);
                    }
                    stop = false;
                    doubleStop = true;
                    continue;
                }
                if (startVar) {
                    startVar = false;
                    if (doubleStop) {
                        error(`[ezy.js] CRITICAL ERROR: Formatting Error: Error when formatting string, unexpected ending with single opening already, in ${traceback}`);
                        return this.set(3);
                    }
                    stop = true;
                }
                if (longVar) {
                    if (stop) {
                        doubleStop = true;
                        stop = false;
                    } else stop = true;
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
            error(`[ezy.js] CRITICAL ERROR: Formatting Error: Error when formatting string, unclosed double opening, in ${traceback}`);
            return this.set(3);
        }
        if (startVar && !stop) {
            error(`[ezy.js] CRITICAL ERROR: Formatting Error: Error when formatting string, unclosed single opening, in ${traceback}`);
            return this.set(3);
        }
        if (skip) {
            error(`[ezy.js] CRITICAL ERROR: Format Error: Error when formatting string, expected any character after \\ in ${traceback}`);
            return this.set(3);
        }
        varName = varName.join("").trim();
        if (stop || doubleStop) {
            const _var = stop ? _varage : newReplacement;
            if (_var[varName])
                if ((typeof _var[varName]) === "function")
                    result.push(String(_var[varName]()));
                else
                    result.push(String(_var[varName]));
            else {
                try {
                    result.push(String(this.evaluateExpression(varName, traceback, _var)));
                } catch (e) {
                    error(`[ezy.js] CRITICAL ERROR: EVAL Error: Error when trying to eval expression ${varName}, as below, in ${traceback}`);
                    error(e);
                    return this.set(6);
                }
            }
        }
        return result.join("");
    }
    pushComponent(i, parentNode, traceback, replacement = {}) {
        let own = {
            time: 0
        },
            todo = document.createDocumentFragment();
        const config = i.config || {};
        for (let j of (i.component || [])) {
            if (typeof j === "string") {
                if (!this.classify) {
                    error(`[ezy.js] CRITICAL ERROR: Classify Error: Error when trying to use classify component without classify dictionary, in ${traceback}`);
                    return this.set(7);
                }
                if (!this.classify[j]) {
                    error(`[ezy.js] CRITICAL ERROR: Classify Error: Error when trying to use classify component "${j}" without definition, in ${traceback}`);
                    return this.set(7);
                }
                j = this.classify[j];
            }
            if (Ezy.validateComponentIf(this, j.if, traceback)) continue;
            if (this.statusCode !== 0) return;
            if (j.forEach) {
                if (this.varage[j.forEach] === undefined) {
                    error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected forEach variable, not found, in ${traceback}`);
                    return this.set(3);
                }
                const obj = this.varage[j.forEach];
                if (!(obj && typeof obj === "object")) {
                    error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected object as forEach variable value, found ${obj}, in ${traceback}`);
                    return this.set(3);
                }
                let first = -1;
                for (let k in obj) {
                    first++;
                    const el = $$(j.tag || config.tag || "div");
                    el.classList.add(...(j.type || []), ...(config.type || []));
                    applyStyles(el, j.style);
                    let myTraceback = traceback + ` -> ${el.tagName}${el.id ? "#" + el.id : ""}.${[...el.classList].join(".")}`;
                    for (let evt in j.events) {
                        this.addListener(evt, j, el, myTraceback);
                        if (this.statusCode !== 0) return;
                    }
                    const replace = { ...replacement, ...j.inherit, key: k, item: obj[k], ...own };
                    for (let parm in j) {
                        if (keyword.has(parm)) continue;
                        el.setAttribute(parm, this.preCompileStr(j[parm], myTraceback, replace));
                    }
                    el.innerHTML = this.preCompileStr(
                        (j.content || ""), myTraceback, replace
                    );
                    if (this.statusCode !== 0) return;
                    if (j.expire) {
                        this.expireEls.push({
                            el,
                            date: j.expire.date,
                            expired: j.expire.expired || emptyFunc,
                            obj: j
                        });
                    }
                    Ezy.validateValidation(this, el, j.validate, traceback);
                    if (this.statusCode !== 0) return;
                    if (j.main) {
                        if (typeof j.main !== "function") {
                            error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected component.main attribute as function, found ${typeof j.main}, in ${traceback}`);
                            return this.set(3);
                        }
                        this.mains.push({
                            el,
                            obj: j,
                            func: j.main
                        });
                    }
                    if (j.pipe) {
                        Ezy.validatePipe(this, j.pipe, traceback);
                        if (this.statusCode !== 0) return;
                        this.pipes[j.pipe.name] = j.pipe;
                    }
                    if (j.text) el.title = this.preCompileStr(j.text, myTraceback, replace);
                    if (j.data) for (let k in j.data) {
                        el.setAttribute(`data-${camel2array(k).join("-")}`, this.preCompileStr(j.data[k], myTraceback, replace));
                    }
                    this.beforePlugComponent(el, myTraceback);
                    if (this.statusCode !== 0) return;
                    if (first == 0) {
                        this.asVar(el, j.varAs, myTraceback);
                        if (this.statusCode !== 0) return;
                    }
                    todo.appendChild(el);
                    this.plugComponent(el, myTraceback);
                    if (this.statusCode !== 0) return;
                    this.pushComponent(j, el, myTraceback, replace);
                    if (this.statusCode !== 0) return;
                }
            } else {
                for (let k = 0; k < (j.times || 1); k++) {
                    const el = $$(j.tag || config.tag || "div");
                    el.classList.add(...(j.type || []), ...(config.type || []));
                    applyStyles(el, j.style);
                    let myTraceback = traceback + ` -> ${el.tagName}${el.id ? "#" + el.id : ""}.${[...el.classList].join(".")}`;
                    for (let evt in j.events) {
                        this.addListener(evt, j, el, myTraceback);
                        if (this.statusCode !== 0) return;
                    }
                    for (let parm in j) {
                        if (keyword.has(parm)) continue;
                        el.setAttribute(parm, this.preCompileStr(j[parm], myTraceback, { ...replacement, ...j.inherit, ...own }));
                    }
                    el.innerHTML = this.preCompileStr(
                        (j.content || ""), myTraceback, { ...replacement, ...j.inherit, ...own }
                    );
                    if (this.statusCode !== 0) return;
                    if (j.expire) {
                        this.expireEls.push({
                            el,
                            date: j.expire.date,
                            expired: j.expire.expired || emptyFunc,
                            obj: j
                        });
                    }
                    Ezy.validateValidation(this, el, j.validate, traceback);
                    if (this.statusCode !== 0) return;
                    if (j.main) {
                        if (typeof j.main !== "function") {
                            error(`[ezy.js] CRITICAL ERROR: Rendering Error: Error when rendering, expected component.main attribute as function, found ${typeof j.main}, in ${traceback}`);
                            return this.set(3);
                        }
                        this.mains.push({
                            el,
                            obj: j,
                            func: j.main
                        });
                    }
                    if (j.pipe) {
                        Ezy.validatePipe(this, j.pipe, traceback);
                        if (this.statusCode !== 0) return;
                        this.pipes[j.pipe.name] = j.pipe;
                    }
                    if (j.text) el.title = this.preCompileStr(j.text, myTraceback, { ...replacement, ...j.inherit, ...own });
                    if (j.data) for (let k in j.data) {
                        el.setAttribute(`data-${camel2array(k).join("-")}`, this.preCompileStr(j.data[k], myTraceback, { ...replacement, ...j.inherit, ...own }));
                    }
                    this.beforePlugComponent(el, myTraceback);
                    if (this.statusCode !== 0) return;
                    if (k == 0) {
                        this.asVar(el, j.varAs, myTraceback);
                        if (this.statusCode !== 0) return;
                    }
                    todo.appendChild(el);
                    this.plugComponent(el, myTraceback);
                    if (this.statusCode !== 0) return;
                    this.pushComponent(j, el, myTraceback, { ...replacement, ...j.inherit, ...own });
                    if (this.statusCode !== 0) return;
                }
            }
            own.time++;
            parentNode.appendChild(todo);
            todo.replaceChildren();
        }
        return 0;
    }
    asVar(el, varAs, traceback) {
        if (varAs) {
            if (vars.has(varAs)) {
                error(`[ezy.js] CRITICAL ERROR: ID Error: when rendering ${el.tagName}.${[...el.classList].join(".")}, id collide to "${varAs}", in ${traceback}`);
                return this.set(2);
            }
            vars.add(varAs);
            el.id = varAs;
        }
    }
    clear() {
        removeChild(this.mainEl);
        this.mainEl.innerHTML = this.original;
        vars.clear();
        for (let i of ["content", "toolbar", "userbar", "footer"]) vars.add(i);
    }
    plugComponent(el, traceback) {
        for (let i of Ezy.plugins) {
            i.onComponentLoad?.(this, el, traceback);
            if (this.statusCode !== 0) return;
        }
    }
    beforePlugComponent(el, traceback) {
        for (let i of Ezy.plugins) {
            i.beforeComponentLoad?.(this, el, traceback);
            if (this.statusCode !== 0) return;
        }
    }
    addListener(j, i, el, traceback) {
        let obj = i.events[j],
            { listener } = obj;
        if (!listener) {
            error(`[ezy.js] MINOR ERROR: Value Error: Expected "listener" attribute in second parameter -> events[first parameter], in ${traceback}`);
            return this.set(5);
        }
        if (obj.preventDefault)
            el.addEventListener(removePrefix(j, "on"), function (e) {
                e.preventDefault();
                for (let i of listener) i(e);
            });
        else
            el.addEventListener(removePrefix(j, "on"), function (e) {
                for (let i of listener) i(e);
            });
    }
    loadingPage(msg, errorCode, guillotine = 60000, reason = "page.data", parentNode = body) {// hell meme
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
            id: setTimeout(() => {
                parentNode.removeChild(pot);
                this.errorPage(msg, errorCode, reason, parentNode);
            }, guillotine)
        };
    }
    errorPage(msg, errorCode, reason = "page.data", parentNode = body) {
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
        another.innerHTML = `Resource ${reason} not found`;
        another.style.fontSize = "18px";
        another.style.color = "black";
        another.style.padding = "0 50px";
        another.style.width = "auto";
        another.style.height = "auto";
        pot.appendChild(div);
        pot.appendChild(another);
        parentNode.appendChild(pot);
    }
    clearLoading() {
        if (!this.loadPage) return;
        clearTimeout(this.loadPage.id);
        if (this.loadPage.parent.contains(this.loadPage.obj))
            this.loadPage.parent.removeChild(this.loadPage.obj);
        this.loadPage = undefined;

    }
}