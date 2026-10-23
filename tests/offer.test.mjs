import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { checkoutLink, validateOffer } from '../app.js';

test('carries campaign attribution without replacing checkout offer identifiers', () => {
  const url = new URL(checkoutLink('https://pay.example.com/manual?off=manual&checkoutMode=10', '?utm_source=facebook&utm_campaign=launch&fbclid=abc&off=other&checkoutMode=0&redirect=evil'));
  assert.equal(url.searchParams.get('off'), 'manual');
  assert.equal(url.searchParams.get('checkoutMode'), '10');
  assert.equal(url.searchParams.get('utm_source'), 'facebook');
  assert.equal(url.searchParams.get('fbclid'), 'abc');
  assert.equal(url.searchParams.has('redirect'), false);
});

test('rejects unsafe checkout URLs and incomplete live offers', () => {
  for (const url of ['javascript:alert(1)', 'http://pay.example.com', 'not a URL']) assert.throws(() => checkoutLink(url));
  for (const price of [null, -1, 0, '9.90']) assert.throws(() => validateOffer({ checkoutUrl: 'https://pay.example.com', price, currency: 'USD', manualLanguage: 'Spanish' }));
  assert.throws(() => validateOffer({ checkoutUrl: '', price: null, currency: 'USD', manualLanguage: 'English' }));
});

test('the committed offer remains prelaunch until real checkout details are provided', async () => {
  const offer = validateOffer(JSON.parse(await readFile(new URL('../offer.json', import.meta.url), 'utf8')));
  assert.equal(offer.checkoutUrl, '');
  assert.equal(offer.price, null);
  assert.equal(offer.manualLanguage, 'Spanish');
});
