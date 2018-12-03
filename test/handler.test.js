const { expect } = require('chai'); 
let _ = require('lodash')
let path = require('path')
let fs = require('fs')

let sls_handler = require('serverless-express/handler')
let sls_express = require('serverless-express/express')

let tdd = require('./_tdd')
let serverless_express = require('serverless-express')
let initServerless = require('./src/init-plugin')
let mock = require('./src/mock')

describe('serverless-express handler', function() {

      it("should let the user import module through require('serverless-express/handle')", ()=>{
          let serverless_handler_path = path.join(__dirname, '..', 'handler.js')
          let file_exists = fs.existsSync(serverless_handler_path)

          expect(file_exists).to.equal(true)
          expect( sls_handler == require('../handler')).to.equal(true)
      })

       tdd.supported_providers.forEach((provider)=>{
          it(`should handle express correctly with ${provider}`, function(){
              initServerless({provider: provider})
              switch(provider){
                case 'aws': test_handler_with_aws(); break;
                case 'google': test_handler_with_google(); break;
                case 'azure': test_handler_with_azure(); break;
                default: return Promise.reject(`${ provider } is not handled properly`);
              }
          })
       })


       it('should throw error if a handler is used inside not-supported provider', function(){
          process.env['SERVERLESS_EXPRESS_PLATFORM'] = 'fakeCloudProviderName'
          let handler = require('serverless-express/handler')
          expect(handler).to.throw()
       })

});


// the handler will implement express app as shown on aws-serverless-express 
// https://github.com/awslabs/aws-serverless-express
function test_handler_with_aws(){
  let app = sls_express()
  app.get('*', ()=>{ })

  let handled = sls_handler(app)
  expect( typeof handled).to.equal('function')
  // test is being done at "./src/aws/aws_handler.test.js"
}



// since google cloud functions using express as their engine
// the handler will just return the express app when provider is google
// the handler return the object that is given to it
// so we test this funcionality with uuid
function test_handler_with_google(){
  let app = sls_express()
  app.get('*', ()=>{ })
  expect(sls_handler(test)).to.equal(test)
  expect( typeof app).to.equal('function')
}

function test_handler_with_azure(){
  let app = sls_express()
  app.get('*', ()=>{ })

  let handled = sls_handler(app);
  expect( typeof handled).to.equal('function');

  const paramNames = getArgumentNamesOfFunction(handled);
  const rightNumberOfParams = paramNames.length == 2;
  const rightParamNames = _.includes(['context', 'ctx', 'cx'], paramNames[0]) && _.includes(['req', 'request'], paramNames[1])

  expect( rightNumberOfParams ).to.equal(true)
  expect( rightParamNames ).to.equal(true)
}

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getArgumentNamesOfFunction(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}
