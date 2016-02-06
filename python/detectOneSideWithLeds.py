#!/usr/bin/python2
import time
import RPi.GPIO as io
import constants as C

# setup io
io.setmode(io.BCM)
io.setup(C.IR_DETECT_0, io.IN)
# io.setup(C.IR_DETECT_1, io.IN)

leds = C.LEDS
print "bo"
for i in leds:
    io.setup(i, io.OUT)
    io.output(i, io.LOW)

# Setup variables
lastTime = 0
counter = 0


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

io.add_event_detect(C.IR_DETECT_0, io.RISING, callback=movement)
# io.add_event_detect(C.IR_DETECT_1, io.RISING, callback=movement)


def putLedOn(index):
    print "index %d" % index
    # put all off
    for i in leds:
        io.output(i, io.LOW)
        pass

    for i in range(index):
        io.output(leds[i], io.HIGH)

while True:
    pass
    time.sleep(1)
