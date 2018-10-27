const slsExpress = require('./express');
const app = slsExpress();

const providerByEnv = {
    [process.env.SERVERLESS_EXPRESS_PLATFORM]:  process.env.SERVERLESS_EXPRESS_PLATFORM, // keep bacward compatibility;

    'aws': ['AWS_REGION', 'AWS_LAMBDA_FUNCTION_NAME', 'AWS_ACCESS_KEY_ID'],
    'google': ['GCLOUD_PROJECT', 'GCP_PROJECT', 'GCP_PROJECT']
}

/**
 * @param {string} express your express app
 * @returns {function} a fully configured handler function for your endpoint
 */
module.exports = function handler(express){
    let platform = detectPlatform();

    app.use(express);

    switch(platform){
        case 'aws': return aws_lambda_handle(app);
        case 'google': return google_cloud_function_handle(app);
        default: throw new Error(`${platform} is not handled properly by serverless-express`);
    }
}

function aws_lambda_handle(express){
    return require('./src/aws/aws_handler')(express)
}

// google cloud function are already using express
function google_cloud_function_handle(express){
    return express
}


// less obstrusive way of detecting current provider;
// using only provider specific environement variables
// instantiated during function execution
function detectPlatform() {
    return Object.entries(providerByEnv)
        .reduce((found, [providerName, envVariables]) => {
            if( found ){ return found };

            return envVariables.reduce((acc, envName)=>{
                if( acc ){ return providerName }
                return typeof process.env[envName] !== 'undefined' 
            }, false)

        }, undefined)
}