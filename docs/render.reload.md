# Ezy.js - `render.reload`

## Introduction
This method will automatically be executed in the constructor. Its function is to clear and render the entire root DOM provided.

Note that *Ezy.js* will assume that if you trigger the reload function, **EVERY DETAILS** is different, which means an entirely new cache for compiling. Please ***AVOID THIS FUNCTION*** as much as possible, since it's very heavy and wastes a lot of resources.


## Example
```JavaScript
import {render} from "./main.js";
const proc=new render(
    "#app",// Here, we assume that you have an element that has ID as app
    {
        component:[
            {
                tag:"span",
                content:"{+new Date()}"
            }
        ]
    }
);
setTimeout(()=>proc.reload(),1000);
/* Expected output:
X
(1 sec later)
X+1000
*/
```