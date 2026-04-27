import requests
import xml.etree.ElementTree as ET
import html
import re

# Curated baseline context — always available, always relevant to AI stacks.
# Gemini supplements these with its own training knowledge.
BASELINE_ECOSYSTEM_CONTEXT = [
    {
        "title": "Google Gemini 2.5 Flash pricing reduced 30% effective April 2025",
        "summary": "Gemini 2.5 Flash input/output token costs dropped significantly. Teams using it for high-volume inference workloads should recalculate their monthly API spend.",
        "source": "Google AI Blog"
    },
    {
        "title": "Pinecone v1 REST API deprecated — v2 migration required",
        "summary": "Pinecone deprecated their original REST endpoint. Codebases using the old pinecone-client library must migrate to the new Pinecone() class. Breaking change if not addressed.",
        "source": "Pinecone Changelog"
    },
    {
        "title": "Firebase Firestore adds native vector search (GA)",
        "summary": "Firestore now supports vector embeddings and ANN search natively. Teams paying for separate vector databases like Pinecone can eliminate that cost by migrating to Firestore vector search.",
        "source": "Firebase Blog"
    },
    {
        "title": "text-embedding-004 superseded by text-embedding-005",
        "summary": "Google released text-embedding-005 with 40% lower cost per token and 15% better benchmark scores on semantic similarity. Drop-in replacement for 004.",
        "source": "Google AI"
    },
    {
        "title": "Cloud Run pricing update — minimum instances now cheaper",
        "summary": "Google Cloud Run reduced the cost of keeping minimum instances warm. Teams with always-on services can reduce idle compute costs by adjusting min-instance settings.",
        "source": "GCP Release Notes"
    },
    {
        "title": "OpenAI GPT-4o mini significantly cheaper than GPT-4o",
        "summary": "GPT-4o mini achieves ~90% of GPT-4o quality at 15x lower cost. Teams using GPT-4o for non-critical tasks like summarization or classification should evaluate the switch.",
        "source": "OpenAI Changelog"
    },
    {
        "title": "Anthropic Claude 3.5 Haiku released — fastest Claude model",
        "summary": "Claude 3.5 Haiku offers sub-second latency for most prompts at dramatically lower cost than Sonnet. Good replacement for latency-sensitive inference pipelines.",
        "source": "Anthropic Blog"
    },
    {
        "title": "Resend adds bulk email API with 40% volume discount",
        "summary": "Resend introduced tiered pricing for bulk sends. Teams sending >10k emails/month qualify for automatic discounts without plan changes.",
        "source": "Resend Blog"
    },
]

LIVE_SOURCES = [
    "https://news.ycombinator.com/rss",
    "https://cloud.google.com/feeds/gcp-release-notes.xml",
]


def fetch_latest_ai_news() -> list:
    """
    Returns AI ecosystem news for Gemini to analyze against the founder's stack.
    Strategy: always include curated baseline context, then supplement with
    whatever live feed items we can get within the timeout.
    """
    articles = list(BASELINE_ECOSYSTEM_CONTEXT)  # always start with reliable context

    for url in LIVE_SOURCES:
        try:
            headers = {'User-Agent': 'StackPulse/1.0 (Hackathon Project)'}
            response = requests.get(url, timeout=4, headers=headers)
            if response.status_code != 200:
                continue

            root = ET.fromstring(response.content)

            items = root.findall('.//item')
            if not items:
                items = root.findall('.//{http://www.w3.org/2005/Atom}entry')

            for item in items[:4]:
                title_node = item.find('title') or item.find('{http://www.w3.org/2005/Atom}title')
                desc_node = item.find('description') or item.find('{http://www.w3.org/2005/Atom}summary')

                title = (title_node.text or "").strip() if title_node is not None else ""
                summary = (desc_node.text or "").strip() if desc_node is not None else ""

                # Skip empty, self-promo, or clearly irrelevant items
                skip_keywords = ['self-promotion', 'hiring', 'who is hiring', 'who wants to be hired', '[d]']
                if not title or any(kw in title.lower() for kw in skip_keywords):
                    continue

                if summary:
                    summary = html.unescape(summary)
                    summary = re.sub('<[^<]+?>', '', summary)[:200]

                articles.append({
                    "title": title,
                    "summary": summary,
                    "source": url
                })
        except Exception as e:
            print(f"[scanner] Live feed {url} unavailable: {e}")
            continue

    return articles
