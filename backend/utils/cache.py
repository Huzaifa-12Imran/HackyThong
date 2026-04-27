import time
import json


class ResponseCache:
    """Server-side response caching for reliable demo performance."""

    def __init__(self, ttl_seconds=300):
        self._cache = {}
        self._ttl = ttl_seconds

    def get(self, key: str) -> dict:
        """Return cached response if still valid, else None."""
        if key in self._cache:
            entry = self._cache[key]
            if time.time() - entry['timestamp'] < self._ttl:
                return entry['data']
            else:
                del self._cache[key]
        return None

    def set(self, key: str, data: dict):
        """Cache a response with current timestamp."""
        self._cache[key] = {
            'data': data,
            'timestamp': time.time()
        }

    def make_key(self, *args) -> str:
        """Create a cache key from arguments."""
        parts = []
        for arg in args:
            if isinstance(arg, dict):
                parts.append(json.dumps(arg, sort_keys=True))
            else:
                parts.append(str(arg))
        return ":".join(parts)

    def clear(self):
        """Clear the entire cache."""
        self._cache = {}


# Singleton cache instance — shared across the app
response_cache = ResponseCache(ttl_seconds=300)
