'use strict';
const handler = require('./handler');
const plugin = require('./plugin');

module.exports = function Constructor(...args){  
    if ( new.target === Constructor ){
      return new plugin(...args);
    } else {
      return handler(...args);
    }
}

  
