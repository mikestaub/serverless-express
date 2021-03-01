# :package: :sparkles: Serverless Express Plugin
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) 
[![npm version](https://badge.fury.io/js/serverless-express.svg)](https://badge.fury.io/js/serverless-express)
[![Coverage Status](https://coveralls.io/repos/github/iliasbhal/serverless-express/badge.svg?branch=master)](https://coveralls.io/github/iliasbhal/serverless-express?branch=master)
[![GitHub license](https://img.shields.io/badge/licence-MIT-brightgreen.svg)](https://github.com/iliasbhal/serverless-express/blob/master/LICENSE)


Make express apps compatible with serverless framework. 
Ensure compatibility with serverless-offline plugin.

Works with provider :
  - [x] **Amazon Web Service - Lambda**
  - [x] **Google Cloud Platform - Cloud functions**
  - [x] **Microsoft Azure - Cloud functions**

## Download
Type this command inside your terminal
```
npm install --save serverless-express
```

or for yarn users
```
yarn add serverless-express
```

## Installation

### 1 - Add it to your serverless.yml

inside your project's serverless.yml file add ```serverless-express``` to the plugin list inside serverless.yml

It should look something like this:
```YAML
plugins:
  - serverless-foo # <- fake name
  - serverless-express # <- like so
```

*NB: In order to automatically know on which provider the function is executed, 
the plugin asks serverless to set ```SERVERLESS_EXPRESS_PLATFORM``` as an environment variable. The plugin uses it internally*

### 2 - Use serverless-express/express

In the head of your express app file :
- Replace `require('express')` by `require('serverless-express/express')`
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
inside the handler file, you have to import ```serverless-express/handler``` and call it with your express app.
It should look something like this:

```js

const handler = require('serverless-express/handler')
const app = require('path/to/your/express/app')

module.exports.api = handler(app)
// that's it ;)
```

### 4 - Finished !

Now that everything is done, you can get back to work and enjoy serverless and express in the same time ;)

## Usage
Make sure that you register an HTTP event for each endpoint of your express app.
For example, if you register an endpoint like this one: 
```js
  app.get( '/users' , showUsers )
```

You will need to make sure that your cloud provider routes the HTTP call to your app. In order to do so, you will need to update your serverless.yml like so :
```yml
# like this 
functions:
  app: 
    handler: handler.handler  #assuming your handler file is handler.js
    events: 
      - http:
          method: GET
          path: /users

# or like this
# be careful, this will route every HTTP event to your function.
functions:
  app:
    handler: handler.handler 
    events: 
      - http:
          method: ANY   
          path: /{proxy+}
```






### Todo 

- [ ] create "serverless express yaml" command that updates the serverless.yml file with all the endpoints of the express app

