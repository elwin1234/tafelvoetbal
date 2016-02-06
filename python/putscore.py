#!/usr/bin/env python
import time
import couchdb
import json
import sys
import os

data = json.load(open(os.path.dirname(os.path.abspath(__file__))+"/settings.json"))
host = str(data["database"]["host"])
port = str(data["database"]["port"])
user = str(data["database"]["user"])
password = str(data["database"]["password"])
dbname = str(data["database"]["name"])

uri = 'http://%s:%s@%s:%s' % (user, password, host, port)
print(uri)
couch = couchdb.Server(uri)
db = couch[dbname]

scoreval = sys.argv[1]
goalval = int(sys.argv[2])

print(goalval)
print(scoreval)

document = {
    "dev": scoreval,
    "type": "score",
    "goal": goalval,
    "time": int(round(time.time()*1000))
}

print(document)
db.save(document)
