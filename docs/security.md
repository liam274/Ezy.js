# Ezy.js - security concerns
To ensure the highest security, and the best digital experience, relying on any framework, no matter is front-end or back-end, big or small, is not advisable.

## Table of Contents
- [Template Injection](#template-injection)
- [Prototype Pollution](#prototype-pollution)

## Template Injection
Problem of the most is template injection:
```JavaScript
// It generates a closure function
eval(`generateRedirection(\`${domain}${location}\`)`)();
// or return cleaning method
function popup(msg){
    // dom actions...
    return eval(`(${msg})=>{parent.remove();${exp}}`);// while the `exp` is related to the msg, like the implementation of render.evaluateExpression,
    // which is trying to act as scoped eval
}
```
Anyways, if the `location` is polluted to `${evilJavaScript()}`, it will be executed.
So we suggest rewrite to this:
```JavaScript
/**
 * @param {function(any):void} func
 * @param {any[]} args
 */
function template(func,...args){
    return func(...args);
}
template(generateRedirection,`${domain}${location}`);
```
This is much safer.

## Prototype Pollution
To ensure performance, JavaScript use `prototype` to avoid copying static methods:
```JavaScript
const a="hello";
console.log(a.repeat(5));// This is calling String.prototype.repeat, 
// instead of copying the `repeat` method every time when a string is created.
```
But that causes problem:
```JavaScript
// Injection point
const obj={};// It is somehow ensured to be unreachable
if (passwordVerify(psw,hash)){
    obj.admin=true;
}
// ... meanwhile, no one touches obj
if (obj.isAdmin()){
    redirect2("admin.php",{passed:someUnreachableToken});
}
```
If somebody injected in the console before clicking login:
```JavaScript
> Object.prototype.admin=true;
```
Then it logins! It's because if JavaScript is unable to find an attribute of an object, it will try it on `prototype`(the root of all the evil)
So we suggested to use our library (or any other ways or library etc., just ensure it's safe enough)
```JavaScript
import {createSafeObject} from "./safety.js";
const obj=createSafeObject(obj);
// ...
```
Our method won't ensure that the prototype cannot be polluted, but when you tries to access any `prototype` attribute, it will throw an Error.
Moreover, to be more secured, we actually copy the functions at the very first, in case they're polluted, too:
```JavaScript
const safeHasOwn = Object.hasOwn,
    safeHasOwnProperty = Object.prototype.hasOwnProperty;
/* eslint-disable no-undef */
import { log } from "./main.js";
// ...
```