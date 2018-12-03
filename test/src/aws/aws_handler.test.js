const awsServerlessExpress = require('aws-serverless-express')
const awsHandler = require("../../../src/aws/aws_handler");

jest.mock('aws-serverless-express', ()=>({
    createServer: jest.fn(),
    proxy: jest.fn()
}));

it("should wrap the express app with 'aws-serverless-express' and return a handler that invokes the server's proxy function", ()=>{
    const mockServer = {}
    awsServerlessExpress.createServer.mockReturnValueOnce(mockServer);
    const mockApp = {};
    const handler = awsHandler(mockApp);
    expect(awsServerlessExpress.createServer).toBeCalledWith(mockApp);
    const mockEvent = {};
    const mockContext = {};
    expect(handler(mockEvent, mockContext)).not.toBeDefined();
    expect(awsServerlessExpress.proxy).toBeCalledWith(mockServer, mockEvent, mockContext);
});
