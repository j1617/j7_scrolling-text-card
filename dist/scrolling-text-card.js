class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = '';
    this.speed = 20;
    this.width = '100%'; // 默认宽度
    this.height = '100px'; // 默认高度
    this.title = "滚动通知";
    this.previewElement = null; // 预览窗口
  }

  setConfig(config) {
    if (!config.text) {
      throw new Error('Missing required "text" configuration');
    }
    this.text = config.text;
    this.speed = config.speed || 20;
    this.title = config.title || "滚动通知";
    this.width = config.width || '100%';  // 设置默认宽度
    this.height = config.height || '100px';  // 设置默认高度
    this.render();
    this.updatePreview(); // 每次配置更改后更新预览
  }

  getConfig() {
    return {
      title: this.title,
      text: this.text,
      speed: this.speed,
      width: this.width,
      height: this.height,
    };
  }

  render() {
    const card = document.createElement('ha-card');
    card.header = this.title;

    const cardContent = document.createElement('div');
    cardContent.className = 'scrolling-container';
    cardContent.textContent = this.text;

    card.style.width = this.width;  // 设置卡片的宽度
    card.style.height = this.height;  // 设置卡片的高度
    card.style.overflow = 'hidden';  // 隐藏溢出的内容

    card.appendChild(cardContent);
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(card);

    this.styleScroll();
  }

  styleScroll() {
    const style = document.createElement('style');
    style.textContent = `
      .scrolling-container {
        display: inline-block;
        white-space: nowrap;
        position: absolute;
        left: 100%; /* 初始位置在卡片右侧 */
        top: 50%;
        transform: translateY(-50%);
        animation: scrollText ${this.speed}s linear infinite;
        width: fit-content; /* 宽度自适应内容 */
        max-width: 100%; /* 最大宽度不超过卡片宽度 */
      }

      @keyframes scrollText {
        0% {
          left: 100%; /* 初始位置在卡片右侧 */
        }
        100% {
          left: -100%; /* 结束位置在卡片左侧 */
        }
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  // 添加预览窗口更新逻辑
  updatePreview() {
    if (this.previewElement) {
      this.previewElement.innerHTML = '';
      const previewCard = document.createElement('ha-card');
      previewCard.header = this.title;

      const previewContent = document.createElement('div');
      previewContent.className = 'scrolling-container';
      previewContent.textContent = this.text;

      previewCard.style.width = this.width;
      previewCard.style.height = this.height;
      previewCard.style.overflow = 'hidden';

      previewCard.appendChild(previewContent);
      this.previewElement.appendChild(previewCard);
      
      // 使用与卡片相同的样式
      const previewStyle = document.createElement('style');
      previewStyle.textContent = `
        .scrolling-container {
          display: inline-block;
          white-space: nowrap;
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          animation: scrollText ${this.speed}s linear infinite;
          width: fit-content;
          max-width: 100%;
        }

        @keyframes scrollText {
          0% { left: 100%; }
          100% { left: -100%; }
        }
      `;
      this.previewElement.appendChild(previewStyle);
    }
  }

  // 设置预览窗口
  setPreviewElement(previewElement) {
    this.previewElement = previewElement;
    this.updatePreview();
  }

  static getConfigElement() {
    const element = document.createElement('scrolling-text-card-editor');
    element.addEventListener('config-changed', (event) => {
      const config = event.detail;
      customElements.whenDefined('scrolling-text-card').then(() => {
        const card = document.querySelector('scrolling-text-card');
        if (card) {
          card.setConfig(config);
        }
      });
    });
    return element;
  }

  static getStubConfig() {
    return { text: '欢迎使用滚动文本卡片', speed: 50, title: '滚动通知', width: '100%', height: '100px' };
  }
}

// 定义自定义元素
customElements.define('scrolling-text-card', ScrollingTextCard);
