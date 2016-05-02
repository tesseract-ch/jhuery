var
  scriptUtil  = require('../util/script'),
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
