class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = '';
    this.speed = 100;
  }

  // 必须实现 setConfig 方法来接收配置
  setConfig(config) {
    if (!config.scrolling_text) {
      throw new Error('Missing required "scrolling_text" configuration');
    }
    this.text = config.scrolling_text;
    this.speed = config.speed || 100;
    this.title = config.title || "滚动通知";
    this.render();
  }

  // 渲染卡片内容
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

  // 设置滚动效果
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
