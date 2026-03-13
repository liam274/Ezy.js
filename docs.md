# Ezy.js

If you're curious about our doucment's specific terminologies, please take a look [here](#specific-terminologies)

## Table of Contents

- [Data Structure](#data-structure)
- [Root Data Structure](#root)
- [Root Config](#root-config-attributes)
- [CO Config](#general-config-attributes)
- [CO Attributes](#introduce-to-attributes)
- [Builtins](#builtin-functions)
- [Plugins](#plugins)

## Data Structure

### Root
In the root data, we have:
- **component**, will be rendered as LRP.
- **onStart**, which is a list, its element will be executed before LRP is rendered.
- **onLoad**, which is a list, be executed after LRP is rendered.
- **config**, store configrations to the page.
- **data**, store the datas that should be in varage. It's safier then simply `varage.varName`, since it make sure it will be in the `render.varage`.

### Root Config Attributes

**Attention!** The config mentioned here is the root config, not the virtual DOM config

- keepConsole<br />
Expect type: boolean<br />
Function: To disable the `console.clear()` in every reload.
- style<br />
Expect type: Object<br />
Function: Define styles for the entire document, reducing the time consum of repeating inline style renders.<br />
- typeExtend<br />
Expect type: Object<br />
Function: pack up style classes, so developers can use one class references to mutliple number of classes.<br />
- debug<br />
Expect type: boolean<br />
Function: Decided rather showing warnings or not

### General Config Attributes

**Attention!** These attributes are supported over **ALL** config objects.
- escapeHTML<br />
Expect type: boolean<br />
Function: To enable `utils.htmlEscape` on `content` attributes.
- tag<br />
Expect type: string<br />
Function: Define the default tag for childrens, if is not mentioned.

### Components
Except the specific root structure, *Ezy.js* is very dynamic and flexible, which means once you follow a certain pattern, you can build it in the way you like.

*Ezy.js* is mainly about CO. Every attributes introduced in the certain list can be applied to CO.
#### Introduce to attributes:
| attribute name | Description | example |
| -------------- | ----------- | ------- |
| `component` | Component is a list, expected with objects included, which is called CO. |
| `type` | The rendering engine will render it as classList. Note that it's expected as list. |
| `tag` | The rendering Engine will choose div as tagName, if tag is not definded. |
| `event & listener` | The rendering Engine will use element.addEventlistener to plug in events in events. | [Example](example.md#event) |
| `style` | Type in Object. Its key should be in camel case. The rendering engine will try to plug key as css attribute while value as object. |
| `varAs` | If you want to access a variable with name of any, you shell use varAs in the object. The rendering engine will promise to protect rewriting actions via itself, while other Javascript actions it cannot stop. |
| `times` | Telling the rendering engine how many copies you want to copy on current component. **NOTE THAT, the rendering engine will not increase the renderIndex during making copies.**|
| `title` | Define a component's title|
| `text` | Define an element's title HTML attribute|
| `if` | Type in function. It will render the component only if the given function is returning true values|
| `content` | The innerHTML that will be set.|
| `inherit` | It will be inherited by its components|
| `validate` | Switch class via the given validation function name. | [Example](example.md#validate) |
| `expire` | Type in object. It has subattributes like date, expired. The component will be removed on the nearest second in date(ceiling), and when expired, it will first let the UI update, then execute the expired function. | [Example](example.md#expire) |
| `forEach` | It will loops through the given object to render components. |
| `pipes` | You can use pipes to send messages. Reciver **MUST** have pipe definded. | [Example](example.md#pipes) |
| `main` | This is a function that will be executed in every milisecond, reciving the component object itself as the first argument while the component element as the second. |
| `data` | will be stored as `data-*` attributes. |
| `config` | Configuration to the element and its children(first-level children only). |
| `belt` | ***BELT SYNTAX***. You can use `belt.buckle` to bind a varage variable, so when the variable is being changed, the CO will be re-rendered! |
| `_type` | defines the type attribute in HTML tag |
| `isFragment` | If it's set as truly values, the framework will use `document.createDocumentFragment()` to create the current element to pick up its components. Other Node-related attributes will be dismissed due to this attribute |

## Builtin functions

- `Ezy.navigate`:
We ***strongly*** suggest to use this function instead of location.href or other behaviours.
```JavaScript
Ezy.navigate(href);// This function will be as the route guard, choosing to redirect the href or other behaviours.
```
For example:
```JavaScript
import "./main.js";
const allowPages=["exists.html"];
for(const i of allowPages) ezy.routeGuard.builtins.add(i);
ezy.routeGuard.guards.push(
    function(data){
        if (routeGuard.builtin.has(data)) {
            return { allow: true };
        } else {
            return { allow: false, href: "notFound.html" };
        }
    }
);
ezy.Ezy.navigate("doesNotExists.html");// will be redirected to notFound.html
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

## Plugins
*Ezy.js* provided a wide range of life cycle hooks:
- `onStart`, which is triggered at every `render.render` is called
- `onLoad`, which is triggered when every render process is done
- `onComponentLoad`, which is triggered after any component is load
- `beforeComponentLoad`, which is triggered before any component is load
### *Note that developers have the responsibility to return an Object which delicates what eventListeners is hooked, what timeout is set, etc. Unless you don't want to clean it before every reload.*
This is the cleanup code:
```JavaScript
for (const i of this.#pluginLeftovers.timeouts) {
    clearTimeout(i);
}
for (const i of this.#pluginLeftovers.events) {
    document.removeEventListener(...i);
}
for (const i of this.#pluginLeftovers.animationFrames) {
    cancelAnimationFrame(i);
}
```