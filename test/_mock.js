let _ = require('lodash')

exports.serverless = {
    variables: {
      service: { 
        // serverless stores serverless.yml inside serverless.variables.service
        provider:{
            name: 'aws',
            environment : {
                // here are all the environment variable that serverless 
                // will set correctly during deploy and offline
            } 
        }
      }
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