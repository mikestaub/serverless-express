'use strict';
let _ = require('lodash')
let tdd_data = require('./test/_data')

module.exports = class ServerlessExpressPlugin {

  constructor(serverless, options) {
    this.serverless = serverless

    this.providerName = undefined
    this.setPlatformEnvironment() // set environment variable SERVERLESS_EXPRESS_PLATFORM to aws, azure, google, etc

    this.commands = {
    
    };

    this.hooks = {

    };

  }


    // will set environment variable 
    // will be accessible through process.env
  setPlatformEnvironment(){
    this.providerName = this.serverless.variables.service.provider.name
    this.serverless.variables.service.provider.environment['SERVERLESS_EXPRESS_PLATFORM'] = this.providerName
    if( !_.includes(tdd_data.supported_providers, this.providerName ) ){
      throw new Error('Serverless Express Error: provider is not supported')
    }
  }




}

  
