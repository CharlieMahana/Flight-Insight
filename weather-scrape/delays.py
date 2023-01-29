import os
import polars as pl
import numpy as np

# load the delays dataset
delays = pl.scan_csv("./data/20*.csv", has_header=True, low_memory=True)
# select relevant fields
delays = delays.select(
    [
        pl.col("FL_DATE").alias("date"),
        pl.col("DEP_DELAY").alias("dep_delay"),
        pl.col("ARR_DELAY").alias("arr_delay"),
        pl.col("ORIGIN").alias("origin"),
        pl.col("DEST").alias("dest"),
    ]
)

airports = (
    pl.scan_csv("./data/airports.csv", has_header=True)
    .filter(pl.col("iso_country") == "US")
    .filter(pl.col("iata_code") != "")
    .select(["iata_code", "latitude_deg", "longitude_deg", "elevation_ft"])
)
print(airports.fetch(1))

# join the airports to the delays
delays = delays.join(
    airports.with_columns(pl.col("iata_code").alias("origin")), on="origin"
).join(airports.with_columns(pl.col("iata_code").alias("dest")), on="dest")

# load the stations data

stations = pl.scan_csv(
    f"./data/ghcnd-stations.txt",
    has_header=False,
    with_column_names=lambda _: ["fullrow"],
)
column_ranges = [
    (1, 11),
    (12, 20),
    (21, 30),
    (31, 37),
    (38, 40),
    (41, 71),
    (72, 75),
    (76, 79),
    (80, 85),
]
column_names = [
    "id",
    "latitude",
    "longitude",
    "elevation",
    "state",
    "name",
    "gsn",
    "hcn",
    "wmo",
]

stations = stations.with_columns(
    [
        pl.col("fullrow")
        .str.slice(slice_tuple[0] - 1, slice_tuple[1])
        .str.strip()
        .alias(col)
        for slice_tuple, col in zip(column_ranges, column_names, strict=True)
    ]
).drop("fullrow")

# find the closest station to each airport
if os.path.exists("./data/airport-stations.csv"):
    airports = airports.join(pl.scan_csv("./data/airport-stations.csv"), on="iata_code")
else:
    airport_stations = (
        airports.select(["iata_code", "latitude_deg", "longitude_deg"])
        .join(stations, how="cross")
        .select(
            pl.struct([pl.col("latitude_deg"), pl.col("longitude_deg"), pl.col("latitude"), pl.col("longitude")]).apply(lambda row: np.sqrt(abs(row["latitude_deg"] - row["latitude"])**2 + abs(row["longitude_deg"] - row["longitude"])**2)).alias("distance"))
        )
        # .groupby(["iata_code", "id"])
        #     .alias("distance")
        # .agg(pl.min("distance"))
        # .rename({"id": "station_id"})
    )
    print(airport_stations.fetch(5))
