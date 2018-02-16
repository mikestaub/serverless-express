let expect = require('chai').expect;
let fs = require('fs')
let path = require('path');
let _ = require('lodash')

let tdd = require('./_tdd')
let express = require('express')
let sls_express = require('serverless-express/express')
let mock = require('./src/mock')

let initPlugin = require('./src/init-plugin')
let aws_middle = require('../src/aws/aws_middleware')


describe("serverless-express express", function() {

  it("should let the user import module through require('serverless-express/express')", ()=>{
     let serverless_express_path = path.join(__dirname, '..', 'express.js')
     let file_exists = fs.existsSync(serverless_express_path)

     expect(file_exists).to.equal(true)
     expect(sls_express == require('../express')).to.equal(true)
  })

  it('should expose an API that is exaclty what express exposes', ()=>{
    let sls_app = sls_express() // app.originalExpressApp is a reference to the internal express app that is used as prototype
    let app = express()

  
    let sameAPI_1 = Object.keys(app).reduce((accumulator, key)=>{
      return ( typeof sls_app[key] != undefined ) 
    }, true)

    let sameAPI_2 = Object.keys(sls_app).reduce((accumulator, key)=>{
      return ( typeof app[key] != undefined ) 
    }, true)
  
    expect(sameAPI_1 && sameAPI_2).to.equal( true )
  
  })

  it('should implement aws-serverless-express middleware on aws-lambda only', function(){

    tdd.supported_providers.forEach((provider)=>{

      initPlugin({provider: provider})
      let app = sls_express()
          app.get('*', ()=>{ }) // if we don't register a route the middleware stack is not exposed

      let injected = app._router.stack.filter( layer => layer && layer.handle == aws_middle ).length == 1
      expect(injected).to.equal( provider == 'aws')

    })

  })
})








  // const mockApiEvent = mock.apiGatewayEvent()
      // const ctx = mock.lambdaContext()
      // const sls_config = mock.generate()
      

      // let sls_express_plugin = new serverless_express(sls_config[0],sls_config[1]) // init plugin
      // let lambda_test = require('./__lambda_test').handler
      // console.log( typeof lambda_test )
      // // lambda_test(mockApiEvent)
      // lambda_test(mockApiEvent, ctx)

      // ctx.Promise
      // .then(()=>{
      //   console.log('resolved')
      // })
      // .catch(()=>{
      //   console.log('rejected')
      // })
      // console.log(mockApiEvent)
      // expect(true).to.equal(true)
      // process.env.SERVERLESS_EXPRESS_PLATFORM = 'aws'
      // let mock_api_gateway = mock.apiGatewayEvent
      // let express_test = require('./__lambda_test').handler(mock_api_gateway)
      
      // return request(express_test).get('/test_aws').then((res)=>{
      //   console.log(res.data)
      //   expect(res.data).to.equal(true)
      // })





// Simply change require('express') by require('serverless-express/express')