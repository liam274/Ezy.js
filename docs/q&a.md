# Ezy.js - Q&A

## Table of Contents
- [Whitelist Error](#whitelist-error)

## Whitelist Error
If you whitelisted an URL and still got blocked, it's likely because you have the old service worker still alive. Please try this:
`DevTools → Application → Service Workers → Unregister`