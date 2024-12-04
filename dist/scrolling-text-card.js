class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = '';
    this.speed = 20;
    this.width = '100%'; // 默认宽度
    this.height = '100px'; // 默认高度
    this.title = '滚动通知'; // 默认标题
  }

  // 必须实现 setConfig 方法来接收配置
  setConfig(config) {
    if (!config.text) {
      throw new Error('Missing required "text" configuration');
    }
    if (config.speed && (config.speed <= 0)) {
      throw new Error('Speed must be a positive number');
    }
    this.text = config.text;
    this.speed = config.speed || 20;
    this.title = config.title || "滚动通知";
    this.width = config.width || '100%';  // 设置默认宽度
    this.height = config.height || '100px';  // 设置默认高度
    this.render();
  }

  // 返回当前配置，用于UI编辑
  getConfig() {
    return {
      title: this.title,
      text: this.text,
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
    card.style.overflow = 'hidden';  // 隐藏溢出的内容
    
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

  // 让卡片支持配置面板
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

  // 可视化编辑面板
  static getStubConfig() {
    return { text: '欢迎使用滚动文本卡片', speed: 50, title: '滚动通知', width: '100%', height: '100px' };
  }
}

customElements.define('scrolling-text-card', ScrollingTextCard);




class ScrollingTextCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.config = { ...ScrollingTextCard.getStubConfig() };  // 使用默认配置
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const { text, speed, title, width, height } = this.config;
    
    this.shadowRoot.innerHTML = `
      <div>
        <h3>滚动文本卡片配置</h3>
        <div>
          <label for="title">标题:</label>
          <input type="text" id="title" value="${title}">
        </div>
        <div>
          <label for="text">文本:</label>
          <textarea id="text">${text}</textarea>
        </div>
        <div>
          <label for="speed">滚动速度 (秒):</label>
          <input type="number" id="speed" value="${speed}" min="1">
        </div>
        <div>
          <label for="width">宽度:</label>
          <input type="text" id="width" value="${width}">
        </div>
        <div>
          <label for="height">高度:</label>
          <input type="text" id="height" value="${height}">
        </div>
        <button id="apply-config">应用配置</button>
      </div>
    `;
    
    this.shadowRoot.querySelector('#apply-config').addEventListener('click', () => {
      this.config = {
        title: this.shadowRoot.querySelector('#title').value,
        text: this.shadowRoot.querySelector('#text').value,
        speed: parseInt(this.shadowRoot.querySelector('#speed').value, 10),
        width: this.shadowRoot.querySelector('#width').value,
        height: this.shadowRoot.querySelector('#height').value,
      };
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: this.config,
        bubbles: true,
        composed: true,
      }));
    });
  }
}

customElements.define('scrolling-text-card-editor', ScrollingTextCardEditor);
