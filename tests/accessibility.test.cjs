"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { safeLinkUrl, setCopyInteractivity } = require("../skills/scroll-world/references/scrub-engine.js");

function mockCopy() {
  const attributes = new Map();
  return {
    inert: false,
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name); },
  };
}

test("inactive scene copy is hidden from screen readers and keyboard focus", () => {
  const copy = mockCopy();
  setCopyInteractivity(copy, false);
  assert.equal(copy.inert, true);
  assert.equal(copy.getAttribute("aria-hidden"), "true");
});

test("active scene copy is restored to screen readers and keyboard focus", () => {
  const copy = mockCopy();
  setCopyInteractivity(copy, false);
  setCopyInteractivity(copy, true);
  assert.equal(copy.inert, false);
  assert.equal(copy.getAttribute("aria-hidden"), "false");
});

test("configured CTA links reject backslash normalization and embedded credentials", () => {
  for (const href of [
    "https://example.org\\@evil.example",
    "/\\evil.example",
    "https://user:pass@example.org",
    "http://user@example.org",
  ]) {
    assert.equal(safeLinkUrl(href), "#", href);
  }
  assert.equal(safeLinkUrl("https://example.org/contact"), "https://example.org/contact");
});
