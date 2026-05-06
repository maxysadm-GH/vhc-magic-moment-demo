# Resume — Magic Moment v2 Live Demo

**Last session:** 2026-05-06 (overnight)
**Live demo:** https://maxysadm-gh.github.io/vhc-magic-moment-demo/

---

## What works right now (verified)

| Layer | Status | Notes |
|---|---|---|
| GH Pages site (`https://maxysadm-gh.github.io/vhc-magic-moment-demo/`) | ✅ live | Vosges-toned single page, mobile responsive |
| Live canvas composite | ✅ live | Paste any domain → Clearbit logo extracted → gold-tinted → overlaid on Vosges box. Real-time. |
| 5 pre-generated variant videos | ✅ live | Veo 3 + audio (Shake), Sora 2 (Bite), Veo 3 macro (Texture), Seedance 9-ref (Pour), Higgsfield Garden Bloom (Unfurl), Higgsfield Agent Reveal (Reveal) |
| Higgsfield REST API | ✅ verified | API key + secret in `.env.local` of customizer repo. 121 motion presets indexed. |
| Sharp pre-composite step | ✅ verified | `mbacio-gift-customizer/scripts/composite-magic-moment.ts` produces clean `history-on-vosges-classic-parcel-1280x720.jpg` |
| Customizer CI (lint) | ✅ fixed | `tailwind.config.ts` `require()` → ESM import (commit `3084aec`) |

## What's blocked (the live n8n flow)

The end-to-end live flow (browser → n8n → Higgsfield → video back) is **wired but blocked at the upload step**. Two real blockers found:

1. **Higgsfield `image_url` has a 2083-char limit** — rules out passing the composite as a base64 data URL directly. We must host the composite at a real URL first.
2. **Catbox.moe rejects n8n cloud's data-center IP** with HTTP 412 "Invalid uploader" — they block anonymous uploads from server / data-center IPs.

### n8n workflows (both active, ready to use once upload is solved)

| Name | Workflow ID | URL |
|---|---|---|
| **Magic Moment v2 — Start** | `wJSfj1VyhsROD2eF` | `POST https://mbacio.app.n8n.cloud/webhook/magic-moment-start` |
| **Magic Moment v2 — Status** | `vROAnh4B80SPX2hk` | `POST https://mbacio.app.n8n.cloud/webhook/magic-moment-status` |

Status workflow is untested but follows the same shape — should work fine once Start emits a `job_set_id`.

## Three paths to unblock (pick one tomorrow)

### Path A — **Move upload to the browser** (recommended, no new accounts)

The browser is on a residential IP; Catbox accepts those. Restructure:

1. Browser composites locally (already does)
2. Browser uploads composite to Catbox via `fetch` (verify CORS first)
3. Browser POSTs `{composite_url, brand_name, motion_id}` to n8n Start
4. n8n Start collapses to 3 nodes: Webhook → HTTP Request (Higgsfield create) → Respond
5. Browser polls n8n Status until `video_url` returns

**Quick CORS check:** open browser console at the demo URL and run:
```js
const fd = new FormData();
fd.append('reqtype', 'fileupload');
fd.append('fileToUpload', new Blob(['hello'], {type: 'text/plain'}));
fetch('https://catbox.moe/user/api.php', { method: 'POST', body: fd }).then(r => r.text()).then(console.log);
```
If it returns a `https://files.catbox.moe/...` URL, CORS works. If CORS error, fall back to Path B.

### Path B — **ImgBB API key** (~30 sec)

Max signs up at https://imgbb.com/api → gets free API key → drops `IMGBB_API_KEY` env var in n8n cloud Settings → Variables. Swap Catbox node for ImgBB. ImgBB accepts base64 in form body, no Blob/FormData hacks needed.

```
POST https://api.imgbb.com/1/upload?key=<KEY>
form-data: image=<base64 string of jpeg>
returns { data: { url: "https://i.ibb.co/..." } }
```

### Path C — **Self-host composite via M51 → ngrok / Cloudflare tunnel** (ugly but works)

Run a tiny Express server on M51 that accepts the base64 + serves it back at a stable URL. Tunnel via ngrok / Cloudflare. Use the tunnel URL in the n8n Higgsfield call. Brittle — only works while M51 + tunnel are up.

## Tomorrow's checklist (in order)

- [ ] Open https://maxysadm-gh.github.io/vhc-magic-moment-demo/ — visually QA on phone + desktop
- [ ] Decide Path A / B / C above
- [ ] If Path A: test Catbox CORS in browser console, then update `index.html` to do the upload + replace static videos with the live-generated one
- [ ] If Path B: get ImgBB key, swap Catbox → ImgBB in n8n Start workflow
- [ ] Test end-to-end with the History Channel composite
- [ ] When the live flow works: add a "Generate cinematic reveal" button to the GH Pages demo
- [ ] Decide which 1 variant becomes the production magic moment in the real customizer (engine repo `mbacio-gift-customizer`)
- [ ] Wire that variant into the wizard's capture-submit step (per `D-007` in `mbacio-gift-customizer/.planning/DECISIONS.md`)

## Repos & paths

- **This demo:** https://github.com/maxysadm-GH/vhc-magic-moment-demo
- **Production engine:** https://github.com/maxysadm-GH/mbacio-gift-customizer (private)
- **Project research:** `mbacio-gift-customizer/.planning/research/2026-05-05-magic-moment-v2-research.md`
- **Brand guidelines (motion):** `~/.claude/skills/user/ui-ux-pro-max/brand-guidelines/vosges.md`
- **DECISIONS log:** `mbacio-gift-customizer/.planning/DECISIONS.md` (D-007 → D-015)
- **Memory pointer:** `~/.claude/projects/C--Users-maxys/memory/project_magic-moment-v2.md`

## Spend so far across all sessions

- Round 1 (full sweep, Replicate+Sora+Higgsfield): ~$17.10
- Higgsfield round 2 (4 motion variants): ~$2.10
- Higgsfield test (data-URL probe): rejected, no charge
- **Total: ~$19.20 of $30 ceiling** — $10.80 headroom for tomorrow's iteration.
