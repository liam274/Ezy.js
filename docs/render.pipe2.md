# Ezy.js - `render.pipe2`

## Introduction
This function allows components to communicate, an old-fashioned approach to `belt` syntax. In considerations of capability, this feature will not be removed in a short time.

## Structure
```JavaScript
render.pipe2(sender: string, receiver: string, data: any){
    ...
}
```
While `sender` and `reciever` should be a registered string in `render.pipes`, you can register it in components like this:
```JavaScript
{
    pipe:{
        name: string,// The name that you used in pipe2 method
        receive:{
            func: function,// The function that will be triggered if receiver===name
            data: any[]// Optional. The func will trigger like pipe.func(data,...(pipe.data || []))
        }
    }
}
```

## Expectation
You should Expect this function returns unusable values.<br />
Please check the statusCode after it returns, or you cannot expect the application to run normally.