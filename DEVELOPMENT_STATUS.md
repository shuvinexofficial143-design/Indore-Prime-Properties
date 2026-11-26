# Development status
Current branch preview/phase-3-5-platform: combined phase 3–6 implementation (not yet verified).
- Phase 0/1 CI 45815666613 passed; phase 2 noindex assertion fixed in 45b8d6f, CI run 45817368434 passed migrations, seed, auth integration, build and HTTP smoke.
- Phase 3: 26 fictional demo listings, database-backed public catalog when configured, explicit sample data fallback without DB, tenant-scoped CRUD/status management, private S3-compatible file upload (3 MB limit), visibility controls, photos/floor plan/PDF/self-contained GLB/panorama. Upload depends on actual private bucket credentials; no object storage provisioned. No video or large file upload yet.
- Phase 4: mobile nav, browser-local saved/compare/recent collections, shareable compare up to three, EMI, enhanced catalog filters. Account sync and PWA pending.
- Phase 5: actual Three.js procedural villa, orbit/pan/zoom/fullscreen/camera presets/interior cutaway/markers, manual published GLB loader and image fallback. Full first-person collision walkthrough, compressed models and verified floor geometry pending.
- Phase 6: actual 360° WebGL panorama viewer, three synthetic rendered room scenes, hotspots and owner builder for uploaded 2:1 panoramas, scene selection and touch/zoom. Uploaded tour integration requires storage. Gyroscope and visual drag/drop hotspot editor pending.
- CI includes disposable PostgreSQL, unit/integration and Playwright browser checks. Results pending for combined branch.
- Live Neon and Vercel blocked: prior connector Tool not found / 403. No external paid services activated. No main merge.
- Next: verify combined CI and fix, then CRM, visits, agent follow-ups, PWA and AI studio. Resolve live infrastructure and licensed photography separately.
