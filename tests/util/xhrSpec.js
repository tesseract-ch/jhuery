require('jasmine-ajax');

describe('xhr - structure', function(){
  it('xhr should have get, post, delete and put methods', function(){
    var xhrModule = require('../../src/util/xhr');
    for(var i = 0, methods = ['get', 'post', 'put', 'delete'], l = methods.length; i < l; i++){
      expect(typeof xhrModule[methods[i]]).toBe('function');
    }
  });
});

describe('xhr - http calls', function(){
  beforeEach(function(){
    jasmine.Ajax.install();
  });
  afterEach(function(){
    jasmine.Ajax.uninstall();
  });
  it('xhr.get success', function(){

    var
      xhrModule = require('../../src/util/xhr'),
      url = 'test url',
      opts = {
        url: url,
        cback: jasmine.createSpy('success'),
        eback: jasmine.createSpy('failure')
      },
      xhr = new XMLHttpRequest()
    ;
    xhrModule.get(opts);

    expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

    expect(jasmine.Ajax.requests.mostRecent().url).toBe(url);

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": 'text/plain',
      "responseText": 'success response'
    });

    expect(opts.cback).toHaveBeenCalled();
    expect(opts.eback).not.toHaveBeenCalled();

    // without callback and errback
    xhr = new XMLHttpRequest();
    opts = {
      url: url
    };

    xhrModule.get(opts);

    expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

    expect(jasmine.Ajax.requests.mostRecent().url).toBe(url);

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": 'text/plain',
      "responseText": 'success response'
    });
    // noop, emptyFn executed
  });

  it('xhr.get failure', function(){
    var
      xhrModule = require('../../src/util/xhr'),
      url = 'test url',
      opts = {
        url: url,
        cback: jasmine.createSpy('success'),
        eback: jasmine.createSpy('failure')
      },
      xhr = new XMLHttpRequest()
    ;
    xhrModule.get(opts);

    expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

    expect(jasmine.Ajax.requests.mostRecent().url).toBe(url);

    jasmine.Ajax.requests.mostRecent().responseError({
      "status": 500,
      "responseText": "",
      "contentType": 'text/plain'
    });
    expect(opts.cback).not.toHaveBeenCalled();
    expect(opts.eback).toHaveBeenCalled();

    // without callback and errback
    xhr = new XMLHttpRequest();
    opts = {
      url: url
    };

    xhrModule.get(opts);

    expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

    expect(jasmine.Ajax.requests.mostRecent().url).toBe(url);

    jasmine.Ajax.requests.mostRecent().responseError({
      "status": 500,
      "contentType": 'text/plain'
    });
    // noop, emptyFn executed

  });
});
