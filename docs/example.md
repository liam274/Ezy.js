# Ezy.js Examples

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
### store.add
```JavaScript
import * as ezy from "./main.js";
ezy.store.add({
    vars:{
        count: 0,
        discount: 100,
    },
    actions:{
        increase:()=>this.count++,
        decrease:()=>this.discount++,
        add:(count)=>this.count+=count
    }
});
ezy.store.commit("increase");
ezy.log(ezy.store.get("count"));// Output: 1
ezy.store.commit("add",12,13);
ezy.log(ezy.store.get("count"));// Output: 13
```
### evaluate
```JavaScript
import * as ezy from "./main.js";
const proc=new ezy.render(ezy.body,{
    config:{
        urlFilter:{
            rules:[".*"],
            confirmer:()=>true,
            reporter:()=>undefined
        }
    },
    component:[
        {
            evaluate:"{component:[{tag:\"h1\",content:\"hi\"}]}"
        }
    ]
});
```