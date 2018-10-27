let mock = require('./mock')

module.exports = function(o){
    let sls_express = require('../../plugin');

    let options = o || {}
    let mocks = mock.generate()
    let serverless = mocks[0]
    let plugin_options = mocks[1]
  
    serverless.variables.service.provider.name = options.provider 
    if( options.noEnv == true  ){ delete serverless.variables.service.provider.environment }

    return new sls_express(serverless, plugin_options)
}
  