import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import type { AppRoot } from '../src/app-root.js';
import '../src/app-root.js';

describe('AppRoot', () => {
  let element: AppRoot;
  beforeEach(async () => {
    element = await fixture(html`<app-root></app-root>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
