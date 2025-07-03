import { LitElement, html, css } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import './components/collapsible-column.js';
import './components/text-editor.js';
import './components/text-viewer.js';
import { TextEditor } from './components/text-editor.js';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

@customElement('app-root')
export class AppRoot extends LitElement {
  @property({ type: String }) header = 'My app';

  @state() private _text: string = '';

  static styles = css`
    main {
      height: 100vh;
      width: 100vw;
      padding: 1em;
      display: flex;
      background-color: aliceblue;
      gap: 1em;
      box-sizing: border-box;
    }

    main .col-editor, main .col-viewer {
      display: block;
      height: 100%;
      flex: 1 1 50%;
    }

    main .col-editor[collapsed], main .col-viewer[collapsed] {
      flex: 0 0 auto;
    }

    main .editor, main .viewer {
      height: 100%;
      width: 100%;
    }
  `;

  private _handleInput(e: InputEvent) {
    this._text = (e.target as TextEditor).value;
  }

  render() {
    return html`
      <main>
        <collapsible-column class="col-editor">
          <text-editor class="editor" @input=${this._handleInput}></text-editor>
        </collapsible-column>

        <collapsible-column class="col-viewer">
          <text-viewer class="viewer" .text=${this._text}></text-viewer>
        </collapsible-column>
      </main>
    `
  }
}
