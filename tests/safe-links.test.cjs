"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { safeLinkUrl } = require("../skills/scroll-world/references/scrub-engine.js");

test("allows safe local navigation, HTTPS and contact CTAs", () => {
  for (const href of [
    "#top", "/", "/pricing?plan=basic", "./about", "../assets", "?tab=about",
    "https://example.org/path", "http://example.org",
    "mailto:hello@example.org", "tel:+34900123456",
  ]) {
    assert.equal(safeLinkUrl(href), href);
  }
});

test("does not allow active and foreign schemes", () => {
  for (const href of [
    "javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)", "file:///etc/passwd", "blob:https://example.org/123",
    "ftp://example.org", "http:///not-valid", "//example.org/path",
    "\\\\example.org\\path", "java\nscript:alert(1)", "javascript:\talert(1)",
    "\u0000https://example.org",
  ]) {
    assert.equal(safeLinkUrl(href), "#", href);
  }
});

test("invalid values never become navigation targets", () => {
  for (const value of [undefined, null, false, {}, 42, "", "   "]) {
    assert.equal(safeLinkUrl(value), "#");
  }
});

test("whitespace-trimmed links retain their intended destination", () => {
  assert.equal(safeLinkUrl("  /contact  "), "/contact");
});
