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
 - [Apache CouchDB] (http://couchdb.apache.org). I use version 1.6.1. Any version >= 1.2 should work. Older versions do not support EventSource.
 - python2
 - python[2]-couchdb (python package)
 - RPi.GPIO (python package)

