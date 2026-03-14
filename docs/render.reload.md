# Ezy.js - `render.reload`

This method will automatically be executed in the constructor. Its function is to clear and render the entire root DOM provided.

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