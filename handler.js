const provider = require('./src/detect_env');
const slsExpress = require('./express');
const app = slsExpress();

/**
 * @param {string} express your express app
 * @returns {function} a fully configured handler function for your endpoint
 */
module.exports = function handler(express){
    const handled = handle(express);
    app.use(handled);
    return app;
}

function handle(app){
    switch(provider){
        case 'google': return app; // google cloud function are already using express
        case 'aws': return require('./src/aws/aws_handler')(app);
        default: throw new Error(`${platform} is not handled properly by serverless-express`);
    }
}
