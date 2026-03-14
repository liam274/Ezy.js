# Ezy.js &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/liam274/Ezy.js/blob/main/LICENSE)

## Introduce
*Ezy.js* is a modern framework that developes in raw JavaScript. It allows **flexible** and **dynamic** page rendering via **JS** code and **JSON** file structure.

Note that this framework is ***NOT*** designed to build pages independently. Please use other backend languages to support the project, or any other ways you prefer.

## Attention
- Developers **MUST** detect the statusCode after reRender, as it might returns error code.
- Note that based on considerations of flexibilty, *Ezy.js* will not be fully responsible for XSS security or any other HTML-related attacks. If you want to implement such defenses, please view the [config attributes](docs.md#general-config-attributes), or using PHP or any other possible backend language to pre-render contents. ***XSS DEFENSE MODE IS DEFAULT TO BE OFF, IN CONSIDERATION OF FLEXIBILITY***

## Hello, world!
Here's a small "Hello world" example, for you to step forward:
```JavaScript
import * as ezy from "./main.js";
const proc=new ezy.render(// In case you want to reuse this object.
    ezy.body,// This is the body element of the HTML page. You may change it to other root element you'd like to.
    {
        component:[
            {
                tag:"h1",
                content:"Hello, world!"
            }
        ]
    }
);
```

## Deployment
If you want to try the framework, you may git clone the project:
```sh
git clone https://github.com/liam274/Ezy.js.git
```
and deploy via python:
```sh
python -m http.server 80
```
or npx(Which is better for the router functions since python does not support that):
```sh
npx serve -s .
```
in the main directory.<br />
Please use `localhost:port` to visit it, since service worker is not aviliable in non-localhost or https:// urls

## Document
If you want to learn further about *Ezy.js*, please take a look at this [document](docs.md)

## Community
Discord : https://discord.gg/QhaEZTTgru

## Notice
- The `setting.html` is **DESIGNED** to pop up error, in order to test whether the `render.loadingPage` is working or not.