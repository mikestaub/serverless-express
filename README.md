# :package: :sparkles: Serverless Express
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) 
[![Coverage Status](http://coveralls.io/repos/iliasbhal/serverless-express/badge.svg?branch=master)](https://coveralls.io/r/iliasbhal/serverless-express?branch=master)
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

