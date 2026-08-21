import cloudscraper, json, time

scraper = cloudscraper.create_scraper()

hashes = [
    ("rJLmZO", "BLENDER"),  # Val Orlov - Littleland
    ("dOL4Q1", "UNITY"),    # Jeryce Dianingana - CCA Subway Train
    ("Y8K86P", "UNREAL"),   # Kevin Jick - Frozen Colony
    ("nJV2V1", "UNREAL"),   # Kevin Jick - Sanctum
    ("K3ZQ1y", "3D"),       # Jake Woodruff - HEAVY METAL
    ("RKgaWv", "3D"),       # Jake Woodruff - ARTBOT 3000
]

projects_data = []

for h, default_engine in hashes:
    url = f"https://www.artstation.com/projects/{h}.json"
    print(f"Fetching {h}...")
    try:
        r = scraper.get(url, timeout=10)
        if r.status_code == 200:
            data = r.json()
            title = data.get("title", "")
            user = data.get("user", {})
            artist = user.get("full_name", "")
            tags = [t.lower() for t in data.get("tags", [])]
            
            # Determine engine from tags
            engine = default_engine
            if any(x in tags for x in ["unity", "unity3d"]):
                engine = "UNITY"
            elif any(x in tags for x in ["unreal", "ue4", "ue5", "unreal engine"]):
                engine = "UNREAL"
            elif any(x in tags for x in ["godot"]):
                engine = "GODOT"
            elif any(x in tags for x in ["blender"]):
                engine = "BLENDER"
                
            images = []
            for a in data.get("assets", []):
                if a.get("has_image") and a.get("asset_type") == "image":
                    images.append(a.get("image_url"))
            
            # Use the first image as cover
            img = images[0] if images else ""
            desc = data.get("description", "") or ""
            # Strip HTML tags from description if any
            import re
            desc = re.sub('<[^<]+?>', '', desc).strip()
            if len(desc) > 150:
                desc = desc[:150] + "..."
                
            projects_data.append({
                "title": title,
                "category": data.get("categories", [{}])[0].get("name", "3D Environment") if data.get("categories") else "3D Environment",
                "engine": engine,
                "artist": artist,
                "image": img,
                "artstation": f"https://www.artstation.com/artwork/{h}",
                "description": desc
            })
            print(f"  Success: {title} by {artist} ({engine})")
            print(f"  Img: {img}")
        else:
            print(f"  Failed {h}: {r.status_code}")
    except Exception as e:
        print(f"  Error {h}: {e}")
    time.sleep(1)

# Write to temp file
with open("artstation_fetched.json", "w", encoding="utf-8") as f:
    json.dump(projects_data, f, indent=2, ensure_ascii=False)
print("Finished!")
