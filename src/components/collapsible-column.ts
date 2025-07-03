import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('collapsible-column')
export class CollapsibleColumn extends LitElement {
  @property({
    reflect: true,
    type: Boolean,
    attribute: 'collapsed',
    useDefault: false
  })
  public collapsed: boolean = false;
  
  static styles = css`
    :host {
      flex-direction: row;
      padding: 0.5em;
      background-color: white;
      box-sizing: border-box;
      box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .column {
      display: flex;
      height: 100%;
      width: 100%;
      gap: 0.5em;
    }

    .content {
      flex: 1 1 auto;
    }

    :host([collapsed]) .content{
      display: none;
    }

    .toggle-button {
      font-family: sans-serif;
      background-color: #efefef;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      font-weight: bold;
    }

    .button-caption {
      display: inline-block;
      transform: rotate(-90deg);
    }
  `;

  private _toggleCollapsed () {
    this.collapsed = !this.collapsed;
  }

  protected render() {
    return html`
      <div class="column">
        <button class="toggle-button" type="button" @click=${this._toggleCollapsed}>
          <span class="button-caption">${this.collapsed ? 'Show' : 'Hide'}</span>
        </button>

        <section class="content">
          <slot></slot>
        </section>
      </div>
    `
  }
}
