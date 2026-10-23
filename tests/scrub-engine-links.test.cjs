const { test } = require('node:test');
const assert = require('node:assert/strict');
const { safeLinkHref } = require('../skills/scroll-world/references/scrub-engine.js');

test('blocks executable and sensitive URL schemes in generated brand/CTA links', () => {
  for (const input of [
    'javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,hello',
    'vbscript:msgbox(1)', 'file:///etc/passwd', 'blob:https://example.test/1',
    ' //evil.example', 'https://example.test/\nalert(1)', 'java\tscript:alert(1)',
    'mailto:test@example.com\r\nBCC:other@example.com', null, undefined, '',
  ]) assert.equal(safeLinkHref(input), '#', String(input));
});

test('accepts normal links without silently changing their destinations', () => {
  for (const href of ['#top', '#finale', '/contact', './about', '../work', '?ref=home',
    'contact', 'https://example.com/page', 'http://example.com', 'mailto:hi@example.com', 'tel:+34999999999',
  ]) assert.equal(safeLinkHref(href), href);
});

test('rejects malformed absolute URLs and protocol-relative redirects', () => {
  assert.equal(safeLinkHref('https://'), '#');
  assert.equal(safeLinkHref('//evil.example'), '#');
  assert.equal(safeLinkHref('unknown:payload'), '#');
});
