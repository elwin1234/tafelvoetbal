tafelvoetbal
============
Detect table football goals and collect statistics using a raspberry pi and sensors.

### Current state
First experimental setup to detect goals and display the current score on a web-interface.

### Hardware requirements
 - $35 [Raspberry Pi](http://www.raspberrypi.org) (I use model B, rev2)
 - Infrared Reflective Photoelectric Switch IR Barrier Line sensors (I use TCRT5000)
 - Some infrared leds
 - Cables to connect the sensors and leds to your rPi. Using female/female jumper wires may be an easy solution that eliminates the needs for soldering

### Software requirements
 - [Apache CouchDB] (http://couchdb.apache.org). I use version `1.6.1`. Any version >= `1.2` should work. Older versions do not support EventSource. Do not forget to allow other hosts than localhost to access Couch if you want the web-application to be visible by other machines than the rPI. You can do this by adding `bind_address = 0.0.0.0` in the `[httpd]` section in the `local.ini` settings file. Normally this file is available at `[/usr/local]/etc/couchdb/local.ini`.
 - python2
 - python[2]-couchdb (python package)
 - RPi.GPIO (python package)
 

I use [couchapp](https://github.com/couchapp/couchapp) to deploy my couchapp to the Raspberry Pi. The web-interface should be visible at http://**ip-pi**:5984/tafelvoetbal/_design/tafelvoetbal/_show/home afterwards.

