class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = '';
    this.speed = 100;
    this.width = '100%'; // 默认宽度
    this.height = '100px'; // 默认高度
  }

  // 必须实现 setConfig 方法来接收配置
  setConfig(config) {
    if (!config.scrolling_text) {
      throw new Error('Missing required "scrolling_text" configuration');
    }
    this.text = config.scrolling_text;
    this.speed = config.speed || 100;
    this.title = config.title || "滚动通知";
    this.width = config.width || '100%';  // 设置默认宽度
    this.height = config.height || '100px';  // 设置默认高度
    this.render();
  }

  // 返回当前配置，用于UI编辑
  getConfig() {
    return {
      title: this.title,
      scrolling_text: this.text,
      speed: this.speed,
      width: this.width,
      height: this.height,
    };
  }

  // 渲染卡片内容
  render() {
    const card = document.createElement('ha-card');
    card.header = this.title;
    
    const cardContent = document.createElement('div');
    cardContent.className = 'scrolling-container';
    cardContent.textContent = this.text;

    card.style.width = this.width;  // 设置卡片的宽度
    card.style.height = this.height;  // 设置卡片的高度
    
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
        width: 100%;  /* 确保容器宽度为100%，匹配卡片的宽度 */
        height: 100%; /* 确保容器高度为100%，匹配卡片的高度 */
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

  // 让卡片支持配置面板
  static getConfigElement() {
    const element = document.createElement('scrolling-text-card-editor');
    return element;
  }

  // 可视化编辑面板
  static getStubConfig() {
    return { scrolling_text: '', speed: 100, title: '滚动通知', width: '100%', height: '100px' };
  }
}

customElements.define('scrolling-text-card', ScrollingTextCard);

// 卡片配置编辑器
class ScrollingTextCardEditor extends HTMLElement {
  constructor() {
    super();
    this.config = {};
  }

  // 当用户配置面板更新时
  setConfig(config) {
    this.config = config;
    this.render();
  }

  // 渲染配置面板
  render() {
    this.innerHTML = `
      <style>
        ha-textfield, ha-input-number, ha-input-date {
          width: 100%;
          margin-bottom: 16px;
        }
      </style>
      <div>
        <ha-textfield label="滚动文本" value="${this.config.scrolling_text || ''}" 
                      @input="${e => this.config.scrolling_text = e.target.value}"></ha-textfield>
        <ha-textfield label="卡片标题" value="${this.config.title || '滚动通知'}"
                      @input="${e => this.config.title = e.target.value}"></ha-textfield>
        <ha-input-number label="滚动速度" value="${this.config.speed || 100}" 
                         min="1" max="1000" step="1"
                         @input="${e => this.config.speed = e.target.value}"></ha-input-number>
        <ha-textfield label="卡片宽度" value="${this.config.width || '100%'}"
                      @input="${e => this.config.width = e.target.value}"></ha-textfield>
        <ha-textfield label="卡片高度" value="${this.config.height || '100px'}"
                      @input="${e => this.config.height = e.target.value}"></ha-textfield>
      </div>
    `;
  }

  // 返回更新后的配置
  getConfig() {
    return this.config;
  }
}
d
customElements.define('j7_scrolling-text-card', ScrollingTextCardEditor);