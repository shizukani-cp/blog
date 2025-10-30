import glob

def get_articles(top):
    files = glob.glob(f"{top}/articles/[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
    file_dates = [int(fname[-8:]) for fname in files]
    file_dates.sort()
    return [f"{top}/articles/{date}/index.md" for date in file_dates]

if __name__ == "__main__":
    for fname in get_articles("."):
        with open(fname, "r", encoding = "utf-8") as f:
            print(f.read())
