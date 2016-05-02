jHuery
======
A ~~DOM~~ HOM based library to interact with the Philips HUE lights
---------------------------------------------------------------------

jHuery takes the DOM (or HOM, Home(e) Object Model :) ) API out of the browser, in the Real World (TM).
It is possible to turn on all the lights this way:

```javascript
jHuery('light').attr('on', true);
```
Or, even better, you can put the lamps in the right room, then:

```javascript
var kitchenLights$ = jHuery('kitchen>light'); 
kitchenLights$.attr('on', true);
kitchenLights$.attr('color', hom.rgb2xy(255, 0, 0)); // red!
```


###SETUP
In order to use the jHuery / HOM API, the HOM script tag must have a data-config attribute
containing the bridge address and the user key:

```javascript
  <script src="../dist/hom.js" data-config='{ "ip": "bridge IP address here", "key": "user key here" }'></script>
  <script src="../src/jhuery.js"></script>

```

Have fun!

###LICENSE

MIT