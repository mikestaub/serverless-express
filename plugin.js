let tdd = require('./test/_tdd');

module.exports = class ServerlessExpressPlugin {

  constructor(serverless, options) {
    this.serverless = serverless

    this.serverless.variables.service.provider.environment = this.serverless.variables.service.provider.environment || {}
    this.environment = this.serverless.variables.service.provider.environment
    this.providerName = this.serverless.variables.service.provider.name

    // set environment variable SERVERLESS_EXPRESS_PLATFORM to aws, azure, google, etc
    this.testPlatform()
    this.setPlatformEnvironment()

    this.commands = {
    
    };

    this.hooks = {

    };
  }

  _initialize(){
    this.testPlatform()
    this.setPlatformEnvironment()
  }

    // will set environment variable 
    // will be accessible through process.env
  setPlatformEnvironment(){
    this.environment['SERVERLESS_EXPRESS_PLATFORM'] = this.providerName
    process.env['SERVERLESS_EXPRESS_PLATFORM'] = this.providerName
  }

  // if platform is not suported 
  // it will throw an error during intialisation
  testPlatform(){
    const isPlatformSupported = tdd.supported_providers.find(p => p === this.providerName)
    if( isPlatformSupported ){ return }
    throw new Error(`Serverless Express Error: provider is not supported yet`)
  }

}