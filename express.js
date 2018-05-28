const express = require('express')


let slsExpress = () => implement(express())
Object.setPrototypeOf(slsExpress, express)
module.exports = slsExpress 

function implement(app){
    app.use((req, res, next)=>{
        res.append('Access-Control-Allow-Origin', '*');
        next()
    })    

    switch( process.env.SERVERLESS_EXPRESS_PLATFORM ){
        case 'aws': return aws_express(app);
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

// google already uses express, so we return
function google_express(app){
    return app
}