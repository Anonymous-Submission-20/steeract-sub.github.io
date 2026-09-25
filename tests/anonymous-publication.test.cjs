const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('anonymous publication metadata points to the requested project URL', () => {
  assert.match(html, /<meta property="og:url" content="https:\/\/anonymous-submission-20\.github\.io\/steeract-sub\.github\.io\/">/);
  for (const [,href] of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    assert.equal(new URL(href).origin, 'https://anonymous-submission-20.github.io', 'External navigation must stay on the anonymous project host');
  }
});

test('both presentation players retain controls and resolve to local video and poster assets', () => {
  for (const id of ['overview-video', 'method-video']) {
    const section = html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0];
    assert.ok(section, `Missing ${id}`);
    assert.match(section, /<video\s+controls\s+playsinline/);
    for (const [,asset] of section.matchAll(/(?:src|poster)="(assets\/[^"]+)"/g)) {
      assert.ok(fs.existsSync(path.join(root,asset)), `Missing ${asset}`);
    }
  }
});
