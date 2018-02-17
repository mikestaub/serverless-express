let awsServerlessExpress = require('aws-serverless-express')
module.exports = (expressApp)=>{
    return awsServerlessExpress.proxy.bind(this, awsServerlessExpress.createServer(expressApp))
}