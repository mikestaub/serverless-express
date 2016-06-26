/**
 * serverless-express
 *
 * @author Michael Staub
 */

var http = require('http');

// closure vars
var _ready = false;
var _server = null;
var _socket = null;

/**
 * Bind the http server to the local unix socket. We do this in a separate
 * function called outside of the lambda handler so we don't call it on every
 * invocation of the function.
 * @param {Object} app the express app
 * @param {String} [socket] location of the unix socket to listen on
 */
var listen = function(app, socket) {
  _socket = socket || '/tmp/local';
  _server = http.createServer(app);
  _server.listen(_socket, function(err) {
    if (err) {
      throw err;
    }
    _ready = true;
  });
};

/**
 * Send an http request to the local unix socket and wait for a response.
 * Then forward the response body back to the api gateway via the bound
 * lambda context object.
 * @param {Object} options the httpOptions object
 */
var _sendRequest = function(options) {
  var context = this;
  var responseBody = '';
  var req = http.request(options, function(res) {
    res.on('data', function(chunk) {
      responseBody += chunk.toString('utf8');
    });
    res.on('end', function() {
      context.succeed(responseBody);
      if (process.env.NODE_ENV !== 'production') {
        _server.close(); // for serverless-offline compatibility
      }
    });
  })
  .on('error', function(err) {
    context.fail(err);
  });
  req.end();
};

/**
 * Function that is invoked on every request to the lambda function.
 * Calls the internal _sendRequest() function to process the request.
 * @param {Object} [options] optional http request paramaters
 * @param {Function} [callback] optional callback called before request handling
 */
var handler = function(options, callback) {
  if (arguments.length === 1 && options instanceof Function) {
    callback = options;
    options = {};
  }
  return function(event, context) {
    if (callback) {
      callback(event, context);
    }

    var requestOptions = {
      method: event.method,
      path: event.path,
      headers: event.headers,
      body: event.body,
      socketPath: _socket
    };

    // merge user options
    for (var key in options) {
      requestOptions[key] = options[key];
    }

    if (_ready) {
      _sendRequest.call(context, requestOptions);
    }
    else {
      _server.on('listening', _sendRequest.bind(context, requestOptions));
    };
  };
};

module.exports = {
  listen: listen,
  handler: handler
};
