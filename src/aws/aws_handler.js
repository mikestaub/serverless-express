const awsServerlessExpress = require('aws-serverless-express')

module.exports = (expressApp)=>{
    const server = awsServerlessExpress.createServer(expressApp)
    return (event, context) => { awsServerlessExpress.proxy(server, event, context) }
}
