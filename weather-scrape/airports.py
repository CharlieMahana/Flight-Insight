import polars as pl
import pymongo

# connect to mongodb datbase
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["weather"]
db.drop_collection("airports")

# get airport data
airports = pl.scan_csv("data/airports.csv")
us_only = airports.filter(pl.col("iso_country") == "US")
with_iata_code = us_only.filter(pl.col("iata_code") != "")
with_geojson = with_iata_code.with_columns(pl.struct(["latitude_deg",
                                                      "longitude_deg",
                                                      "elevation_ft"]).apply(lambda
                                                                             loc:
                                                                             {"type":
                                                                              "Point",
                                                                              "coordinates":
                                                                              [loc["longitude_deg"],
                                                                               loc["latitude_deg"],
                                                                               loc["elevation_ft"] or 0. * 0.3048
                                                                               ]}).alias("location"))
# add airport data to mongodb
airport_data = with_geojson.select(pl.col(['id', 'ident', 'type', 'name',
                                           'location', 'elevation_ft',
                                           'continent', 'iso_region',
                                           'municipality', 'scheduled_service',
                                           'gps_code', 'iata_code',
                                           'local_code', 'wikipedia_link',
                                           'keywords']))
db["airports"].insert_many(airport_data.collect().to_dicts())
# print sample of airport data in database
print(list(db["airports"].find({}).limit(5)))


