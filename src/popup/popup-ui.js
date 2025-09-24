// Popup UI Management
export class PopupUI {
  constructor() {
    this.resultDiv = document.getElementById('result');
    this.activeSitesSpan = document.getElementById('active-sites');
  }

  async updateActiveSites() {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        if (tabs[0]) {
          const url = new URL(tabs[0].url);
          const domain = url.hostname;
          if (this.activeSitesSpan) {
            this.activeSitesSpan.textContent = domain;
          }
        }
      }
    } catch (error) {
      console.error('Failed to get active tab:', error);
      if (this.activeSitesSpan) {
        this.activeSitesSpan.textContent = 'Unknown';
      }
    }
  }

  showResult(content, type = 'info') {
    if (this.resultDiv) {
      const className = type === 'success' ? 'success' : 
                      type === 'error' ? 'error' : 
                      type === 'loading' ? 'loading' : '';
      
      this.resultDiv.innerHTML = `<span class="${className}">${content}</span>`;
    }
  }

  appendResult(content) {
    if (this.resultDiv) {
      this.resultDiv.innerHTML += content;
    }
  }

  showInitialMessage() {
    this.showResult('<span style="opacity: 0.7;">Click buttons above to test LexiPen functionality</span>');
  }

  showLoading(message) {
    this.showResult(`🔍 ${message}`, 'loading');
  }

  showSuccess(message) {
    this.showResult(`✅ ${message}`, 'success');
  }

  showError(message) {
    this.showResult(`❌ ${message}`, 'error');
  }
}
