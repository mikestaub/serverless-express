'use strict';
const handler = require('../index');


const express = require('express');
const app = express();

app.all('*', (req, res)=>{
  console.log('hey', process.env)
  res.json({
    status: 200,
  })
})

module.exports.hello = handler(app);
// module.exports.hello = async (event, context) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: 'Go Serverless v1.0! Your function executed successfully!',
//       input: event,
//     }),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
