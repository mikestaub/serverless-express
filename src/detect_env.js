const providerByEnv = {
  [process.env.SERVERLESS_EXPRESS_PLATFORM]:  [process.env.SERVERLESS_EXPRESS_PLATFORM], // keep bacward compatibility;

  'aws': ['AWS_REGION', 'AWS_LAMBDA_FUNCTION_NAME', 'AWS_ACCESS_KEY_ID'],
  'google': ['GCLOUD_PROJECT', 'GCP_PROJECT', 'GCP_PROJECT'],
  'azure': ['AzureWebJobsDashboard'],
}

// less obstrusive way of detecting current provider;
// using only provider specific environement variables
// instantiated during function execution
module.exports = Object.entries(providerByEnv)
.reduce((found, [providerName, envVariables]) => {
    if( found ){ return found };

    return envVariables.reduce((acc, envName)=>{
        if( acc ){ return providerName }
        return typeof process.env[envName] !== 'undefined' 
    }, false)

}, undefined)

