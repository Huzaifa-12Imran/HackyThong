import requests
import xml.etree.ElementTree as ET
import html

SOURCES = [
    "https://news.ycombinator.com/rss",
    "https://www.reddit.com/r/MachineLearning/.rss",
    "https://cloud.google.com/feeds/gcp-release-notes.xml",
]

def fetch_latest_ai_news() -> list:
    articles = []
    for url in SOURCES:
        try:
            # Added headers to avoid 403 for Reddit/HN
            headers = {'User-Agent': 'StackPulse/1.0 (Hackathon Project)'}
            response = requests.get(url, timeout=5, headers=headers)
            if response.status_code != 200:
                continue
                
            root = ET.fromstring(response.content)
            
            # Handle RSS 2.0 (item tags)
            items = root.findall('.//item')
            if not items:
                # Handle Atom (entry tags)
                items = root.findall('.//{http://www.w3.org/2005/Atom}entry')
            
            for item in items[:5]:
                title_node = item.find('title') or item.find('{http://www.w3.org/2005/Atom}title')
                desc_node = item.find('description') or item.find('{http://www.w3.org/2005/Atom}summary')
                
                title = title_node.text if title_node is not None else ""
                summary = desc_node.text if desc_node is not None else ""
                
                # Basic HTML tag stripping for summary
                if summary:
                    summary = html.unescape(summary)
                    import re
                    summary = re.sub('<[^<]+?>', '', summary)[:200]
                
                articles.append({
                    "title": title,
                    "summary": summary,
                    "source": url
                })
        except Exception as e:
            print(f"Error scanning {url}: {e}")
            continue
    return articles
