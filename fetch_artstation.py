import requests, json, time

s = requests.Session()
s.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
})

# Get cookies first
s.get('https://www.artstation.com', timeout=10)
time.sleep(2)

# All project hashes to fetch
projects = [
    'rJLmZO',   # Val Orlov artwork
    'dOL4Q1',   # Unknown artwork
    'Y8K86P',   # Kevin Jick - Frozen Colony
    '5eBBKw',   # Kevin Jick - Sanctum Animations
    'nJV2V1',   # Kevin Jick - Sanctum Capital City
    'elYyrX',   # Kevin Jick - Japanese Village
    '2LlB2y',   # TheAtmosphere - Forza Horizon 6 Foliage
    'RKvE5e',   # TheAtmosphere - Kitbash METAL SKIN PANIC
    'K3ZQ1y',   # TheAtmosphere - HEAVY METAL
    'RKgaWv',   # TheAtmosphere - ARTBOT 3000
]

all_data = {}

for pid in projects:
    url = f'https://www.artstation.com/projects/{pid}.json'
    try:
        r = s.get(url, timeout=15)
        if r.status_code == 200:
            data = r.json()
            title = data.get('title', '?')
            user = data.get('user', {}).get('full_name', '?')
            tags = data.get('tags', [])
            images = []
            for a in data.get('assets', []):
                if a.get('has_image') and a.get('asset_type') == 'image':
                    images.append(a['image_url'])
            
            all_data[pid] = {
                'title': title,
                'user': user,
                'tags': tags,
                'images': images[:3],
            }
            print(f"OK {pid}: {title} by {user}")
            for img in images[:3]:
                print(f"  {img}")
        else:
            print(f"FAIL {pid}: status {r.status_code}")
    except Exception as e:
        print(f"ERROR {pid}: {e}")
    time.sleep(1.5)

# Save to JSON
with open('artstation_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, indent=2, ensure_ascii=False)
print("\nSaved to artstation_data.json")
