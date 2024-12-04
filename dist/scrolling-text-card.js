class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = '';
    this.speed = 20;
    this.width = '100%'; // 默认宽度
    this.height = '100px'; // 默认高度
    this.title = '滚动通知'; // 默认标题
    this.fontSize = '16px'; // 默认字体大小
    this.color = '#000000'; // 默认字体颜色
    this.hass = null; // 添加对 hass 对象的支持
    // 清除所有预设属性
    this.removeAttribute('text');
    this.removeAttribute('speed');
    this.removeAttribute('width');
    this.removeAttribute('height');
    this.removeAttribute('title');
    this.removeAttribute('font-size');
    this.removeAttribute('color');
  }

  // 接收 hass 对象
  set hass(hass) {
    this.hass = hass;
    if (this.config) {
      this.setConfig(this.config); // 重新设置配置以更新文本
    }
  }

  // 必须实现 setConfig 方法来接收配置
  setConfig(config) {
    if (!config.text && !config.entity) {
      throw new Error('Missing required "text" or "entity" configuration');
    }
    if (config.speed && (config.speed <= 0)) {
      throw new Error('Speed must be a positive number');
    }
    if (config.width && (config.width <= 0)) {
      throw new Error('Width must be a positive number');
    }

    // 获取实体状态
    const entityId = config.entity;
    if (entityId && this.hass) {
      const stateObj = this.hass.states[entityId];
      if (stateObj) {
        config.text = stateObj.state;
      } else {
        console.error(`Entity ${entityId} not found`);
      }
    }

    this.text = config.text;
    this.speed = config.speed || 20;
    this.title = config.title || "滚动通知";
    this.width = config.width || '100%';  // 设置默认宽度
    this.height = config.height || '100px';  // 设置默认高度
    this.fontSize = config.fontSize || '16px';  // 设置默认字体大小
    this.color = config.color || '#000000';  // 设置默认字体颜色
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
      fontSize: this.fontSize,
      color: this.color,
    };
  }

  // 渲染卡片内容
  render() {
    const card = document.createElement('ha-card');
    card.header = this.title;

    const cardContent = document.createElement('div');
    cardContent.className = 'scrolling-container';
    cardContent.textContent = this.text;
    cardContent.style.fontSize = this.fontSize;  // 应用字体大小
    cardContent.style.color = this.color;  // 应用字体颜色

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
    return { text: '欢迎使用滚动文本卡片', speed: 20, title: '滚动通知', width: '100%', height: '100px', fontSize: '16px', color: '#000000' };
  }

  // 监听状态变化事件
  connectedCallback() {
    if (this.hass) {
      this.hass.connection.subscribeStates((state) => {
        if (state.entity_id === this.config.entity) {
          this.setConfig({ ...this.config, text: state.state });
        }
      });
    }
  }
}

customElements.define('scrolling-text-card', ScrollingTextCard);


class ScrollingTextCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // 确保 shadowRoot 被正确初始化
    this._config = {};
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this._config = config;
    this.render();
  }

  render() {
    if (!this.shadowRoot) {
      console.error('shadowRoot is not defined');
      return;
    }

    const card = document.createElement('ha-card');
    card.header = '编辑滚动文本卡片';

    const cardContent = document.createElement('div');
    cardContent.innerHTML = `
      <div>
        <label for="title">标题:</label>
        <input type="text" id="title" value="${this._config.title || ''}">
      </div>
      <div>
        <label for="text">文本:</label>
        <input type="text" id="text" value="${this._config.text || ''}">
      </div>
      <div>
        <label for="speed">速度 (秒):</label>
        <input type="number" id="speed" value="${this._config.speed || 20}">
      </div>
      <div>
        <label for="width">宽度:</label>
        <input type="text" id="width" value="${this._config.width || '100%'}">
      </div>
      <div>
        <label for="height">高度:</label>
        <input type="text" id="height" value="${this._config.height || '100px'}">
      </div>
      <div>
        <label for="fontSize">字体大小:</label>
        <input type="text" id="fontSize" value="${this._config.fontSize || '16px'}">
      </div>
      <div>
        <label for="color">字体颜色:</label>
        <input type="color" id="color" value="${this._config.color || '#000000'}">
      </div>
      <button id="save">保存</button>
    `;

    const saveButton = cardContent.querySelector('#save');
    saveButton.addEventListener('click', () => {
      const newConfig = {
        title: cardContent.querySelector('#title').value,
        text: cardContent.querySelector('#text').value,
        speed: parseFloat(cardContent.querySelector('#speed').value),
        width: cardContent.querySelector('#width').value,
        height: cardContent.querySelector('#height').value,
        fontSize: cardContent.querySelector('#fontSize').value,
        color: cardContent.querySelector('#color').value,
      };
      this.dispatchEvent(new CustomEvent('config-changed', { detail: newConfig }));
    });

    card.appendChild(cardContent);
    this.shadowRoot.innerHTML = ''; // 清空 shadowRoot 内容
    this.shadowRoot.appendChild(card);
  }
}

customElements.define('scrolling-text-card-editor', ScrollingTextCardEditor);
