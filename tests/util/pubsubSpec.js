describe('pubsub module', function(){
  var pubsub = require('../../src/util/pubsub');

  it('should return topic and callback in the subscription object', function(){
    var
      topic = 'a topic',
      callback = function(){},
      subscription = pubsub.sub(topic, callback)
    ;
    expect(callback).toBe(subscription.cb);
    expect(topic).toBe(subscription.t);
    pubsub.unsub(subscription);
  });

  it('should return undefined when topic isn\'t a string', function(){
    var
      topic = {},
      callback = function(){},
      subscription = pubsub.sub(topic, callback)
    ;
    expect(subscription).toBe(undefined);
    pubsub.unsub(subscription);
  });

  it('should return undefined when callback isn\'t a function', function(){
    var
      topic = 'a topic',
      callback = 'function(){}',
      subscription = pubsub.sub(topic, callback)
    ;
    expect(subscription).toBe(undefined);
    pubsub.unsub(subscription);
  });

  it('should call the subscribed function', function(){
    var
      topic = 'a topic',
      callback = jasmine.createSpy(),
      subscription = pubsub.sub(topic, callback)
    ;
    pubsub.pub(topic);
    expect(callback).toHaveBeenCalled();
    pubsub.unsub(subscription);
  });

  it('should NOT call the unsubscribed function', function(){
    var
      topic = 'a topic',
      callback = jasmine.createSpy(),
      subscription = pubsub.sub(topic, callback)
    ;
    pubsub.unsub(subscription);
    pubsub.pub(topic);
    expect(callback).not.toHaveBeenCalled();
  });

  it('unsub should return a number', function(){
    var
      topic = 'a topic',
      callback = jasmine.createSpy(),
      subscription = pubsub.sub(topic, callback)
    ;
    expect(pubsub.unsub(subscription)).toEqual(jasmine.any(Number));
  });

  it('unsub should return undefined when the subscription is unsubscribed twice', function(){
    var
      topic = 'a topic',
      callback = jasmine.createSpy(),
      subscription = pubsub.sub(topic, callback)
    ;
    pubsub.unsub(subscription);
    expect(pubsub.unsub(subscription)).toBe(undefined);
  });

  it('unsub should return undefined when the subscription has the wrong format', function(){
    var
      topic = 'a topic',
      callback = jasmine.createSpy(),
      subscription = pubsub.sub(topic, callback),
      subscriptionCopy = subscription
    ;
    expect(pubsub.unsub({})).toBe(undefined);
    subscriptionCopy.cb = null; // dangerous
    expect(pubsub.unsub(subscriptionCopy)).toBe(undefined);
    subscriptionCopy = subscription;
    subscriptionCopy.t = null; // dangerous
    expect(pubsub.unsub(subscriptionCopy)).toBe(undefined); // error
  });

  it('should call only the subscribed function', function(){
    var
      topic = 'a topic',
      callback0 = jasmine.createSpy(),
      callback1 = jasmine.createSpy(),
      subscription0 = pubsub.sub(topic, callback0),
      subscription1 = pubsub.sub(topic, callback1)
    ;
    pubsub.pub(topic);
    expect(callback0).toHaveBeenCalled();
    expect(callback1).toHaveBeenCalled();

    pubsub.unsub(subscription0);

    pubsub.pub(topic);

    expect(callback0.calls.count()).toBe(1);
    expect(callback1.calls.count()).toBe(2);
  });

});
