// scrolling_text_card.js
class ScrollingTextCard extends HTMLElement {
  setConfig(config) {
    if (!config.text || !config.speed) {
      throw new Error('Text and speed are required');
    }
    this.config = config;
  }

  getCardSize() {
    return 1;
  }

  connectedCallback() {
    this.innerHTML = `
      <ha-card>
        <div class="scrolling-text">${this.config.text}</div>
      </ha-card>
    `;
    this.style.display = 'block';

    const textElement = this.querySelector('.scrolling-text');
    textElement.style.animationDuration = `${this.config.speed}s`;
  }

  static get styles() {
    return `
      ha-card {
        padding: 16px;
        overflow: hidden;
      }
      .scrolling-text {
        white-space: nowrap;
        overflow: hidden;
        animation: scroll-left linear infinite;
      }
      @keyframes scroll-left {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `;
  }
}

customElements.define('scolling-text-card', ScrollingTextCard);
