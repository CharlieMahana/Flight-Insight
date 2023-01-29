import time 
import serial
import re
import math
import pymongo

# establish database connection
client = pymongo.MongoClient("mongodb+srv://<username>:<password>@cluster0.rpfddr7.mongodb.net/?retryWrites=true&w=majority")
db = client['LiveFlightData']
collection = db['turbulenceReadings']

# establish serial connection
ser = serial.Serial(
    port = '/dev/ttyACM0',
    baudrate = 9600,
    parity = serial.PARITY_NONE,
    stopbits = serial.STOPBITS_ONE,
    bytesize = serial.EIGHTBITS,
    timeout = 1,
)
counter = 0

while True:
    prev = 10
    mov = 10
    try:
        data = ser.readline()
        data = data.decode(encoding='utf-8')
        data = re.findall(r"([+-]?[0-9]*[.]?[0-9]+)", data)
        magnitude = math.sqrt(
            math.pow(float(data[0]), 2) + \
            math.pow(float(data[1]), 2) + \
            math.pow(float(data[2]), 2))
        collection.insert_many([{"relative: ": magnitude - prev, "emov": mov - magnitude}])
        print(f"{magnitude - prev},             {mov-magnitude}")
        prev = magnitude
        mov = 0.5 * mov + 0.5 * magnitude
    except: 
        pass
