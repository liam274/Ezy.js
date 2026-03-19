# Ezy.js - Tutorial

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
            urlFilter:{
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