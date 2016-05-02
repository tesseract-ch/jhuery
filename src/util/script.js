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
