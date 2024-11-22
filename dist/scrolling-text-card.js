class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = '';
    this.speed = 20;
    this.width = '100%'; // 默认宽度
    this.height = '100px'; // 默认高度
    this.title = "滚动通知";
  }

  // 必须实现 setConfig 方法来接收配置
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
        top: 70%;
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

// 创建配置面板（编辑器）
class ScrollingTextCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const div = document.createElement('div');

    // 标题输入框
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = '卡片标题';
    titleInput.value = this.config?.title || '滚动通知';
    titleInput.addEventListener('input', () => {
      this.config.title = titleInput.value;
      this.updateConfig();
    });

    // 文本输入框
    const textInput = document.createElement('textarea');
    textInput.placeholder = '请输入滚动文本';
    textInput.value = this.config?.text || '欢迎使用滚动文本卡片';
    textInput.addEventListener('input', () => {
      this.config.text = textInput.value;
      this.updateConfig();
    });

    // 速度输入框
    const speedInput = document.createElement('input');
    speedInput.type = 'number';
    speedInput.value = this.config?.speed || 50;
    speedInput.addEventListener('input', () => {
      this.config.speed = parseInt(speedInput.value, 10);
      this.updateConfig();
    });

    // 宽度输入框
    const widthInput = document.createElement('input');
    widthInput.type = 'text';
    widthInput.value = this.config?.width || '100%';
    widthInput.addEventListener('input', () => {
      this.config.width = widthInput.value;
      this.updateConfig();
    });

    // 高度输入框
    const heightInput = document.createElement('input');
    heightInput.type = 'text';
    heightInput.value = this.config?.height || '100px';
    heightInput.addEventListener('input', () => {
      this.config.height = heightInput.value;
      this.updateConfig();
    });

    // 预览区域
    const previewDiv = document.createElement('div');
    previewDiv.className = 'preview';
    previewDiv.style.border = '1px solid #ccc';
    previewDiv.style.padding = '10px';
    previewDiv.style.marginTop = '10px';

    this.updatePreview(previewDiv);

    // 配置更新事件
    this.config = this.config || ScrollingTextCard.getStubConfig();

    div.appendChild(titleInput);
    div.appendChild(textInput);
    div.appendChild(speedInput);
    div.appendChild(widthInput);
    div.appendChild(heightInput);
    div.appendChild(previewDiv);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(div);
  }

  // 发送配置变化的事件
  updateConfig() {
    const event = new CustomEvent('config-changed', {
      detail: this.config,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
    this.updatePreview(this.shadowRoot.querySelector('.preview'));
  }

  // 更新预览区域的内容和样式
  updatePreview(previewDiv) {
    const card = document.createElement('ha-card');
    card.header = this.config.title;

    const cardContent = document.createElement('div');
    cardContent.className = 'scrolling-container';
    cardContent.textContent = this.config.text;

    card.style.width = this.config.width;
    card.style.height = this.config.height;
    card.style.overflow = 'hidden';

    card.appendChild(cardContent);
    previewDiv.innerHTML = '';
    previewDiv.appendChild(card);

    const style = document.createElement('style');
    style.textContent = `
      .scrolling-container {
        display: inline-block;
        white-space: nowrap;
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        animation: scrollText ${this.config.speed}s linear infinite;
        width: fit-content;
        max-width: 100%;
      }
      @keyframes scrollText {
        0% {
          left: 100%;
        }
        100% {
          left: -100%;
        }
      }
    `;
    previewDiv.appendChild(style);
  }
}
customElements.define('scrolling-text-card-editor', ScrollingTextCardEditor);
