### event
``` JavaScript
{
    eventName: {
        listener: [func1,func2,func3],// functions that you want to call in order, when the event is triggered
        preventDefault: false// rather you want to preventDefault action, or not.
    }
}
```
### validate
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
### expire
```JavaScript
{
    expire: {
        date: new Date(),// Date Object or number is fine
        expired: ()=>{}// This function will be triggered after the element is expired. Optional
    }
}
```
### pipes
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