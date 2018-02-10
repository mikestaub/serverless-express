let chai = require('chai');
let _ = require('lodash')
let expect = chai.expect;

let tdd_data = require('./_data')
let serverless_express = require('../index')
let mock = require('./_mock')

describe('Implement correctly express.js for each supported providers', function() {

    it('should throw an error if the provider is not supported yet', ()=>{
      
      let params = mock.generate()
      let serverless = params[0]
      let options = params[1]


      expect(()=>{ 
        serverless.variables.service.provider.name = 'imaginaryService'
        new serverless_express(serverless, options) 
      }).to.throw()

    })

    it('should not throw an error if provider is supported', function(){

      let params = mock.generate()
      let serverless = params[0]
      let options = params[1]

      expect(()=>{ 
        tdd_data.supported_providers.forEach((providerName)=>{
          serverless.variables.service.provider.name = providerName
          new serverless_express(serverless, options) 
        })
      }).to.not.throw()

    })

    it('should set correclty the provider name as environment variable', ()=>{

        // in the mock serverless
        // providerName is set to 'aws'
        // in reality it can be also 'google', 'azure', 'openwhisk'

        // serverless.variables.service.provider.environment have 
        // to be set during initialisation 
        // serverless will se correcly environment variables after that

        tdd_data.supported_providers.forEach((providerName)=>{

          let params = mock.generate()
          let serverless = params[0]
          let options = params[1]

          serverless.variables.service.provider.name = providerName
          let plugin = new serverless_express(serverless, options)

          expect(plugin.providerName).to.equal(providerName);

        })

    });
});



function generateServerless(){

}