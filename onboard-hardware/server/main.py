import time 
import serial
import re
import math
import pymongo

# establish database connection
client = pymongo.MongoClient("mongodb+srv://tamuhack:tamuhack@cluster0.rpfddr7.mongodb.net/?retryWrites=true&w=majority")
db = client['inflight_data']
collection = db['environment_data']

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
    prev_turbulence_magnitude = 10
    if True:
        # read and parse data from inflight sensors
        data = []
        
        data1 = []
        while len(data1) != 3:
            data1text = ser.readline()
            data1text = data1text.decode(encoding='utf-8')
            data1 = [d for d in re.findall(r"([+-]?[0-9]*[.]?[0-9]+)", data1text)]
            print(data1text)
        for d in data1:
            data.append(d)

        data2 = []
        while len(data2) != 2:
            data2text = ser.readline()
            data2text = data2text.decode(encoding='utf-8')
            data2 = [d for d in re.findall(r"([+-]?[0-9]*[.]?[0-9]+)", data2text)]
            print(data2text)
        for d in data2:
            data.append(d)

        # structure data
        turbulence = (data[0], data[1], data[2])
        humidity = data[3]
        temperature = data[4]

        # print(str(turbulence) + " " + humidity + " " + temperature)

        # compute turbulence metrics
        turbulence_magnitude = math.sqrt(
            math.pow(float(turbulence[0]), 2) + \
            math.pow(float(turbulence[1]), 2) + \
            math.pow(float(turbulence[2]), 2))

        # upload data to database
        collection.insert_many([{
            "turbulence_delta": turbulence_magnitude - prev_turbulence_magnitude,
            "humidity": humidity,
            "temperature": temperature,
        }])
        
        # send updates to alert devices
        if (turbulence_magnitude - prev_turbulence_magnitude > 5):
            # num = 1
            ser.write((1).to_bytes(1, 'big'))

        # update time-tracked parameters
        prev_turbulence_magnitude = turbulence_magnitude
    # except: 
    #     # handle errors
    #     print("An error occured while processing. Sensor polling will continue")
