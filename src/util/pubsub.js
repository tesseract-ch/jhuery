/* jshint globalstrict: true */
/* global console, module */

'use strict';

var subscriptions = [];
module.exports = {
  pub: function(topic, data){
    subscriptions.filter(function(item){
      return item.t === topic;
    }).forEach(function(item){
      item.cb(data);
    });
  },
  /**
  * @description subscribe a topic
  */
  sub: function(topic, callback){
    var _subscription;
    if(typeof topic !== 'string'){
      console.error('subscribe error: topic must be a string');
      return;
    }
    if(typeof callback !== 'function'){
      console.error('subscribe error: callback must be a function');
      return;
    }
    _subscription = {
      t: topic,
      cb: callback
    };
    subscriptions.push(_subscription);
    return _subscription;
  },
  /**
  * @description unsubscribe from a topic
  */
  unsub: function(subscription){
    var subIndex;
    if(typeof subscription !== 'object' || typeof subscription.cb !== 'function' || typeof subscription.t !== 'string'){
      console.error('unsub: bad format');
      return;
    }

    if(~(subIndex = subscriptions.indexOf(subscription))){
      subscriptions.splice(subIndex, 1);
      return subIndex;
    }
  }
};
