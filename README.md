# :package: :sparkles: Serverless Express
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) 

<svg xmlns="http://www.w3.org/2000/svg" width="106" height="20" style="display: inline-block;">
    <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <mask id="a">
        <rect width="106" height="20" rx="3" fill="#fff"/>
    </mask>
    <g mask="url(#a)">
        <path fill="#555" d="M0 0h60v20H0z"/>
        <path fill="#4c1" d="M60 0h46v20H60z"/>
        <path fill="url(#b)" d="M0 0h106v20H0z"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
        <text x="30" y="15" fill="#010101" fill-opacity=".3">coverage</text>
        <text x="30" y="14">coverage</text>
        <text x="82" y="15" fill="#010101" fill-opacity=".3">100%</text>
        <text x="82" y="14">100%</text>
    </g>
<div xmlns="" id="divScriptsUsed" style="display: none"/>
</svg>

Make express apps compatible with serverless framework. 
Ensure compatibility with serverless-offline plugin.

Works with provider :
  - [x] Amazon Web Service - Lambda
  - [x] Google Cloud Platform - Cloud functions <span style="color:lightgrey"> in development </span>
  - [ ] Microsoft Azure - Cloud functions <span style="color:lightgrey"> in development </span>

## Instalation
Type this command inside your terminal
```
npm install --save serverless-express
```

or for yarn users
```
yarn add serverless-express
```


## Usage

### 1 - Add it to your serverless.yml

inside your project's serverless.yml file add ``` serverless-express`` to the plugin list inside serverless.yml

It should look something like this:
```YAML
plugins:
  - serverless-foo # <- fake name
  - serverless-express # <- like so
```

### 2 - Use serverless-express/express

In the head of your express app file :
- Replace `equire('express')` by `require('serverless-express/express')`
- Make you app exportable

it should look like this:
```js
// const express = require('express');
const express = require('serverless-express/express')
var app = express();


// Q: What is serverless-express/express ??
//
// A: It's express, the exact same express that you already use.
//    We wrapped it and we abstracted away all specific implementation 
//    that has to be done in order to work properly on every provider.
//
//    Basicaly, we just made express development provider agnostic
//    so you can develop your app without any vendor lock-in, yeah !


// --- example code ---
//
// app.get('/some_url', doSomething() )
// app.post('/other_url', doSomethingElse() )
//
// ------- end --------

module.exports = app
// app.listen(PORT, ()=>{
//   console.log('listening')  
// })

```


### 3 - In your handler file
inside the handler file, you hanve to import ```serverless-express/handler``` and call it with your express app.
It should look something like this:

```js

const handler = require('serverless-express/handler')
const app = require('path/to/your/express/app')


exports.handler = handler(app)
// that's it ;)
```

### 4 - Finnished !

Now that everything is done, you can get back to work and enjoy serverless and express in the same time ;)

