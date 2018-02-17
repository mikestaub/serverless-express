// -------------------------------------
// jest + chai + sinon + sinon-chai
let chai = require("chai");
let sinon = require("sinon");
let sinonChai = require("sinon-chai");
let expect = chai.expect;
  chai.use(sinonChai);
// ------------------------------------
let _ = require('lodash')

let tdd = require('./_tdd')
let serverless_express = require('serverless-express')
let mock = require('./src/mock')

let initPlugin = require('./src/init-plugin')

describe('serverless-express plugin', function() {

    it('should call initialize method when the plugin gets instantiated', function(){
      let sls_plugin = require('serverless-express')
      let spy_initilialize = sinon.spy(sls_plugin.prototype, '_initialize' );

      let params = mock.generate()
      let serverless = params[0]
      let options = params[1]
      new sls_plugin(serverless, options)

      expect(spy_initilialize).to.have.been.called
    })

    it('should initialize the plugin in the right sequence', function(){
      let sls_plugin = require('serverless-express')
      let spy_testPlatform = sinon.spy(sls_plugin.prototype, 'testPlatform' );
      let spy_setPlatformEnvironment = sinon.spy(sls_plugin.prototype, 'setPlatformEnvironment' );
 
      let params = mock.generate()
      let serverless = params[0]
      let options = params[1]
      new sls_plugin(serverless, options)

      expect(spy_testPlatform).to.have.been.called
      expect( spy_setPlatformEnvironment).to.have.been.calledAfter( spy_testPlatform )
    })

    it('should throw an error if the provider is not  supported yet', function(){
      
      let params = mock.generate()
      let serverless = params[0]
      let options = params[1]

      expect(()=>{ 
        serverless.variables.service.provider.name = 'fakeCloudProviderName'
        new serverless_express(serverless, options) 
      }).to.throw()

    })

    it('should not throw an error if provider is supported', function(){

      let params = mock.generate()
      let serverless = params[0]
      let options = params[1]

      expect(()=>{ 
        tdd.supported_providers.forEach((providerName)=>{
          serverless.variables.service.provider.name = providerName
          new serverless_express(serverless, options) 
        })
      }).to.not.throw()

    })


    it("should set providerName as environment variable when it's a supported provider", function(){

      tdd.supported_providers.forEach((providerName)=>{
        let plugin = initPlugin({ provider: providerName})
        
        expect(plugin.serverless.variables.service.provider.environment['SERVERLESS_EXPRESS_PLATFORM'])
        .to.equal(providerName)

        expect(process.env['SERVERLESS_EXPRESS_PLATFORM'])
        .to.equal(providerName)

      })

    })


    // when no environment variables are provided inside serverless.yml
    // the environment object is undefined by default, so we have to define it first
    // before setting any environement variables, otherwise it will throw an error
    // because we will be trying to modify an object that is inexistant.
    it("should create serverless environment object if it's undefined", function(){
      let plugin = initPlugin({ noEnv: true, noInit: true })
      expect( plugin.environment ).to.deep.equal(new Object())
      expect(initPlugin.bind(null, { noEnv: true } )).to.not.throw()
    })


});