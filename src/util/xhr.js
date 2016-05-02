/* jshint globalstrict: true */
/* global XMLHttpRequest, module */

'use strict';

var
  emptyFn = function(){},
  methodCall = function(m){
    return function(opts){
      return core.connect(m, opts);
    };
  },
  core = {
  connect: function(method, opts){
    var loadFn = function(){
      (opts.cback || emptyFn)(xhr.response);
    },
    errorFn = function(){
      (opts.eback || emptyFn)(xhr.response);
    },
    xhr = new XMLHttpRequest();
    xhr.addEventListener('load', loadFn);
    xhr.addEventListener('error', errorFn);
    xhr.open(method.toUpperCase(), opts.url);
    xhr.send(opts.params);
    return xhr;
  },
};
for(var methods = ['get', 'post', 'put', 'delete'], i = 0, method; method = methods[i++];){
  /**
   * @description xhr get/post/put/delete
   * @param {Object} options
   * an object containing two callbacks and an url
   */
  core[method] = methodCall(method);
}
module.exports = core;
