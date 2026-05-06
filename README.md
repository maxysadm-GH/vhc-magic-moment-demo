# Magic Moment Demo · Vosges × MBACIO

Live demo of the corporate-gifting magic moment: paste a website, watch
your brand's logo land on a real Vosges Haut-Chocolat luxury gift box,
then see five cinematic reveal styles.

**Live:** https://maxysadm-gh.github.io/vhc-magic-moment-demo/

## What's in this demo

- **Live canvas composite** — paste any domain, the demo auto-extracts
  the brand logo via Clearbit, gold-tints it, and overlays it on the
  Vosges purple-box collection in real time.
- **Five cinematic variants** — pre-generated against the History Channel
  test brand:
  - The Unfurl (Higgsfield Garden Bloom motion · 5s)
  - The Shake (Google Veo 3 + native audio · 6s)
  - The Texture (Google Veo 3 macro · 5s)
  - The Pour (ByteDance Seedance 2.0 Pro · 9-ref ID-lock · 8s)
  - The Reveal (Higgsfield Agent Reveal motion · 5s)

## Why these 5

Round 1 of the magic-moment v2 work generated 8 variants across 7 video
models (Veo 3, Sora 2 / GPT, Kling, Runway, Seedance, Higgsfield DoP,
Grok Imagine). The 5 here cover the four pillars — **Consistent ·
Realistic · Textured · FOMO** — with the strongest output per pillar.

## Architecture

Static single-page demo. No backend required. The live composite runs
client-side via HTML Canvas; logos are pulled from
[Clearbit Logo API](https://clearbit.com/logo). Variant videos are
served from this repo (`/videos/`) — typically ~75 MB total.

For the production engine (real wizard, asset library pull, Shopify
cart, etc.) see [maxysadm-GH/mbacio-gift-customizer](https://github.com/maxysadm-GH/mbacio-gift-customizer).

## Refs

- Brand guidelines: `~/.claude/skills/user/ui-ux-pro-max/brand-guidelines/vosges.md`
- Project research: `mbacio-gift-customizer/.planning/research/2026-05-05-magic-moment-v2-research.md`
- DECISIONS log: `mbacio-gift-customizer/.planning/DECISIONS.md` (D-007 → D-015)
