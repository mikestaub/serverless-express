let sls_express = require('serverless-express')
let mock = require('./mock')

module.exports = function(o){
    let options = o || {}
    let mocks = mock.generate()
    let serverless = mocks[0]
    let plugin_options = mocks[1]
  
    serverless.variables.service.provider.name = options.provider 
    return new sls_express(serverless, plugin_options)
}
  