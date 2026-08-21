import urllib.request, json, ssl, time, os

ctx = ssl.create_default_context()

def fetch(url):
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
    })
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        return json.loads(r.read())

all_results = {}

# Project hashes to fetch
projects = {
    'rJLmZO': 'Val Orlov artwork',
    'dOL4Q1': 'Unknown artwork',
    'Y8K86P': 'Kevin Jick - Frozen Colony',
    'nJV2V1': 'Kevin Jick - Sanctum Capital City',
    'elYyrX': 'Kevin Jick - Japanese Village',
    '2LlB2y': 'TheAtmosphere - Forza Horizon 6',
    'RKvE5e': 'TheAtmosphere - METAL SKIN PANIC',
    'K3ZQ1y': 'TheAtmosphere - HEAVY METAL',
    'RKgaWv': 'TheAtmosphere - ARTBOT 3000',
}

for pid, label in projects.items():
    url = f'https://www.artstation.com/projects/{pid}.json'
    try:
        data = fetch(url)
        title = data.get('title', '?')
        user = data.get('user', {}).get('full_name', '?')
        tags = data.get('tags', [])[:5]
        images = []
        for a in data.get('assets', []):
            if a.get('has_image') and a.get('asset_type') == 'image':
                images.append(a['image_url'])
        all_results[pid] = {
            'title': title,
            'user': user,
            'tags': tags,
            'images': images[:3],
            'url': f'https://www.artstation.com/artwork/{pid}'
        }
        print(f"OK  {pid}: {title} by {user} ({len(images)} images)")
        for img in images[:3]:
            print(f"    {img}")
    except Exception as e:
        print(f"FAIL {pid} ({label}): {e}")
    time.sleep(2)

with open('artstation_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_results, f, indent=2, ensure_ascii=False)

print(f"\nDone! Got {len(all_results)} projects saved to artstation_data.json")
