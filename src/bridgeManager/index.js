/* jshint globalstrict: true */
/* global module, require, localStorage, setTimeout, console */

'use strict';

var
constants     = require('../constants'),
xhr           = require('../util/xhr'),
pubsub        = require('../util/pubsub'),
cfgReader     = require('./configReader'),
currentUser   = '',
currentIP     = '',
started = false,
readTimeout = 3000,
onConfigReady = function(foundBridge){
  currentIP   = foundBridge.ip;
  currentUser = foundBridge.key;
  bridge.readLights();
},
bridge        = {
  start: function(){
    if(started){
      return bridge;
    }
    var config = cfgReader.load(onConfigReady);
    started = true;
    return bridge;
  },
  readLights: function(){
    xhr.get({
      url: 'http://{$ip}/api/{$user}/lights'.replace(/{\$ip}/, currentIP).replace(/{\$user}/, currentUser),
      cback: function(response){
        var lights = {};
        try{
          lights = JSON.parse(response);
        }catch(err){
          console.error('bridge call error:', err);
        }finally{
          pubsub.pub(constants.DATA_RECEIVED, lights);
        }
      }
    });

    // setTimeout(this.readLights.bind(this), readTimeout);
  },
  setState: function(opts){
    var id = opts.id, attr = opts.attr, state = opts.state;
    xhr.put({
      url: 'http://{$ip}/api/{$user}/lights/{$id}/state/'
      .replace(/{\$id}/, id).replace(/{\$ip}/, currentIP).replace(/{\$user}/, currentUser),
      params: '{ "{$attr}" : {$state} }'.replace(/{\$attr}/, attr).replace(/{\$state}/, state),
      cback: function(response){
        console.log('success, response = ', response);
      }
    });
  }
};
module.exports = bridge;
