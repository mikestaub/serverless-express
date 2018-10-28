module.exports = handler

/**
 * @param {string} express your express app
 * @returns {function} a fully configured handler function for your endpoint
 */
function handler(express){
    let platform = process.env['SERVERLESS_EXPRESS_PLATFORM']
    switch(platform){
        case 'aws': return aws_lambda_handle(express);
        case 'google': return google_cloud_function_handle(express);
        case 'azure': return azure_cloud_function_handle(express);
        default: throw new Error(`${platform} is not handled properly by serverless-express`);
    }
}

function  azure_cloud_function_handle(express){
    return require('./src/azure/azure_handler')(express);
}

function aws_lambda_handle(express){
    return require('./src/aws/aws_handler')(express)
}

// google cloud function are already using express
function google_cloud_function_handle(express){
    return express
}
