import polars as pl
import pymongo

# connect to mongodb datbase
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["weather"]


# get station data from file
# IV. FORMAT OF "ghcnd-stations.txt"
#
# ------------------------------
# Variable   Columns   Type
# ------------------------------
# ID            1-11   Character
# LATITUDE     13-20   Real
# LONGITUDE    22-30   Real
# ELEVATION    32-37   Real
# STATE        39-40   Character
# NAME         42-71   Character
# GSN FLAG     73-75   Character
# HCN/CRN FLAG 77-79   Character
# WMO ID       81-85   Character
# ------------------------------
db.drop_collection("stations")
with open("./data/ghcnd-stations.txt") as f:
    lines = ({'id': line[0:12].strip() or None, 'location': { 'type': 'Point',
                                                             'coordinates':
                                                             [line[21:31].strip()
                                                              or None,
                                                              line[12:21].strip()
                                                              or None,
                                                              line[31:38].strip()
                                                              or None]},
              'state': line[38:41].strip() or None, 'name': line[41:72].strip()
              or None, 'gsn': line[72:76].strip() or None, 'hcn':
              line[76:80].strip() or None , 'wmo': line[80:86].strip() or None
              } for line in f)
    db["stations"].insert_many(lines)

print(list(db.stations.find({}).limit(5)))

