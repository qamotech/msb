---
title: Web app standards (security, perf, a11y, correctness)
summary: Checklist every new or edited single-file HTML app must follow — from the 2026-09-24 portfolio review
pin: true
tags: [standards, html, security, performance, accessibility]
---

# Web app standards

## Security
- API keys go in their own namespaced localStorage key, never in the main state blob or URL params. Send them as headers (`x-goog-api-key`, `Authorization: Bearer`).
- Markdown renderers allow only `http(s)://` links and build HTML through a `<template>` element.
- `window.open(..., "noopener,noreferrer")` always.
- User-supplied base URLs must be `https://`. Warn on private or loopback IPs.
- Apps that call external APIs get a `<meta http-equiv="Content-Security-Policy">`.
- Personal and local tools get `<meta name="robots" content="noindex, nofollow">`.

## Performance
- Store `requestAnimationFrame` and `setInterval` IDs. Stop when the feature is off, pause on `visibilitychange`, clear on `pagehide`.
- Don't call `getBoundingClientRect` inside rAF. Cache sizes through a `ResizeObserver`.
- With `backdrop-filter`, use no duplicate declarations, set `isolation: isolate`, and put `will-change: transform` on animated pseudo-elements.
- Table-cell transitions are at least 80ms.

## Accessibility
- Always include `@media (prefers-reduced-motion: reduce)` setting animation and transition durations to `0.01ms !important`.

## Correctness
- Per-day state keys use the `getUTC*` date parts.
- Cache keys use `crypto.subtle.digest('SHA-256')`, not 32-bit hashes.
- Multi-turn chat sends a structured `messages` array and skips the cache in conversation mode.
- Check `file.size` before loading user files (max 500 MB for audio).
