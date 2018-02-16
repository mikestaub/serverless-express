const express = require('express')
module.exports = ()=>{
    return implement(express())
}

function implement(app){
    switch( process.env.SERVERLESS_EXPRESS_PLATFORM ){
        case 'aws': return aws_express(app);
        case 'google': return google_express(app);
        default: return app
    }
}


// implement aws middleware if platform is 'aws'
const aws_middleware = require('./src/aws/aws_middleware')
function aws_express(app){
    app.use(aws_middleware)
    return app
}

// google already uses express, so we return it
function google_express(app){
    return app
}