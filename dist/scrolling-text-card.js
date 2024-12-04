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
    if (config.speed === undefined || config.speed <= 0) {
      throw new Error('Speed must be a positive number');
    }
    this.text = config.text;
    this.speed = config.speed || 20;
    this.title = config.title || "滚动通知";
    this.width = config.width || '100%';  // 设置默认宽度
    this.height = config.height || '100px';  // 设置默认高度
    this.render();
  }

    // 蹇呴』瀹炵幇 setConfig 鏂规硶鏉ユ帴鏀堕厤缃�
    setConfig(config) {
      if (!config.text) {
        throw new Error('Missing required "text" configuration');
      }
      if (config.speed && (config.speed <= 0)) {
        throw new Error('Speed must be a positive number');
      }
      this.text = config.text;
      this.speed = config.speed || 20;
      this.title = config.title || "婊氬姩閫氱煡";
      this.width = config.width || '100%';  // 璁剧疆榛樿瀹藉害
      this.height = config.height || '100px';  // 璁剧疆榛樿楂樺害
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
    this.startScrolling(); // 启动滚动
  }
  
  // 设置滚动效果
  styleScroll() {
    const style = document.createElement('style');
    style.textContent = `
      .scrolling-container {
        display: inline-block;
        white-space: nowrap;
        position: absolute;
        left: 0; /* 初始位置在卡片左侧 */
        top: 50%;
        transform: translateY(-50%);
        animation: scrollText ${this.speed}s linear infinite;
        width: fit-content; /* 宽度自适应内容 */
        max-width: 100%; /* 最大宽度不超过卡片宽度 */
      }
  
      @keyframes scrollText {
        0% {
          left: 0; /* 初始位置在卡片左侧 */
        }
        100% {
          left: -100%; /* 结束位置在卡片左侧 */
        }
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  startScrolling() {
    let left = 0;
    const container = this.shadowRoot.querySelector('.scrolling-container');
    const step = 1; // 每帧移动的像素数
    const interval = 1000 / this.speed; // 每秒移动的帧数
  
    const animate = () => {
      left -= step;
      if (left < -container.offsetWidth) {
        left = this.offsetWidth;
      }
      container.style.left = `${left}px`;
      requestAnimationFrame(animate);
    };
  
    animate();
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
        } else {
          console.error('scrolling-text-card element not found');
        }
      });
    });
    return element;
  }

  // 可视化编辑面板
  static getStubConfig() {
    return { text: '欢迎使用滚动文本卡片', speed: 20, title: '滚动通知', width: '100%', height: '100px' };
  }
}

customElements.define('scrolling-text-card', ScrollingTextCard);

class ScrollingTextCardEditor extends HTMLElement {
  constructor() {
    super();
    // 确保这里没有设置任何属性
  }

  static get observedAttributes() {
    return ['config'];
  }
  
  connectedCallback() {
    console.log('Connected callback:', this.getAttribute('config'));
    // 初始化 config
    this.config = this.getAttribute('config') ? JSON.parse(this.getAttribute('config')) : {};
    this.innerHTML = `
      <div>
        <label for="text">Text:</label>
        <input type="text" id="text" value="${this.config.text || ''}" />
        <label for="speed">Speed:</label>
        <input type="number" id="speed" value="${this.config.speed || 0}" />
        <!-- 其他配置项 -->
      </div>
    `;
    // 绑定事件
    this.querySelector('#text').addEventListener('input', this._handleTextChange.bind(this));
    this.querySelector('#speed').addEventListener('input', this._handleSpeedChange.bind(this));
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    if (name === 'config') {
      this.config = JSON.parse(newValue);
      this.render();
    }
  }

  _handleTextChange(event) {
    this.config.text = event.target.value;
    this._dispatchConfigChanged();
  }

  _handleSpeedChange(event) {
    this.config.speed = parseInt(event.target.value, 10);
    this._dispatchConfigChanged();
  }

  _dispatchConfigChanged() {
    this.dispatchEvent(new CustomEvent('config-changed', { detail: this.config }));
  }

  render() {
    if (!this.config) {
      this.config = {};
    }
    this.innerHTML = `
      <div>
        <label for="text">Text:</label>
        <input type="text" id="text" value="${this.config.text || ''}" />
        <label for="speed">Speed:</label>
        <input type="number" id="speed" value="${this.config.speed || 0}" />
        <!-- 其他配置项 -->
      </div>
    `;
  }
}

customElements.define('scrolling-text-card-editor', ScrollingTextCardEditor);