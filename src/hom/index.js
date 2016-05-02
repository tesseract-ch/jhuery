/* jshint globalstrict: true */
/* global module, require, document, MutationObserver, console */

'use strict';


var
pubsub         = require('../util/pubsub'),
xhr            = require('../util/xhr'),
constants      = require('../constants'),
bridgeManager  = require('../bridgeManager'),
df             = document.createDocumentFragment(),
observerCfg    = {
  attributes: true,
  attributeOldValue : true
},
readyCallbacks = [],
bridgeInfo,
firstSubscription,
pow            = Math.pow,
homReady       = function(){
  while(readyCallbacks.length){
    // preserving the callbacks order
    readyCallbacks.shift()();
  }
  hom.ready = function(cback){
    if(typeof cback === 'function'){
      cback();
    }else{
      console.error('[ready] the cback argument MUST be a function');
    }
  };
},
hom = {
  bridgeManager: bridgeManager,
  start: function(){
    this.subscribe();
    return this;
  },
  subscribe: function(){
    firstSubscription = pubsub.sub(constants.DATA_RECEIVED, this.create.bind(this));
    bridgeManager.start();
  },
  createObserver: function(){
    var observer = this.observer = new MutationObserver(function(mutations){
      mutations.forEach(function(mutationRecord){
        console.log('mutation detected = ', mutationRecord.attributeName);
        var state = mutationRecord.target.getAttribute(mutationRecord.attributeName);

        observer.disconnect();
        mutationRecord.target.setAttribute(mutationRecord.attributeName, mutationRecord.oldValue);
        observer.observe(mutationRecord.target, observerCfg);

        bridgeManager.setState({
          id: mutationRecord.target.id.replace(/^hue-/, ''),
          attr: mutationRecord.attributeName,
          state: state
        });
      });
    });
  },
  updateState: function(light, state){
    var st, i;
    // TODO: replace with Object.keys()
    for(i in state){
      st = state[i];
      // light.setAttribute(i, typeof st !== 'object' ? st : JSON.stringify(st));
      light.setAttribute(i, st);
    }
  },
  syncLights: function(lights){
    console.log('syncing', lights);
    var i, light, attr, l, currentValue;
    // observer creation
    this.createObserver();
    this.observer.disconnect();
    for(i in lights){
      l = lights[i];
      // console.log(i, ' ', lights[i]);
      light = df.getElementById('hue-' + i);
      for(attr in l){
        if(attr !== 'state'){
          currentValue = l[attr];
          light.setAttribute(attr, typeof currentValue !== 'object' ? l[attr] : JSON.stringify(currentValue));
        }
      }
      this.updateState(light, l.state);
      this.observer.observe(light, observerCfg);
    }
    homReady();
  },
  /**
  * @param  {[type]} fBridge bridge data
  * @return {[type]}         [description]
  */
  create: function(lights){
    pubsub.unsub(firstSubscription);
    pubsub.sub(constants.DATA_RECEIVED, this.syncLights.bind(this));
    // TODO: get lamps list
    var i, light, attr, l, currentValue;
    // observer creation
    this.createObserver();
    for(i in lights){
      l = lights[i];
      // console.log(i, ' ', lights[i]);
      light = document.createElement('light');
      light.setAttribute("id", "hue-" + i);
      for(attr in l){
        if(attr !== 'state'){
          currentValue = l[attr];
          light.setAttribute(attr, typeof currentValue !== 'object' ? l[attr] : JSON.stringify(currentValue));
        }
      }
      this.updateState(light, l.state);
      df.appendChild(light);
      this.observer.observe(light, observerCfg);
    }
    homReady();
  },
  rgb2xy: function(r, g, b){
    var
      R = (r > 0.04045) ? pow((r + 0.055) / (1.0 + 0.055), 2.4) : (r / 12.92),
      G = (g > 0.04045) ? pow((g + 0.055) / (1.0 + 0.055), 2.4) : (g / 12.92),
      B = (b > 0.04045) ? pow((b + 0.055) / (1.0 + 0.055), 2.4) : (b / 12.92)
    ;
    var rgb = [R, G, B], m11 = 0.649926, m12 =  0.103455, m13 =  0.197109,
      m21 = 0.234327, m22 = 0.743075, m23 = 0.022598,
      m31 = 0, m32 = 0.053077, m33 = 1.035763,
      X = m11*rgb[0] + m12*rgb[1] + m13*rgb[2],
      Y = m21*rgb[0] + m22*rgb[1] + m23*rgb[2],
      Z = m31*rgb[0] + m32*rgb[1] + m33*rgb[2],
      sum = X + Y + Z
    ;
    return "[" + X / sum + "," + Y / sum + "]";
  },
  getRootNode: function(){
    return df;
  },
  ready: function(cback){
    if(typeof cback === 'function'){
      readyCallbacks.push(cback);
    }else{
      console.error('[ready] the cback argument MUST be a function');
    }
  }
};

module.exports = hom.start();
