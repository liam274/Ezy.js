# Ezy.js

## Introduce
*Ezy.js* is a modern framework that developes in raw JavaScript. It allows **flexible** and **dynamic** page rendering via **JS** code and **JSON** file structure.

Note that this framework is ***NOT*** designed to build pages independently. Please use other backend languages to support the project, or any other ways you prefer.

## Attention
- Developers **MUST** detect the statusCode after reRender, as it might returns error code.
- Note that based on considerations of flexibilty, *Ezy.js* will not be fully responsible for XSS security or any other HTML-related attacks. If you want to implement such defenses, please view the lower config attributes, or using PHP or any other possible backend language to pre-render contents.

## Hello, world!
Here's a small "Hello world" example, for you to step forward:
```JavaScript
import * as ezy from "./main.js";
const proc=new ezy.render(// In case you want to reuse this object.
    ezy.body,// This is the body element of the HTML page
    {
        component:[
            {
                tag:"h1",
                content:"Hello, world!"
            }
        ]
    }
);
```

## Deployment
If you want to try my framework, you may git clone the project:
```bash
git clone https://github.com/liam274/Ezy.js.git
```
and deploy via python:
```bash
python -m http.server 80
```
or npx(Which is better for the router functions since python does not support that):
```bash
npx serve -s .
```
in the main directory.

## Data Structure

### Root
In the root data, we have:
- **component**, will be rendered as LRP.
- **onStart**, which is a list, its element will be executed before LRP is rendered.
- **onLoad**, which is a list, be executed after LRP is rendered.
- **config**, store configrations to the page.
- **data**, store the datas that should be in varage. It's safier then simply `varage.varName`, since it make sure it will be in the `render.varage`.

#### Config Attributes

**Attention!** The config mentioned here is the root config, not the virtual DOM config

- keepConsole<br />
Expect type: boolean<br />
Function: To disable the `console.clear()` in every reRender.
- style<br />
Expect type: Object<br />
Function: Define styles for the entire document, reducing the time consum of repeating inline style renders.<br />
- typeExtend<br />
Expect type: Object<br />
Function: pack up style classes, so developers can use one class references to mutliple number of classes.<br />
- debug<br />
Expect type: boolean<br />
Function: Decided rather showing warnings or not

#### General Config Attributes

**Attention!** These attributes are supported over **ALL** config objects.
- escapeHTML<br />
Expect type: boolean<br />
Function: To enable `utils.htmlEscape` on `content` attributes.
- tag<br />
Expect type: string<br />
Function: Define the default tag for childrens, if is not mentioned.

### Components
Except the specific root structure, *Ezy.js* is very dynamic and flexible, which means once you follow a certain pattern, you can build it in the way you like.

#### Introduce to attributes:
- component:
Component is a list, expected with objects included, which is called CO.
- CO:
*Ezy.js* is mainly about CO. Every attributes introduced in the certain list can be applied to CO.
- type:
The rendering engine will render it as classList. Note that it's expected as list.
- tag:
The rendering Engine will choose div as tagName, if tag is not definded.
- event & listener:
The rendering Engine will use element.addEventlistener to plug in events in events. Data Structure:
``` JavaScript
{
    eventName: {
        listener: [func1,func2,func3],// functions that you want to call in order, when the event is triggered
        preventDefault: false// rather you want to preventDefault action, or not.
    }
}
```
- style:
Type in Object. Its key should be in camel case. The rendering engine will try to plug key as css attribute while value as object.
- varAs:
If you want to access a variable with name of any, you shell use varAs in the object. The rendering engine will promise to protect rewriting actions via itself, while other Javascript actions it cannot stop.
- times:
Telling the rendering engine how many copies you want to copy on current component. **NOTE THAT, the rendering engine will not increase the renderIndex during making copies.**
- title:
Define a component's title
- text:
Define an element's title HTML attribute
- if:
Type in function. It will render the component only if the given function is returning true values
- content:
The innerHTML that will be set.
- inherit:
It will be inherited by its components
- validate:
Switch class via the given validation function name.
```JavaScript
{
    validate: {
        rules: ["validationFunctionName","somefunction:arg1:arg2"],
        required: true,// optional
        onCaught: function(){},// optional, triggered when father's submit actions is being caught by validate.required
        onValid: function(){},// optional, triggered when is valid
        onInvalid: function(){}// optional, triggered when is invalid
    }
}
```
- expire:
Type in object. It has subattributes like date, expired. The component will be removed on the nearest second in date(ceiling), and when expired, it will first let the UI update, then execute the expired function.
```JavaScript
{
    expire:{
        date:new Date(),// Date Object or number is fine
        expired:()=>{}// This function will be triggered after the element is expired. Optional
    }
}
```
- forEach:
It will loops through the given object to render components.
- pipes:
You can use pipes to send messages. Reciver **MUST** have pipe definded.
```JavaScript
{
    pipes: {
        receive: {
            receiveFrom: recieveFunc(messageFromReceiveFrom),
            ...
        }
    }
}
```
- main:
This is a function that will be executed in every milisecond, reciving the component object itself as the first argument while the component element as the second.
- data:
will be stored as data-* attributes.
- config:
Configuration to the element and its children(first-level children only).
- belt:
***BELT SYNTAX***. You can use `belt.buckle` to bind a varage variable, so when the variable is being changed, the CO will be re-rendered!
- _type:
defines the type attribute in HTML tag

## Builtin functions

- Ezy.navigate:
We ***strongly*** suggest to use this function instead of location.href or other behaviours.
```JavaScript
Ezy.navigate(href);// This function will be as the route guard, choosing to redirect the href or other behaviours.
```
For example:
```JavaScript
let allowPages=["exists.html"];
for(let i of allowPages) routeGuard.builtins.add(i);
routeGuard.guards.push(
    function(data){
        if (routeGuard.builtin.has(data)) {
            return { allow: true };
        } else {
            return { allow: false, href: "notFound.html" };
        }
    }
);
Ezy.navigate("doesNotExists.html");// will be redirected to notFound.html
```

## Specific Terminologies
- LRP(Late Render Page) means the page that will be rendered on the main process of *render*.
- CO(Component Object)
- First-level children:
In the following sample, `#a` and `#b` is the first-level children of `#root`, while `#b` is the first-level children of `#a`.
```HTML
<div id="root">
    <div id="a">
        <div id="b"></div>
    </div>
    <div id="c">
    </div>
</div>
```

## community
Discord: https://discord.gg/QhaEZTTgru

## Notice
- The `setting.html` is DESIGNED to pop up error, in order to test whether the `render.loadingPage` is working or not.