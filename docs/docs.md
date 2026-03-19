# Ezy.js

If you're curious about our doucment's specific terminologies, please take a look [here](#specific-terminologies)<br />
Also, please read [this](special-syntax.md) since there might be special syntax in the document that isn't valid JS syntax.

## Table of Contents

- [Data Structure](#data-structure)
- [Root Data Structure](#root)
- [Root Config](#root-config-attributes)
- [CO Config](#general-config-attributes)
- [CO Attributes](#introduce-to-attributes)
- [Builtins](#builtin-functions)
- [Plugins](#plugins)
- [Belt Syntax](#belt-syntax)
- [Template Syntax](#template-syntax)
- [Render Methods](#render-methods)
- [URL Filter Syntax](#url-filter-syntax)
- [Cross Object Store](#cross-object-store)
- [Global Variables](global-variables.md)
- [Async skills](async-skills.md)

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
Required: <span style="color: red">true</span><br />
Function: To disable the `console.clear()` in every reload.
- style<br />
Expect type: Object<br />
Required: <span style="color: red">true</span><br />
Function: Define styles for the entire document, reducing the time consum of repeating inline style renders.<br />
- typeExtend<br />
Expect type: Object<br />
Required: <span style="color: red">true</span><br />
Function: pack up style classes, so developers can use one class references to mutliple number of classes.<br />
- debug<br />
Expect type: boolean<br />
Required: <span style="color: red">true</span><br />
Function: Decided rather showing warnings or not
- urlFilter<br />
Expect type: Object<br />
Required: <span style="color: green">true</span><br />
Function: define request-related URL whitelist. [Details](#url-filter-syntax)

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
| `belt` | ***BELT SYNTAX***. You can use `belt.buckle` to bind a varage variable, so when the variable is being changed, the CO will be re-rendered! | [Example](#belt-syntax) |
| `_type` | defines the type attribute in HTML tag |
| `isFragment` | If it's set as truly values, the framework will use `document.createDocumentFragment()` to create the current element to pick up its components. Other Node-related attributes will be dismissed due to this attribute |
| `evaluate` | This should be a variable name in varage. It will be pharsed as object and its attributes will be applied on the CO before rendering the CO | [Example](example.md#evaluate) |

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

## Belt Syntax
Since belt syntax tends to update its father component and its father component's childrens, we suggest that developers should put a CSS-less div to contain the component, to optimize the performance.

| attribute name | expected type | usage |
| -------------- | ------------- | ----- |
| buckle | `string[]` | Tell the framework what varage variables should it watch at |
| options | `Object` | Tell the framework when re-render, what options should it follow |
| reverseBuckle | `string` | The value of the component affects the variable in varage provided |

#### Cautions:
- Because belt syntax will update the entire element, please ensure that if you want to keep anything in status(for example input tags, etc.), please don't put it in the same or higher level.

## Template Syntax
In strings, we have:
`{{systemVariable}} vs {customVariables}`
while custom variables is the render.data, systemVariable provide ways to know about yourself(from the POV of component)<br />
Moreover, you may use `{data | func1:arg1:arg2 | ...}` to execute function on data. The functions in the filter syntax should expect reciving: `data,arg1,arg2,arg3,...`

## Render Methods
| method name | check statusCode | details |
| ----------- | ---------------- | ------- |
| reload | true | [document](render.reload.md) |
| render | true | [document](render.render.md) |
| pipe2 | true | [document](render.pipe2.md) |

## URL Filter Syntax
This should be definded as `data.config.urlFilters.*`
| attribute name | expected type | required | usage |
| -------------- | ------------- | -------- | ----- |
| confirmer | function | required | This function can only be set once in an render object. The function should expect reciving the url rules, and confirm if it's right via returning boolean |
| reporter | function | required | If the confirmer returns false, the rendering process will be cut and this function will be triggered |
| onError | function | not required | This function will be triggered if the urlFilter fails no matter what |
| rules | string[] | required | This array should store the regex expressions. This is the whitelist |

## Cross Object Store
| method | structure | details |
| ------ | --------- | ------- |
| `add` | `add({vars: Object[string,any], actions: Object[string,function]})` | Added datas and access functions to the global. The actions can use this.varName to get variables that has stated in the object. [Example](example.md#storeadd) |
| `commit` | `commit(name: string,...args: any[])` | To call the functions stated perviously |
| `get` | `get(key: string)` | To get the variable value perviously declared |


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
- higher element:
A higher element means it's more close to the root element(rooter, if you prefer)
- lower elemetn:
A lower element means it's less close to the root element(less rooter, if you prefer)
