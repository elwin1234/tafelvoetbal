#!/usr/bin/python2
import time
import RPi.GPIO as GPIO
import constants as C

# setup GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(C.IR_DETECT_0, GPIO.IN)

leds = C.LEDS

for i in leds:
    GPIO.setup(i, GPIO.OUT)
    GPIO.output(i, GPIO.LOW)

# button test
GPIO.setup(25, GPIO.IN)

# Setup variables
lastTime = 0
counter = 0
risec = 0


def movement(channel):
    global counter
    global lastTime

    curTime = int(round(time.time() * 1000))
    print("%d pin #%d: Movement detected" % (curTime, channel))
    if curTime - lastTime > C.NEXT_GOAL_DELAY:
        lastTime = curTime
        print "==============  GOAL ======================== "
        if channel == C.IR_DETECT_0:
            print "goalA"
            counter = (counter + 1) % (len(leds)+1)
            putLedOn(counter)
        else:
            print "goalB"


def rising(channel):
    global risec
    risec += 1
    print "rising %d" % risec
    if GPIO.input(25):
        print "OFF"
        putLedOff(1)
    else:
        print "ON"
        putLedOn(1)


def falling(channel):
    print "falling"

GPIO.add_event_detect(C.IR_DETECT_0, GPIO.RISING, callback=movement)
# GPIO.add_event_detect(C.IR_DETECT_1, GPIO.RISING, callback=movement)
GPIO.add_event_detect(25, GPIO.BOTH, callback=rising)
# GPIO.add_event_detect(25, GPIO.BOTH, callback=falling)


def putLedOff(index):
    print "index %d" % index
    GPIO.output(leds[0], GPIO.LOW)


def putLedOn(index):
    print "index %d" % index

    # put all off
    for i in leds:
        GPIO.output(i, GPIO.LOW)
        pass

    for i in range(index):
        GPIO.output(leds[i], GPIO.HIGH)

while True:
    print "still running"
    pass
    time.sleep(10)
