# to less number of api calls in free tier

import time

_cache = {}

def get(key: str):
    entry = _cache.get(key)
    if entry and time.time() < entry[1]:
        return entry[0]
    return None

def set(key: str, data, ttl_seconds: int = 3600):
    _cache[key] = (data, time.time() + ttl_seconds)

def cached(key: str, ttl_seconds: int = 3600):
    """Decorator-style helper for async functions."""
    def decorator(fn):
        async def wrapper(*args, **kwargs):
            hit = get(key)
            if hit:
                return hit
            result = await fn(*args, **kwargs)
            set(key, result, ttl_seconds)
            return result
        return wrapper
    return decorator