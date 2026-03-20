# Ezy.js - Tutorial

If you meet any errors, please see if [this](q&a.md) can fix it, otherwise please [contact me](mailto:ezyjsdeveloper@gmail.com)

## Start
To get started, please clone the project to local first:
```sh
git clone https://github.com/liam274/Ezy.js.git
```
Or using CDN to get it, if you prefer:
```url
https://cdn.jsdelivr.net/gh/liam274/Ezy.js@0.1.0-stable/Ezy.js/main.js
```
Then you can import the framework
```JavaScript
import * as ezy from "./main.js";
import * as ezy from "https://cdn.jsdelivr.net/gh/liam274/Ezy.js@0.1.0-stable/Ezy.js/main.js";
```

## Hello, world!
```JavaScript
import * as ezy from "./main.js";
new ezy.render(
    "#app",
    {
        config:{
            urlFilter:{// Note that urlFilter is a **MUST** in render objects.
                rules:[".*"],// This is not suggested, as this may allows malicious redirection
                confirmer:()=>true,// This function can only be set once in the render object.
                // The object will rely on this to confirm if the rules is malicious or not, preventing XSS reset rules
                reporter:()=>undefined// This function will be called when confirmer returns false(which means the rules has been maliciously changed)
            },
            escapeHTML:true// This triggers the XSS protection
        },
        component:[
            {
                tag:"h1",
                content:"Hello, world!"
            }
        ]
    }
);
```
Note that many of the render methods sets statusCode, please check the `renderObj.statusCode` to confirm that the method exists without errors.

## Varage(Variables)
For setting variables, we have a [private attribute](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) named as `#varage` to maintain variable use in Ezy.js. Should you never use `#varage` to store sensitive informations.

Initally, if you want to define initial variables in a render object:
```JavaScript
new ezy.render(
    "#app",
    {
        ...,
        data:{
            pager:"I'm a place holder"
        },
        component:[
            {
                tag:"h1",
                content:"Who are you?"
            },
            {
                tag:"h1",
                content:"{pager}"// -> I'm a place holder
            }
        ]
    }
);
```
You can use the `read` method to get the current variable value in `#varage`:
```JavaScript
// Let's assume that you use renderObj to store the render instance:
renderObj.read("pager");// returns "I'm a place holder"
```
You can use the `edit` method to edit variables in `#varage`:
```JavaScript
renderObj.edit("pager","I'm a Ezy.js developer!");// But wait... why the content is still "I'm a place holder"?
```
It's because *Ezy.js* is a passive framework, so it will not react unless you explicitly command it.
So we're here to introduce...

## Belt Syntax!
For reacting variable changes, we're here to introduce the following syntax in great honour:
```JavaScript
component:[
    ...,
    {
        tag:"h1",
        content:"{pager}",
        belt:{
            buckle:["pager"]
        }
    },
    ...
]
```
So from now on, if the pager is edited, *Ezy.js* will automatically update the buckled CO's **PARENT CO**. Yet, again, note that the CO that's changed is its **PARENT CO**. So:
```JavaScript
renderObj.edit("pager","I'm a Ezy.js developer!");// The content is now "I'm a Ezy.js developer"!
```
But this will cause problem if you want to keep the same-level elements of the buckled CO... So we suggested putting the CO into a style-less div to avoid resource-eating and accidental re-render:
```JavaScript
component:[
    ...,
    {
        component:[
            {
                tag:"h1",
                content:"{pager}",
                belt:{
                    buckle:["pager"]
                }
            }
        ]
    },
    ...
]
```