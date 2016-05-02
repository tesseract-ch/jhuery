var hom = require('./hom');

if(typeof window.define === 'function'){
  define(hom);
}else{
  window.hom = hom;
}
