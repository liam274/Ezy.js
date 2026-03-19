# Ezy.js - render.edit

## Introduction
This function provides a way to edit `renderObj.#varage` private attribute.

## Structure
```JavaScript
render.edit(key: string,value: any)->boolean{
    ...
};
```

## Expectation
This function will clears the preCompileStr cache. A `false` will be returned if the old value equals to the new value, otherwise this will be a `true`.