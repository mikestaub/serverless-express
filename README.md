# Serverless Express
[![NPM version][npm-version-image]][npm-url]
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

#**[DEPRECATED]**
## in favor of https://github.com/awslabs/aws-serverless-express
# Goal
Run your unmodified express app on AWS Lambda via the serverless framework.

This module was inspired by the following post:
http://sipsma.me/howto.html

`npm install --save serverless-express`

# Example Usage
In your serverless function's handler.js:
```
var slsExpress = require('serverless-express');
var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.send("Hello from wrapped app!");
});

slsExpress.listen(app);

exports.handler = slsExpress.handler();

// if you need to access the lambda event and context, pass a callback function:
exports.handler = slsExpress.handler(function(event,context) {
  // this code will be called before express handles the request
});

// Note: You can also override the node http request options via the first argument passed to handler:
// var reqParams = { path: '/custom/path' };
// slsExpress.handler(reqParams);
```

# API Gateway Integration

The following s-templates.yaml file contains the minimum set of properties that will be expected on the lamda event object:

```
"apiGatewayRequestTemplate":
  "application/json": |
    {
      "headers": {
        #foreach($param in $input.params().header.keySet())
          "$param": "$util.escapeJavaScript($input.params().header.get($param))"
        #if($foreach.hasNext),#end
        #end
      },
      "queryParams": {
        #foreach($param in $input.params().querystring.keySet())
          "$param": "$util.escapeJavaScript($input.params().querystring.get($param))"
        #if($foreach.hasNext),#end
        #end
      },
      "pathParams": {
        #foreach($param in $input.params().path.keySet())
          "$param": "$util.escapeJavaScript($input.params().path.get($param))"
        #if($foreach.hasNext),#end
        #end
      },
      "method": "$context.httpMethod",
      "body" : "$input.json('$')",
      "path": "$context.resourcePath"
    }
```
Dont't forget to add this line in your s-function.json endpoint config:
```
"requestTemplates": "$${apiGatewayRequestTemplate}"
```

# Important
Make sure that process.env.NODE_ENV='production' in your deployed lambda function. When it is not, the http server closes itself after each request to be compatible with the serverless-offline module. The serverless-offline module recreates the function for every request, so to keep the socket available for all requests we must release it after responding.

# Support Deeply Nested Routes (workaround)
If your express app needs to handle a route that is path of n deep, you will need to create n endpoint definitions in your s-templates.yaml file, for every http method. This is an annoying shortcoming of AWS API Gateway which means you cannot support routes that are infinite levels deep. Hopefully in the future, APIG will support wildcard paths so we will not have to explicity define each possible endpoint. Until then, the workaround is to copy each endpoint definition in the array and only change the "path" property to include the embedded param. For example, if I know my express app only needs to support paths that are 3 levels deep, I will create 3 versions of each endpoint with "path" properties like so:
```
"path": "/api/{1}"
"path": "/api/{1}/{2}"
"path": "/api/{1}/{2}/{3}"
```

# Implementation Summary
This module will create an HTTP server with the express app that it is wrapping, and binds it to a local unix socket within the docker container. It will then construct an HTTP request from the lambda event parameters, send that request to the local socket, wait for the express app to respond to that request, and then forward that response from express back through the API Gateway. This allows you to use your normal express app unchanged to process requests to your serverless function, with minumum performance overhead. Just make sure you have all the neccessary endpoints defined in your s-function.json file.

[npm-url]: https://npmjs.org/package/serverless-express
[npm-version-image]: http://img.shields.io/npm/v/serverless-express.svg?style=flat