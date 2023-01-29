import time
import re
import math
import pymongo
import string
from random import *

# establish database connection
client = pymongo.MongoClient("mongodb+srv://tamuhack:tamuhack@cluster0.rpfddr7.mongodb.net/?retryWrites=true&w=majority")
db = client['weather']
collection = db['flights']

alphabet = list(string.ascii_uppercase)
locator = ""

doc_cursor = collection.find({ }, { '_id': 1 })

for i in doc_cursor:
    print(i)
    locator = ""
    for x in range(6):
        idx = randint(0,25)
        locator += alphabet[idx]
    collection.update_one({ '_id': i['_id'] }, { '$set': { 'recordLocator': locator } })