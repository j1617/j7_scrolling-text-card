// scrolling-text-card.js
class ScrollingTextCard extends HTMLElement {
    set hass(hass) {
      this._hass = hass;
      this.render();
    }
  
    connectedCallback() {
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  
    render() {
      if (!this._hass) return;
  
      const card = document.createElement('div');
      card.className = 'scrolling-text-card';
  
      const textContainer = document.createElement('div');
      textContainer.className = 'text-container';
      textContainer.innerHTML = this.innerHTML = this.getAttribute('text') || '';
  
      const style = document.createElement('style');
      style.textContent = `
        .scrolling-text-card {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          box-sizing: border-box;
          font-size: 16px; /* Adjust as needed */
          padding: 10px; /* Adjust as needed */
          background-color: var(--card-background-color, #ffffff);
          border: 1px solid var(--ha-card-border-color, rgba(0,0,0,0.1));
          border-radius: var(--ha-card-border-radius, 4px);
        }
        .text-container {
          display: inline-block;
          padding-left: 100%; /* Starts off-screen */
          animation: scroll 10s linear infinite; /* Adjust duration and timing function as needed */
        }
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `;
  
      card.appendChild(style);
      card.appendChild(textContainer);
      this.shadowRoot.appendChild(card);
    }
  
    static get observedAttributes() {
      return ['text'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'text') {
        this.render();
      }
    }
  }
  
  customElements.define('custom-scrolling-text-card', ScrollingTextCard);
  