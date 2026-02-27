# Ezy.js

## Introduce
*Ezy.js* is a modern framework that developes in raw JavaScript. It allows **flexible** and **dynamic** page rendering via **JS** code and **JSON** file structure.

## Attention
Developers MUST detect the statusCode after reRender, as it might returns error code. Notice that if the statusCode is not zero, the obj created might not be *render*.
Note that based on considerations of flexibilty, *Ezy.js* will not be responsible for XSS security or any other HTML-related attacks. If you want to implement such defense, please use PHP or any other possible backend language to pre-render contents.

## Data Structure

### Root
In the root data, we have:
- **main**, will be rendered as LRP.
- **onStart**, being executed before LRP is rendered.
- **onLoad**, being executed after LRP is rendered.
- **config**, store configrations to the page
- **data**, store the datas that should be in varage. It's safier then simply `varage.varName`, since it make sure it will be in the `render.varage`.

### Components
Except the specific root structure, *Ezy.js* is very dynamic and flexible, which means once you follow a certain pattern, you can build it in the way you like.

#### Introduce to attributes:
- component:
Component is a list, expected with objects included, which is called CO.
- CO:
*Ezy.js* is mainly about CO. Every attributes introduced in the certain list can be applied to CO.
- type:
The rendering engine will render it as classList
- tag:
The rendering Engine will choose div as tagName, if tag is not definded.
- event & listener:
The rendering Engine will use element.addEventlistener to plug in events in events. Data Structure:
``` javascript
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
```Javascript
{
    validate: "validationFunctionName"
}
```
- expire:
Type in object. It has subattributes like date, expired. The component will be removed on the nearest second in date(ceiling), and when expired, it will first let the UI update, then execute the expired function.
```Javascript
{
    expire:{
        date:new Date(),// Date Object or number is fine
        expired:()=>{}// This function will be triggered after the element is expired. Optional
    }
}
```
- forEach:
It will loops through the given object to render components.
- location:
To decide where to goto when the component is clicked.
- pipes:
You can use pipes to send messages. Reciver **MUST** have pipe definded.
```Javascript
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

## Specific Terminologies
- LRP(Late Render Page) means the page that will be rendered on the main process of *render*.
- CO(Component Object)

## Notice
- Developers should not, and cannot have components in userbar, toolbar and footer. Alternative will be provided.