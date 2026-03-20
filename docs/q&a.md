# Ezy.js - Q&A

If this document cannot solve the issue, please [contact me](mailto:ezyjsdeveloper@gmail.com)

## Table of Contents
- [Whitelist Error](#whitelist-error)
- [304 Error](#304-error)

## Whitelist Error
If you whitelisted an URL and still got blocked, it's likely because you have the old service worker still alive. Please try this:
`DevTools → Application → Service Workers → Unregister`
## 304 Error
Usually, if you get the returning error of 304 in resources loading: 
```sh
 HTTP  20/3/2026 上午8:57:35 ::1 GET /assets/setting.svg
 HTTP  20/3/2026 上午8:57:35 ::1 GET /assets/_home.svg
 HTTP  20/3/2026 上午8:57:35 ::1 GET /assets/notes.svg
 HTTP  20/3/2026 上午8:57:35 ::1 GET /assets/user.svg
 HTTP  20/3/2026 上午8:57:35 ::1 GET /assets/lab.svg
 HTTP  20/3/2026 上午8:57:35 ::1 Returned 304 in 31 ms
 HTTP  20/3/2026 上午8:57:35 ::1 Returned 304 in 31 ms
 HTTP  20/3/2026 上午8:57:35 ::1 Returned 304 in 31 ms
 HTTP  20/3/2026 上午8:57:35 ::1 Returned 304 in 27 ms
 HTTP  20/3/2026 上午8:57:35 ::1 Returned 304 in 29 ms
```
the major issue can be solved via opening the DevTool and reload