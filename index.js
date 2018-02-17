'use strict';
let _ = require('lodash')
let tdd = require('./test/_tdd')

module.exports = class ServerlessExpressPlugin {

  constructor(serverless, options) {
    this.serverless = serverless
    this.environment = this.serverless.variables.service.provider.environment
    this.providerName = this.serverless.variables.service.provider.name

    // set environment variable SERVERLESS_EXPRESS_PLATFORM to aws, azure, google, etc
    this._initilialize()

    this.commands = {
    
    };

    this.hooks = {

    };

    return this.serverless
  }

  _initilialize(){
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
    if( _.includes(tdd.supported_providers, this.providerName ) ){ return }
    throw new Error(`Serverless Express Error: provider is not supported yet`)
  }

}

  
