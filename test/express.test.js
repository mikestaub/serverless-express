let expect = require('chai').expect;
let fs = require('fs')
let path = require('path');
let _ = require('lodash')

let tdd = require('./_tdd')
let express = require('express')
let sls_express = require('serverless-express/express')
let mock = require('./src/mock')
var request = require('supertest');

let initPlugin = require('./src/init-plugin')
let aws_middle = require('../src/aws/aws_middleware')


describe("serverless-express express", function() {

  it("should let the user import module through require('serverless-express/express')", ()=>{
     let serverless_express_path = path.join(__dirname, '..', 'express.js')
     let file_exists = fs.existsSync(serverless_express_path)

     expect(file_exists).to.equal(true)
     expect(sls_express == require('../express')).to.equal(true)
  })

  it('should expose an API that is exaclty what express app exposes', ()=>{
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

  it('should expose an API that is exaclty what express exposes', ()=>{
    // sls_express  // serverless-express 
    // express // express

  
    let sameAPI_1 = Object.keys(express).reduce((accumulator, key)=>{
      if( !accumulator ){ return false }
      return ( typeof sls_express[key] != undefined ) 
    }, true)

    let sameAPI_2 = Object.keys(sls_express).reduce((accumulator, key)=>{
      if( !accumulator ){ return false }
      return ( typeof express[key] != undefined ) 
    }, true)
  
    expect(sameAPI_1 && sameAPI_2).to.equal( true )
    expect( sls_express.static == express.static ).to.equal( true )
  
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

  it('should set header Access-Control-Allow-Origin to * by default', function(done){
    
    let testIsCompleted = false
    let testsRunned = 0
    let testsToRun = tdd.supported_providers.length 

    tdd.supported_providers.forEach((provider)=>{

      initPlugin({provider: provider})
      let app = sls_express()
          app.get('*', (req, res)=>{
            res.json(res)
           }) // if we don't register a route the middleware stack is not exposed

          if( provider == 'aws'){

              request(app).get('/', mock.apiGatewayEvent() )
              .then( (res)=>{
                let response = res.res
                let responseHeader = response.headers
                expect(responseHeader['access-control-allow-origin']).to.equal('*')
                testsRunned = testsRunned + 1
                if( testsRunned == testsToRun){ done()  }
              })

          } else {

              request(app).get('/')
              .then((res)=>{
                let response = res.res
                let responseHeader = response.headers
                 expect(res.headers['access-control-allow-origin']).to.equal('*')
                 testsRunned = testsRunned + 1
                 if( testsRunned == testsToRun ){ done()  }
              })

          }
         
    })

  })
})