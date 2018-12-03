let mock = require('./mock')

module.exports = function(o){
    let sls_express = require('./../../index');

    let options = o || {}
    let mocks = mock.generate()
    let serverless = mocks[0]
    let plugin_options = mocks[1]
  
    serverless.variables.service.provider.name = options.provider 
    if( options.noEnv == true  ){ delete serverless.variables.service.provider.environment }
    if( options.noInit == true ){ sls_express.prototype._initialize = ()=>{} }


    return new sls_express(serverless, plugin_options)
}
