import os
import polars as pl
import pymongo
from joblib import Parallel, delayed

# connect to mongodb datbase
# client = pymongo.MongoClient("mongodb://localhost:27017/")
# db = client["weather"]


def process_file(file):
    # df = pl.scan_csv("./data/ghcnd_all/*[01]?.dly", has_header=False, with_column_names=lambda _: ["fullrow"])
    df = pl.scan_csv(
        f"./data/ghcnd_all/{file}",
        has_header=False,
        with_column_names=lambda _: ["fullrow"],
    )
    widths = [11, 4, 2, 4] + [5, 1, 1, 1] * 31
    column_names = ["id", "year", "month", "element"] + [
        f"{flag}{i}"
        for i in range(1, 32)
        for flag in ["value", "mflag", "qflag", "sflag"]
    ]

    # Calculate slice values from widths.
    slice_tuples = []
    offset = 0

    for i in widths:
        slice_tuples.append((offset, i))
        offset += i

    df = df.with_columns(
        [
            pl.col("fullrow")
            .str.slice(slice_tuple[0], slice_tuple[1])
            .str.strip()
            .alias(col)
            for slice_tuple, col in zip(slice_tuples, column_names, strict=True)
        ]
    ).drop("fullrow")

    # cast the values to floats
    df = df.with_columns(pl.col(r"^value.*$").cast(pl.Float32))
    # cast the flags to categorical
    # df = df.with_columns(pl.col(r'^[mqs]flag.*$').cast(pl.Categorical))

    # coalesce each day's value, mflag, qflag, and sflag into one column
    df = df.with_columns(
        [
            pl.struct(
                [pl.col(f"{flag}{i}") for flag in ["value", "mflag", "qflag", "sflag"]]
            ).alias(f"day{i}")
            for i in range(1, 32)
        ]
    )

    # extract day of month from the end of the day column name
    df = df.melt(
        id_vars=["id", "year", "month", "element"],
        value_vars=[f"day{i}" for i in range(1, 32)],
        variable_name="day",
        value_name="observation",
    )
    # cast day to integer
    df = df.with_columns(
        pl.col("day").str.extract(r"day(\d\d?)").cast(pl.Int32).alias("day")
    )
    # can't believe i have to fucking do this but remove crossover fields from the melt, only keeping fields of the struct whose suffixs matches the day
    df = df.with_columns(
        [
            pl.struct(["day", "observation"])
            .apply(
                lambda row: {
                    attr: row["observation"][f'{attr}{row["day"]}']
                    for attr in ["value", "mflag", "qflag", "sflag"]
                }
            )
            .alias("observation")
        ]
    )
    # filter out rows where the value is missing
    df = df.filter(pl.col("observation").struct.field("value") != -9999.0)

    # extract the date from the separate columns and drop the individual columns
    df = (
        df.with_columns(
            pl.date(pl.col("year"), pl.col("month"), pl.col("day")).alias("date")
        )
        .drop(["year", "month", "day"])
        .filter(pl.col("date").is_not_null())
    )
    # filter by dates between 2009-01-01 and 2019-01-01, since that's all the test data we have
    df = df.filter(
        pl.col("date").is_between(
            pl.date(2009, 1, 1), pl.date(2019, 1, 1), closed="right"
        )
    )

    # add the element to the observation
    df = df.with_columns(pl.struct(["element", "observation"]).alias("observation"))
    # group by id and date, then aggregate the observations into a list by element
    df = df.groupby(["id", "date"]).agg(
        pl.col("observation").list().alias("observations")
    )
    # turn the list of observations into a struct keyed by the element
    df = df.with_columns(
        pl.struct(["observations"])
        .apply(
            lambda row: {
                row["observations"][i]["element"]: row["observations"][i]["observation"]
                for i in range(len(row["observations"]))
            }
        )
        .alias("observations")
    )

    df = df.collect()
    if not df.is_empty():
        print(df)

    df.write_json(f"./data/ghcnd_all/{file}.json", row_oriented=True)
    del df


results = Parallel(n_jobs=3, verbose=11)(
    delayed(process_file)(file)
    for file in os.listdir("./data/ghcnd_all/")
    if file.endswith(".dly") and not os.path.exists(f"./data/ghcnd_all/{file}.json")
)
