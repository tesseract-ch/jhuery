;(function(){
  'use strict';
  /* global jQuery */
  var jHuery = (function(){

    var homNode = hom.getRootNode();
    return function(selector){
      return jQuery(selector, homNode);
    };

  })();
  if(typeof define === 'function'){
    define(jHuery);
    return;
  }
  jHuery.ready = function(){
    hom.ready.apply(hom, arguments);
  };
  window.jHuery = jHuery;
})();
