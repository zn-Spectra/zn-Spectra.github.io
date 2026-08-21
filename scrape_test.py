import cloudscraper, json

scraper = cloudscraper.create_scraper()

urls = [
    "https://www.artstation.com/users/kevinjick/projects.json",
    "https://www.artstation.com/users/theatmosphere/projects.json",
]

for url in urls:
    try:
        r = scraper.get(url, timeout=10)
        print("URL:", url, "Status code:", r.status_code)
        if r.status_code == 200:
            data = r.json()
            items = data.get("data", [])
            print("Found projects:", len(items))
            for item in items[:5]:
                print(f"  Project: {item.get('title')} ({item.get('hash_id')})")
        else:
            print("Response:", r.text[:300])
    except Exception as e:
        print("Error:", e)
