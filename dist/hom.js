/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var hom = __webpack_require__(1);

	if(typeof window.define === 'function'){
	  !(__WEBPACK_AMD_DEFINE_FACTORY__ = (hom), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}else{
	  window.hom = hom;
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint globalstrict: true */
	/* global module, require, document, MutationObserver, console */

	'use strict';


	var
	pubsub         = __webpack_require__(2),
	xhr            = __webpack_require__(3),
	constants      = __webpack_require__(4),
	bridgeManager  = __webpack_require__(5),
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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
	  "HOM_HUE_DATA"             : "hom_hue_data",
	  "BRIDGE_FOUND"             : "bridge/found",
	  "DATA_RECEIVED"            : "hom/data_received",
	  "START_BRIDGE_REGISTRATION": "bridge/start_registration"
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint globalstrict: true */
	/* global module, require, localStorage, setTimeout, console */

	'use strict';

	var
	constants     = __webpack_require__(4),
	xhr           = __webpack_require__(3),
	pubsub        = __webpack_require__(2),
	cfgReader     = __webpack_require__(6),
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var
	  scriptUtil  = __webpack_require__(7),
	  reader = {
	  /**
	  * @description load the bridge info
	  * @return {Array} known bridges
	  */
	  load: function(cback){
	    cback(scriptUtil.getAttribute('data-config'));
	  }
	};

	module.exports = reader;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var script = {
	  getAttribute: function(key){
	    var
	      oAttr,
	      scripts = document.querySelectorAll('script'), currentScript = scripts[ scripts.length - 1 ],
	      attr = currentScript.getAttribute(key)
	    ;
	    if(!attr){
	      return;
	    }

	    try{
	      oAttr = JSON.parse(attr);
	    }catch(error){
	      console.info('the attribute must be a valid JSON');
	    }

	    return oAttr;
	  }
	};

	module.exports = script;


/***/ }
/******/ ]);