// Chrome Extension Message Handler
class MessageHandler {
  constructor() {
    this.messageHandlers = new Map();
    this.setupMessageListener();
  }

  setupMessageListener() {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action && this.messageHandlers.has(request.action)) {
          const handler = this.messageHandlers.get(request.action);
          handler(request, sender, sendResponse);
          return true; // Keep the message channel open for async responses
        }
      });
    }
  }

  onMessage(action, handler) {
    this.messageHandlers.set(action, handler);
  }

  sendMessage(action, data = {}) {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action, ...data }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    }
    return Promise.reject(new Error('Chrome runtime not available'));
  }
}
