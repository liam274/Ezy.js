# Ezy.js - `render.render`

## Introduction
This function is designed for re-render of belt syntax.

## Structure
```JavaScript
render.render(data: Object, root: Node, options: Object){
    ...
}
```
`data` can be any aviliable CO, while `root` is the element that you'd like to deploy the CO in to. `options` is the object that you decide about the rendering.

## Attribute Details
`options`
```JavaScript
{
    deep?(true): boolean
}
```

## Expectation
You should Expect this function returns unusable values.<br />
Please check the statusCode after it returns, or you cannot expect the application to run normally.