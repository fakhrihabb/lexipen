// LexiPen Popup Logic
import { PopupUI } from './popup-ui.js';
import { PopupActions } from './popup-actions.js';
import { MessageHandler } from '../shared/message-handler.js';

class LexiPenPopup {
  constructor() {
    this.ui = new PopupUI();
    this.actions = new PopupActions();
    this.messageHandler = new MessageHandler();
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Test detection button
    const testDetectionBtn = document.getElementById('test-detection');
    if (testDetectionBtn) {
      testDetectionBtn.addEventListener('click', () => this.actions.testDetection());
    }

    // Test AI button
    const testAIBtn = document.getElementById('test-ai');
    if (testAIBtn) {
      testAIBtn.addEventListener('click', () => this.actions.testAI());
    }
  }

  async initialize() {
    console.log('🖋️ LexiPen popup loaded');
    
    await this.ui.updateActiveSites();
    this.ui.showInitialMessage();
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const popup = new LexiPenPopup();
  popup.initialize();
});

console.log('🖋️ LexiPen popup script ready');
