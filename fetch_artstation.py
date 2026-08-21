import urllib.request, json, ssl, time

ctx = ssl.create_default_context()

def fetch(url):
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
    })
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        return json.loads(r.read())

# Search for projects by tags
searches = [
    ('unity', 'unity+3d+game'),
    ('godot', 'godot+game+3d'),
    ('unreal', 'unreal+engine+environment'),
]

all_projects = []

for engine, query in searches:
    print(f"\n=== Searching: {engine} ===")
    try:
        # Try ArtStation search/explore API
        url = f'https://www.artstation.com/api/v2/community/explore/projects/trending.json?page=1&dimension=all&per_page=6'
        data = fetch(url)
        projects = data.get('data', [])
        for p in projects[:3]:
            title = p.get('title', '?')
            hash_id = p.get('hash_id', '')
            cover = p.get('cover', {})
            smaller_url = ''
            if isinstance(cover, dict):
                smaller_url = cover.get('medium_image_url', cover.get('small_image_url', ''))
            print(f"  {title} ({hash_id}) - cover: {smaller_url}")
            all_projects.append({
                'hash_id': hash_id,
                'title': title,
                'engine': engine.upper(),
                'cover': smaller_url,
            })
        break  # If this works, we have access
    except Exception as e:
        print(f"  Explore API failed: {e}")

# Try direct project fetches for known popular projects
print("\n=== Fetching individual projects ===")
known_projects = [
    # Popular Unity projects
    ('obkKaJ', 'UNITY'),    # SUIT UP! by Jake Woodruff (user had this open)
    ('Y8K86P', 'UNREAL'),   # Frozen Colony by Kevin Jick
    ('nJV2V1', 'BLENDER'),  # Sanctum Capital City by Kevin Jick
    ('K3ZQ1y', '3D'),       # HEAVY METAL by Jake Woodruff
    ('RKgaWv', '3D'),       # ARTBOT 3000 by Jake Woodruff
    ('rJLmZO', 'BLENDER'),  # Val Orlov scenes
    ('elYyrX', 'BLENDER'),  # Japanese Village by Kevin Jick
    ('2LlB2y', 'UNREAL'),   # Forza Horizon 6 Foliage
    ('RKvE5e', '3D'),       # METAL SKIN PANIC
    ('5eBBKw', 'UNITY'),    # Sanctum Animations
]

results = {}
for pid, engine in known_projects:
    url = f'https://www.artstation.com/projects/{pid}.json'
    try:
        data = fetch(url)
        title = data.get('title', '?')
        user = data.get('user', {}).get('full_name', '?')
        tags = data.get('tags', [])
        desc = data.get('description', '') or ''
        images = []
        for a in data.get('assets', []):
            if a.get('has_image') and a.get('asset_type') == 'image':
                images.append(a['image_url'])
        
        # Determine actual engine from tags
        tag_str = ' '.join(tags).lower()
        if 'unity' in tag_str:
            engine = 'UNITY'
        elif 'unreal' in tag_str:
            engine = 'UNREAL'
        elif 'godot' in tag_str:
            engine = 'GODOT'
        
        results[pid] = {
            'title': title,
            'user': user,
            'tags': tags[:8],
            'engine': engine,
            'images': images[:3],
            'description': desc[:200],
            'url': f'https://www.artstation.com/artwork/{pid}'
        }
        print(f"OK  {pid}: {title} by {user} [{engine}] ({len(images)} imgs)")
        for img in images[:2]:
            print(f"    {img}")
    except Exception as e:
        print(f"FAIL {pid}: {e}")
    time.sleep(1.5)

with open('artstation_data.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\nDone! Got {len(results)} projects.")
