// ====================================================
// Ezy.js Demo – Counter with Validation (Fixed Version)
// Save this file as `try.js` and include it in your HTML.
// Ensure `main.js`, `utils.js`, and `main.css` are in the same directory.
// Your HTML should have a `<div id="app"></div>`.
// ====================================================

import { body } from "../main.js";
import { render, Ezy } from "./main.js";

// --- Register a simple global component (no parameters) ---
Ezy.component("info-box", {
    tag: "div",
    style: {
        border: "1px solid #ccc",
        padding: "1rem",
        marginTop: "1rem",
        backgroundColor: "#f9f9f9"
    },
    content: "ℹ️ This is an info box from a registered component."
});

// --- Main application ---
const app = new render(
    body,                             // root element
    {
        // Reactive variables (accessible via app.read / app.edit)
        data: {
            count: 0,
            email: ""
        },

        // Top‑level configuration
        config: {
            escapeHTML: false,            // enable XSS protection
            debug: true                  // show render timings in console
        },

        // Array of components to render
        component: [
            // ----- Title -----
            {
                tag: "h1",
                content: "🎉 Ezy.js Demo (Fixed)"
            },

            // ----- Counter display (auto‑updates via belt) -----
            {
                tag: "div",
                content: "Count: <strong>{count}</strong>",
                belt: {
                    buckle: ["count"]     // re‑render when `count` changes
                }
            },

            // ----- Counter buttons -----
            {
                tag: "div",
                component: [
                    {
                        tag: "button",
                        content: "➕ Increment",
                        events: {
                            onClick: {
                                listener: [
                                    () => {
                                        const current = app.read("count");
                                        app.edit("count", current + 1);
                                    }
                                ]
                            }
                        }
                    },
                    {
                        tag: "button",
                        content: "➖ Decrement",
                        events: {
                            onClick: {
                                listener: [
                                    () => {
                                        const current = app.read("count");
                                        app.edit("count", current - 1);
                                    }
                                ]
                            }
                        }
                    }
                ]
            },

            // ----- Email input with live validation -----
            {
                tag: "div",
                style: { marginTop: "2rem" },
                component: [
                    {
                        tag: "label",
                        content: "Email address (must be valid):"
                    },
                    {
                        tag: "input",
                        _type: "email",
                        placeholder: "you@example.com",
                        validate: {
                            rules: ["isEmail"],           // built‑in validator
                            onValid: () => console.log("✅ Valid email"),
                            onInvalid: () => console.log("❌ Invalid email")
                        },
                        events: {
                            onInput: {
                                listener: [
                                    (e) => app.edit("email", e.target.value)
                                ]
                            }
                        }
                    },
                    // Show the current email value (also updates via belt)
                    {
                        component: [{
                            tag: "p",
                            content: "Current email: {email}",
                            belt: { buckle: ["email"] }
                        }]
                    }
                ]
            },

            // ----- Use the registered component (by name) -----
            "info-box"
        ]
    }
);

console.log("Ezy.js demo running. Check the console for validation logs.");
