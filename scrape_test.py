import cloudscraper, re, json

scraper = cloudscraper.create_scraper()

urls = [
    "https://www.artstation.com/projects/dOL4Q1.json",
    "https://www.artstation.com/projects/rJLmZO.json",
]

for url in urls:
    try:
        r = scraper.get(url, timeout=10)
        print("URL:", url, "Status code:", r.status_code)
        if r.status_code == 200:
            data = r.json()
            title = data.get("title")
            print("Title:", title)
            for a in data.get("assets", []):
                if a.get("has_image"):
                    print("  IMG:", a.get("image_url"))
        else:
            print("Response:", r.text[:300])
    except Exception as e:
        print("Error:", e)
