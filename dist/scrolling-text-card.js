class ScrollingTextCard extends HTMLElement {
  setConfig(config) {
    if (!config.text) {
      throw new Error('The scrolling-text-card requires the "text" configuration.');
    }

    this.textContent = config.text;
    this.speed = config.speed || 2; // Default speed
    this.style.overflow = 'hidden';
    this.style.whiteSpace = 'nowrap';
    this.style.boxSizing = 'border-box';
    this.style.width = '100%';
    this.style.position = 'relative';

    this.innerContainer = document.createElement('div');
    this.innerContainer.style.display = 'inline-block';
    this.innerContainer.style.paddingLeft = '100%';
    this.innerContainer.style.animation = `scrollText ${this.speed}s linear infinite`;
    this.appendChild(this.innerContainer);

    const textNode = document.createTextNode(this.textContent);
    this.innerContainer.appendChild(textNode.cloneNode(true));
    this.innerContainer.appendChild(document.createElement('br')); // Add line break for wrapping
    this.innerContainer.appendChild(textNode); // Duplicate text for seamless scroll
  }

  getCardSize() {
    return { height: 40, width: 300 }; // Adjust size as needed
  }

  static get styles() {
    return `
      @keyframes scrollText {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `;
  }
}

customElements.define('j7_scrolling-text-card', ScrollingTextCard);