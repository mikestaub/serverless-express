let _ = require('lodash')


const service = {
    // serverless stores serverless.yml inside serverless.variables.service
    provider:{
        name: 'aws',
        environment : {
            // here are all the environment variable that serverless
            // will set correctly during deploy and offline
        }
    }
};

exports.serverless = {
    service,
    variables: {
        service
    }
}

exports.options = {
    stage: undefined, 
    region: undefined 
}


exports.generate = ()=>{
    return [
        _.clone(exports.serverless),
        _.clone(exports.options)
    ]
}

exports.apiGatewayEvent = (config)=>{
    let createEvent = require('aws-event-mocks');
    config = config || {}

    let path = config.path || '/'
    let body = config.body || {}
    let query = config.query || {}

    return createEvent({
        template: 'aws:apiGateway',
        merge: {
            headers: {
                'x-apigateway-event': true,
                'x-apigateway-context': true
            },
            body: body,
            path: path,
            query: query
        }
    })
   
}

exports.lambdaContext = ()=>{
    const context = require('aws-lambda-mock-context')
    return context()
}