
describe('script module - getAttribute', function(){

  it('getAttribute - should return the configuration object', function(){
    var
      stringAttr = '{ "ip": "192.168.0.12", "key": "0123456789" }',
      scriptModule = require('../../src/util/script'),
      scriptTags = document.querySelectorAll('script'),
      scriptTag = scriptTags[ scriptTags.length - 1 ],
      parsedObj = JSON.parse(stringAttr),
      originalAttribute = scriptTag.getAttribute('data-config')
    ;

    scriptTag.setAttribute('data-config', stringAttr);

    expect(scriptModule.getAttribute('data-config').ip).toBe(parsedObj.ip);
    expect(scriptModule.getAttribute('data-config').key).toBe(parsedObj.key);

    scriptTag.setAttribute('data-config', originalAttribute);
  });
  it('getAttribute - getAttribute - should return undefined if the argument is not specified', function(){
    var
      stringAttr = '{ "ip": "192.168.0.12", "key": "0123456789" }',
      scriptModule = require('../../src/util/script'),
      scriptTags = document.querySelectorAll('script'),
      scriptTag = scriptTags[ scriptTags.length - 1 ],
      parsedObj = JSON.parse(stringAttr),
      originalAttribute = scriptTag.getAttribute('data-config')
    ;

    scriptTag.setAttribute('data-config', stringAttr);

    expect(scriptModule.getAttribute()).toBe(undefined);

    scriptTag.setAttribute('data-config', originalAttribute);
  });
  it('getAttribute - should return undefined if the attribute contains an invalid JSON', function(){
    var
      stringAttr = '{ "ip": 192.168.0.12, "key": "0123456789" }', // invalid JSON
      scriptModule = require('../../src/util/script'),
      scriptTags = document.querySelectorAll('script'),
      scriptTag = scriptTags[ scriptTags.length - 1 ],
      originalAttribute = scriptTag.getAttribute('data-config')
    ;

    scriptTag.setAttribute('data-config', stringAttr);

    expect(scriptModule.getAttribute('data-config')).toBe(undefined);

    scriptTag.setAttribute('data-config', originalAttribute);
  });
});
