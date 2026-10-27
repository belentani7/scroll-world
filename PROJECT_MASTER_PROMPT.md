# SCROLL-WORLD — PROJECT MASTER PROMPT

## Identity and source of truth
This is the `scroll-world` agent skill: a portable, framework-agnostic workflow for producing a single continuous scroll-driven camera flight through connected cinematic scenes. Preserve its existing MIT license and provenance, its compatible SKILL.md procedure and vanilla JavaScript scrub engine. It is **not** a general Belentani web template or a separate product to be merged into NOIACORE, JUDAS or another brand. Canonical implementation is `skills/scroll-world/` plus agent integration metadata.

## Maximum useful product
Provide a reliable, reusable creation pipeline: intake and brand/story brief, scene continuity plans, still and video source options, seam matching, mobile-native 9:16 render variants, accessibility and reduced-motion fallback, performant scroll scrubbing and safe navigable calls to action. Make outputs portable to static HTML and component frameworks without forcing a rewrite. Asset generation must disclose real credit cost and request approval before paid API calls.

## Delivery priorities
1. **Security and accessibility:** validate config-driven navigation URLs, escape rendered copy safely, guard media inputs, use semantic headings/buttons and keyboard-accessible navigation, honor reduced motion and save-data modes.
2. **Playback correctness:** deterministic segment timeline, clip preloading limits, error fallback to stills, lifecycle cleanup of listeners/Object URLs, seam and crossfade testing, robust orientation changes.
3. **Creation workflow:** validate config schema and assets, cost estimator, dry-run pipeline, deterministic filename outputs, continuity/seam checker and explicit failed-generation recovery.
4. **Performance:** capped blob memory, mobile decoders, lazy request cancellation, image/poster fallback, observability with no hidden tracking.
5. **Packaging and quality:** Node browser-compatible unit tests, Playwright E2E with synthetic clips and reduced-motion assertions, lint/syntax checks and CI that actually runs tests, docs and examples.

## Rules for implementation agents
Read main and live PRs; respect the existing author and license provenance. Never generate media, spend credits or mutate third-party service settings without authorization. Implement one real source change with tests and CI gates rather than just prose. Keep the engine usable via both global `window.mountScrollWorld` and CommonJS import. Preserve original brand/scene content from the caller. No new GitHub repos and no automated merges or deployments while CI is blocked. Keep PRs draft until code is executed and reviewed. If a repo is blocked by infrastructure, report the exact status and rotate to an untouched active historical repo.
