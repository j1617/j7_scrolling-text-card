class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = '';
    this.speed = 100;
  }

  // ����ʵ�� setConfig ��������������
  setConfig(config) {
    if (!config.scrolling_text) {
      throw new Error('Missing required "scrolling_text" configuration');
    }
    this.text = config.scrolling_text;
    this.speed = config.speed || 100;
    this.title = config.title || "����֪ͨ";
    this.render();
  }

  // ��Ⱦ��Ƭ����
  render() {
    const card = document.createElement('ha-card');
    card.header = this.title;
    
    const cardContent = document.createElement('div');
    cardContent.className = 'scrolling-container';
    cardContent.textContent = this.text;

    card.appendChild(cardContent);
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(card);

    this.styleScroll();
  }

  // ���ù���Ч��
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
