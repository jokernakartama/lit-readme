import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref, Ref } from "lit/directives/ref.js";

const DEFAULT_MD = `
# Simple Markdown Viewer

## Headers

# H1 header

## H2 header

### H3 header

Other headers are not supported 😇.

---

## Lists

### Unordered list

* Clause 1
* Clause 2
* Clause 3

### Ordered list

+ Clause 1
+ Clause 2
+ Clause 3

Nested lists are not supported 😇

---

## Text formatting

_Cursive text_
**Strong text**
~~Strikethrough text~~
\`Inline code text\`

---

## Links

[Text link](https://example.com "Link title")
Simple link: https://example.com

---

## Pictures

![Panda](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9gKncUgkVcKEPTV0_32642m7WSWzbFELW_g&s "A picture of a panda")

---

## Code block

\`\`\`
function greet() {
  console.log("Hello World");
}
\`\`\`

Syntax highlighting is not supported 😇.

---

## Horizontal lines

---

## ✅ That's it!

`;

@customElement('text-editor')
export class TextEditor extends LitElement {
  inputRef: Ref<HTMLTextAreaElement> = createRef();

  @property({
    reflect: true,
    type: Boolean,
    attribute: 'collapsed',
    useDefault: false
  })
  public collapsed: boolean = false;

  firstUpdated(): void {
    const inputEvent = new Event('input');
    if (this.inputRef) {
      this.dispatchEvent(inputEvent);
    }
  }

  public value = DEFAULT_MD;

  static styles = css`
    :host {
      height: 100%;
      width: 100%;
      display: block;
    }

    .text-input {
      display: block;
      height: 100%;
      width: 100%;
      resize: none;
      width: 100%;
      box-sizing: border-box;
      padding: 1em;
      font-size: 14px;
    }
  `;

  private _handleInput(e: InputEvent) {
    this.value = (e.target as HTMLTextAreaElement).value;
  }

  protected render() {
    return html`
      <textarea ${ref(this.inputRef)} class="text-input" @input=${this._handleInput}>
        ${DEFAULT_MD}
      </textarea>
    `;
  }
}