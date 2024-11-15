class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = this.getAttribute('scrolling_text') || '滚动文本';
    this.speed = parseInt(this.getAttribute('speed'), 10) || 100;
  }

  connectedCallback() {
    const card = document.createElement('ha-card');
    card.header = this.getAttribute('title') || '滚动通知';
    const cardContent = document.createElement('div');
    cardContent.className = 'scrolling-container';
    cardContent.textContent = this.text;

    card.appendChild(cardContent);
    this.shadowRoot.appendChild(card);
    this.styleScroll();
  }

  styleScroll() {
    const style = document.createElement('style');
    style.textContent = `
      .scrolling-container {
        white-space: nowrap;
        overflow: hidden;
        box-sizing: border-box;
        display: inline-block;
        width: 100%;
        animation: scrollText ${this.speed}s linear infinite;
      }

      @keyframes scrollText {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `;
    this.shadowRoot.appendChild(style);
  }
}

customElements.define('scrolling-text-card', ScrollingTextCard);
