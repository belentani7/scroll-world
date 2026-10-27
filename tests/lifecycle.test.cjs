"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { mountScrollWorld } = require("../skills/scroll-world/references/scrub-engine.js");

function harness() {
  const listeners = new Map(), frames = new Map(), requests = [], revoked = [], created = [];
  let nextFrame = 0;
  class Element {
    constructor(tag) {
      this.tag = tag;
      this.children = [];
      this.parentNode = null;
      this.style = { setProperty() {} };
      this.classList = { add() {}, remove() {}, toggle() {} };
      this.attrs = {};
    }
    appendChild(node) { node.parentNode = this; this.children.push(node); return node; }
    remove() {
      if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(n => n !== this);
      this.parentNode = null;
    }
    setAttribute(key, value) { this.attrs[key] = value; }
    removeAttribute(key) { delete this.attrs[key]; }
    addEventListener() {}
    pause() { this.paused = true; }
    load() { this.reloaded = true; }
    querySelectorAll(selector) {
      const found = [];
      const walk = node => {
        for (const child of node.children) {
          if ((child.className || "").split(" ").includes(selector.slice(1))) found.push(child);
          walk(child);
        }
      };
      walk(this);
      return found;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  }
  const head = new Element("head");
  const document = {
    head,
    createElement: tag => new Element(tag),
    getElementById: id => head.children.find(child => child.id === id) || null,
  };
  const window = {
    innerWidth: 1280, innerHeight: 800, scrollY: 0, pageYOffset: 0,
    matchMedia: () => ({ matches: false }), scrollTo() {},
    addEventListener(name, fn) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(fn);
    },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
  };
  const fetch = (url, { signal }) => new Promise((resolve, reject) => {
    requests.push({ url, signal, resolve, reject });
    signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
  });
  const url = {
    createObjectURL() { const value = "blob:test-" + (created.length + 1); created.push(value); return value; },
    revokeObjectURL(value) { revoked.push(value); },
  };
  const requestAnimationFrame = fn => { const id = ++nextFrame; frames.set(id, fn); return id; };
  const cancelAnimationFrame = id => frames.delete(id);
  const originals = {};
  for (const key of ["window", "document", "fetch", "URL", "requestAnimationFrame", "cancelAnimationFrame"]) {
    originals[key] = globalThis[key];
  }
  Object.assign(globalThis, { window, document, fetch, URL: url, requestAnimationFrame, cancelAnimationFrame });
  return {
    container: new Element("main"), listeners, frames, requests, created, revoked,
    restore() { Object.assign(globalThis, originals); },
  };
}

test("unmount aborts in-flight media and removes global handlers and frames", async () => {
  const h = harness();
  try {
    const section = { id: "one", label: "One", title: "One", still: "one.webp", clip: "one.mp4" };
    const handle = mountScrollWorld(h.container, { sections: [section], atmosphere: false });
    assert.equal(typeof handle.destroy, "function");
    assert.equal(h.requests.length, 1);
    assert.equal(h.frames.size, 1);
    assert.equal(h.listeners.get("scroll").size, 1);
    handle.destroy();
    handle.destroy();
    assert.equal(h.requests[0].signal.aborted, true);
    assert.equal(h.frames.size, 0);
    for (const name of ["scroll", "resize", "load", "orientationchange", "pointerdown", "touchstart"]) {
      assert.equal(h.listeners.get(name).size, 0, name);
    }
    assert.equal(h.container.children.length, 0);
    assert.equal(section._seg, undefined);
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(h.created.length, 0, "aborted fetch must not create a blob URL");
  } finally { h.restore(); }
});

test("unmount revokes loaded video URLs and releases decoder", async () => {
  const h = harness();
  try {
    const handle = mountScrollWorld(h.container, {
      sections: [{ id: "one", title: "One", still: "one.webp", clip: "one.mp4" }],
      atmosphere: false,
    });
    assert.equal(h.requests.length, 1);
    h.requests[0].resolve({ ok: true, blob: async () => ({}) });
    for (let i = 0; i < 6; i++) await Promise.resolve();
    assert.deepEqual(h.created, ["blob:test-1"]);
    handle.destroy();
    assert.deepEqual(h.revoked, ["blob:test-1"]);
    assert.equal(h.container.children.length, 0);
  } finally { h.restore(); }
});
