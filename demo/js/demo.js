// global jQuery
(function(){
  var
  cmd$ = jQuery('#cmd'),
  msgColor = '#555',
  separator = '**********************************************************************************************',
  consoleMessages = [
    { message: separator, color: msgColor },
    { message:'JHuery console demo - <a href="http://www.tesseract.ch">Tesseract</a> 2016', color: msgColor },
    { message:'examples:', color: msgColor },
    { message:'// will turn all your lamps on', color: '#393' },
    { message:'jHuery("light").attr("on", true);', color: msgColor },
    { message:'// will make the lamp named "kitchen lamp" red', color: '#393'  },
    { message:'jHuery("light[name=\'kitchen lamp\']").attr("color", hom.rgb2xy(255, 0, 0));', color: msgColor },
    { message: separator, color: msgColor }
  ];

  MAX_HISTORY = 10,
  MAX_LINES = 100,
  consoleHistory = [],
  messages$ = jQuery('.messages'),
  historyPointer = -1,
  consoleLog = function(args){
    var line = document.createElement('div'), messagesNode = messages$[0];
    line.innerHTML = args.message;
    line.className = 'line';
    args.color && (line.style.color = args.color);

    messages$.append(line);
    messagesNode.scrollTop = messagesNode.scrollHeight;
  },
  startDemo = function(){
    for(var i = 0, l = consoleMessages.length; i < l; i++){
      consoleLog(consoleMessages[i]);
    }
    cmd$.on('keydown', onKeyPress);
    jHuery.ready(function(){
      consoleLog({ message: 'jHuery ready, {$lamps} lamp(s) found'.replace(/{\$lamps}/, jHuery('light').length) } );
    });
  }
;


startDemo();

})();
