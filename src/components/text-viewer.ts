import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('text-viewer')
export class TextViewer extends LitElement {
  @property({
    attribute: false
  }) text: string = '';

  static styles = css`
    .wrapper {
      overflow: auto;
      height: 100%;
      padding: .5em;
      box-sizing: border-box;
    }

    .inlinecode {
      font-family: monospace;
      background-color: lightpink;
      color: maroon;
      padding: 0 .5em;
      border-radius: 5px;
      user-select: all;
    }

    .codeblock {
      background-color: #333;
      color: chartreuse;
      display: block;
      padding: 1em;
      border-radius: 5px;
      box-sizing: border-box;
      white-space: pre;
      overflow: auto;
      width: 100%;
    }
  `;

  private static parse (text: string) {
    const code = /(```\n[\S,\s]*?```)/;
    const sections = text.split(code);
    let parsed: TemplateResult[] = [];
    
    sections.forEach(block => {
      if (code.test(block)) {
        const isCode = code.exec(block)!;

        parsed.push(html`<code class="codeblock">${ isCode[1].slice(4, -4) }</code>`);
      } else if (block.trim() !== '') {
        parsed = parsed.concat(this.parseBlockElements(block));
      }
    });

    return parsed;
  }

  private static parseBlockElements (text: string) {
    const sections = text.split('\n\n');
    const h1 = /#\s(.+)/;
    const h2 = /##\s(.+)/;
    const h3 = /###\s(.+)/;
    const p = /([^\n](?:[^\n]|\n[^\n]+)+)/;
    const ul = /^(\s*\*[^\S\n][^\n]+(\n?[^\n]+)*)/;
    const ol = /^(\s*\+[^\S\n][^\n]+(\n?[^\n]+)*)/;
    const parsed: TemplateResult[] = [];

    sections.forEach(block => {
      if (block.trim() === '---') {
        parsed.push(html`<hr/>`);
      } else if (h3.test(block)) {
        const isH3 = h3.exec(block)!;
        parsed.push(html`<h3>${isH3[1]}</h3>`);
      } else if (h2.test(block)) {
        const isH2 = h2.exec(block)!;
        parsed.push(html`<h2>${isH2[1]}</h2>`);
      } else if (h1.test(block)) {
        const isH1 = h1.exec(block)!;
        parsed.push(html`<h1>${isH1[1]}</h1>`);
      } else if (ol.test(block)) {
        const isOL = ol.exec(block)!;
        parsed.push(html`<ol>${this.parseListElements(isOL[1]) }</ol>`);
      } else if (ul.test(block)) {
        const isUL = ul.exec(block)!;
        parsed.push(html`<ul>${this.parseListElements(isUL[1]) }</ul>`);
      } else if (p.test(block)) {
        const isP = p.exec(block)!;
        parsed.push(
          html`<p>
            ${this.parseInlineElements(isP[1])}
          </p>`
        );
      }
    });

    return parsed;
  }


  private static parseListElements (text: string) {
    const parts = text.match(/(\*|\+)[^\S\n]([^\n]+(?:\n(?![^\S]*\1[^\S\n])[^\n]+(?=\S|\n))*)/g);
    if (parts !== null) {
      return parts.map((item, i) => {
        return html`<li>${this.parseInlineElements(item.slice(2))}</li>`;
      })
    } else {
      // should not be reachable, but who knows?
      return this.parseInlineElements(text);
    }
  }

  private static parseInlineElements (text: string) {
    const inlines = /(https?:\/\/[^\s]+|!?\[[^\]]+\]\([^\)]+\)|_.+?_|\*\*.+?\*\*|\n|\r)/
    const br = /\n|\r/
    const strong = /\*\*(.+?)\*\*/
    const em = /_(.+?)_/
    const a = /(https?:\/\/[^\s]+)|\[([^\]]+)\]\(([^\)"]+)(\s+"[^\)"]+")?\)/;
    const img = /!\[([^\]]+)\]\(([^\)"]+)(\s+"[^\)"]+")?\)/;
    const strike = /~~(.+?)~~/
    const mono = /`(.+?)`/
    const sections = text.split(inlines)
    const parsed: TemplateResult[] = [];

    sections.forEach((block) => {
      if (br.test(block)) {
        parsed.push(html`<br />`);
      } else if (img.test(block)) {
        const isIMG = img.exec(block)!;
        const src = isIMG[2];
        const alt = isIMG[1] || '';
        const title = isIMG[3]?.trim().slice(1, -1);
        console.log(isIMG)
        parsed.push(html`<img src=${src} alt=${alt} title=${title} />`);
      } else if (mono.test(block)) {
        const isMONO = mono.exec(block)!;
        parsed.push(html`<code class="inlinecode">${isMONO[1]}</code>`);
      } else if (strike.test(block)) {
        const isSTRIKE = strike.exec(block)!;
        parsed.push(html`<s>${isSTRIKE[1]}</s>`);
      } else if (strong.test(block)) {
        const isSTRONG = strong.exec(block)!;
        parsed.push(html`<strong>${isSTRONG[1]}</strong>`);
      } else if (em.test(block)) {
        const isEM = em.exec(block)!;
        parsed.push(html`<em>${ isEM[1] }</em>`)
      } else if (a.test(block)) {
        const isA = a.exec(block)!;
        const href = isA[1] || isA[3];
        const label = isA[2] || href;
        const title = isA[4]?.trim().slice(1, -1);
        parsed.push(html`<a href=${href} title=${title}>${label}</a>`);
      } else {
        parsed.push(html`${block}`);
      }
    })
    return parsed
  }

  protected render() {
    const content = TextViewer.parse(this.text);
    return html`
      <div class="wrapper">${content}</div>
    `;
  }
}