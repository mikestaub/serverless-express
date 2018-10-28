const express = require('express')
const allowAccessControlOriginMiddleware = require('./src/access_control_middleare')

let slsExpress = () => implement(express())
Object.setPrototypeOf(slsExpress, express)
module.exports = slsExpress 

function implement(app){
    app.use(allowAccessControlOriginMiddleware)  //  res.append('Access-Control-Allow-Origin', '*');
    switch( process.env.SERVERLESS_EXPRESS_PLATFORM ){
        case 'aws': return aws_express(app);
        case 'azure': return azure_express(app);
        case 'google': return google_express(app);
        default: return app
    }
}

// implement aws middleware if platform is 'aws'
function aws_express(app){
    const aws_middleware = require('./src/aws/aws_middleware')
    app.use(aws_middleware)  
    return app
}

// no specific middleware to add
function azure_express(app){
    return app;
}

// google already uses express, so we return
function google_express(app){
    return app
}