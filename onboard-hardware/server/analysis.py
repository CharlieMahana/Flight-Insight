import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib import style
import pymongo
import threading

client = pymongo.MongoClient("mongodb+srv://<>:<>@cluster0.rpfddr7.mongodb.net/?retryWrites=true&w=majority")
db = client['LiveFlightData']
collection = db['turbulenceReadings']

xs = []
ys = []

pipeline = [{'$match': {'operationType': 'insert'}}]
def watcher():
    for change in collection.watch(pipeline):
        try:
            xs.append(change['fullDocument']['relative: '])
            ys.append(len(xs))
        except:
            pass

t = threading.Thread(target=watcher)
t.start()

fig = plt.figure()
ax1 = fig.add_subplot(1,1,1)


def animate(i):
    ax1.clear()
    ax1.set_ylim([None, 40])
    ax1.plot(ys, xs)

ani = animation.FuncAnimation(fig, animate, interval = 50)
plt.show()