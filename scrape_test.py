import requests, re

url = "https://www.artstation.com/artwork/dOL4Q1"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
}

try:
    r = requests.get(url, headers=headers, timeout=10)
    print("Status code:", r.status_code)
    if r.status_code == 200:
        html = r.text
        # Search for CDN images
        urls = re.findall(r'https://cdna?b?\.artstation\.com/p/assets/[^"\'>\s]+', html)
        print("Found CDNs:", len(urls))
        for u in set(urls)[:10]:
            print(u)
    else:
        print(r.text[:500])
except Exception as e:
    print("Error:", e)
