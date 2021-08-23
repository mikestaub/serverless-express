'use strict';
let tdd = require('./test/_tdd')

module.exports = class ServerlessExpressPlugin {

  constructor(serverless, options) {
    this.serverless = serverless

    this.serverless.service.provider.environment = this.serverless.service.provider.environment || {}
    this.environment = this.serverless.service.provider.environment
    this.providerName = this.serverless.service.provider.name

    // set environment variable SERVERLESS_EXPRESS_PLATFORM to aws, azure, google, etc
    this._initialize()

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
    if( tdd.supported_providers.find( n => n === this.providerName ) ){ return }
    throw new Error(`Serverless Express Error: provider is not supported yet`)
  }

}

  
