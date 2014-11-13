#!/usr/bin/python2
import time
import couchdb
import RPi.GPIO as io
import constants as C

# setup io
io.setmode(io.BCM)
io.setup(C.IR_DETECT_0, io.IN)
io.setup(C.IR_DETECT_1, io.IN)

# Setup Couch
couch = couchdb.Server(C.COUCH_SERVER)
db = couch[C.COUCH_DB]

docA = db['scoreA']
docB = db['scoreB']

docA['score'] = 0
docB['score'] = 0
db[docA.id] = docA
db[docB.id] = docB

# Setup variables
lastTime = 0


def movement(channel):
    global counter
    global lastTime

    curTime = int(round(time.time() * 1000))
    print("%d pin #%d: Movement detected" % (curTime, channel))
    if curTime - lastTime > C.NEXT_GOAL_DELAY:
        lastTime = curTime
        print "==============  GOAL ======================== "
        if channel == 23:
            docA['score'] += 1
            db[docA.id] = docA
        else:
            docB['score'] += 1
            db[docB.id] = docB

io.add_event_detect(C.IR_DETECT_0, io.RISING, callback=movement)
io.add_event_detect(C.IR_DETECT_1, io.RISING, callback=movement)

while True:
    pass
    time.sleep(1)
