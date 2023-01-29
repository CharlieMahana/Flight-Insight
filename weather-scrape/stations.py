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
df = pl.scan_csv(
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

# Calculate slice values from widths.

df = df.with_columns(
    [
        pl.col("fullrow")
        .str.slice(slice_tuple[0] - 1, slice_tuple[1])
        .str.strip()
        .alias(col)
        for slice_tuple, col in zip(column_ranges, column_names, strict=True)
    ]
).drop("fullrow")
