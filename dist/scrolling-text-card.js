class ScrollingTextCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.text = '';
    this.speed = 100;
    this.width = '100%'; // Ĭ�Ͽ��
    this.height = '100px'; // Ĭ�ϸ߶�
  }

  // ����ʵ�� setConfig ��������������
  setConfig(config) {
    if (!config.scrolling_text) {
      throw new Error('Missing required "scrolling_text" configuration');
    }
    this.text = config.scrolling_text;
    this.speed = config.speed || 100;
    this.title = config.title || "����֪ͨ";
    this.width = config.width || '100%';  // ����Ĭ�Ͽ��
    this.height = config.height || '100px';  // ����Ĭ�ϸ߶�
    this.render();
  }

  // ���ص�ǰ���ã�����UI�༭
  getConfig() {
    return {
      title: this.title,
      scrolling_text: this.text,
      speed: this.speed,
      width: this.width,
      height: this.height,
    };
  }

  // ��Ⱦ��Ƭ����
  render() {
    const card = document.createElement('ha-card');
    card.header = this.title;
    
    const cardContent = document.createElement('div');
    cardContent.className = 'scrolling-container';
    cardContent.textContent = this.text;

    card.style.width = this.width;  // ���ÿ�Ƭ�Ŀ��
    card.style.height = this.height;  // ���ÿ�Ƭ�ĸ߶�
    
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

  // �ÿ�Ƭ֧���������
  static getConfigElement() {
    const element = document.createElement('scrolling-text-card-editor');
    return element;
  }

  // ���ӻ��༭���
  static getStubConfig() {
    return { scrolling_text: '', speed: 100, title: '����֪ͨ', width: '100%', height: '100px' };
  }
}

customElements.define('scrolling-text-card', ScrollingTextCard);

// ��Ƭ���ñ༭��
class ScrollingTextCardEditor extends HTMLElement {
  constructor() {
    super();
    this.config = {};
  }

  // ���û�����������ʱ
  setConfig(config) {
    this.config = config;
    this.render();
  }

  // ��Ⱦ�������
  render() {
    this.innerHTML = `
      <style>
        ha-textfield, ha-input-number, ha-input-date {
          width: 100%;
          margin-bottom: 16px;
        }
      </style>
      <div>
        <ha-textfield label="�����ı�" value="${this.config.scrolling_text || ''}" 
                      @input="${e => this.config.scrolling_text = e.target.value}"></ha-textfield>
        <ha-textfield label="��Ƭ����" value="${this.config.title || '����֪ͨ'}"
                      @input="${e => this.config.title = e.target.value}"></ha-textfield>
        <ha-input-number label="�����ٶ�" value="${this.config.speed || 100}" 
                         min="1" max="1000" step="1"
                         @input="${e => this.config.speed = e.target.value}"></ha-input-number>
        <ha-textfield label="��Ƭ���" value="${this.config.width || '100%'}"
                      @input="${e => this.config.width = e.target.value}"></ha-textfield>
        <ha-textfield label="��Ƭ�߶�" value="${this.config.height || '100px'}"
                      @input="${e => this.config.height = e.target.value}"></ha-textfield>
      </div>
    `;
  }

  // ���ظ��º������
  getConfig() {
    return this.config;
  }
}

customElements.define('scrolling-text-card-editor', ScrollingTextCardEditor);
