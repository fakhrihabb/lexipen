// LexiPen Content Script - Main Entry Point
console.log('🚀 LexiPen content script loaded on:', window.location.hostname);

class LexiPenContentScript {
  constructor() {
    this.isInitialized = false;
    this.textFieldManager = new TextFieldManager();
    this.overlayManager = new OverlayManager();
    this.indicatorManager = new IndicatorManager();
    this.messageHandler = new MessageHandler();
    
    this.setupEventListeners();
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🖋️ Initializing LexiPen...');
    
    // Add styles to the page
    LexiPenStyles.inject();
    
    // Initialize managers
    await this.overlayManager.initialize();
    await this.textFieldManager.initialize();
    
    // Setup text field event handlers
    this.textFieldManager.onFieldFocus = (field) => {
      this.indicatorManager.show(field);
    };
    
    this.textFieldManager.onFieldBlur = () => {
      if (!this.overlayManager.isVisible()) {
        this.indicatorManager.hide();
      }
    };
    
    this.textFieldManager.onFieldInput = (field) => {
      this.indicatorManager.updateForField(field);
    };
    
    // Setup indicator click handler
    this.indicatorManager.onIndicatorClick = () => {
      this.overlayManager.show(this.textFieldManager.getCurrentActiveField());
      this.indicatorManager.hide();
    };
    
    // Setup overlay close handler
    this.overlayManager.onClose = () => {
      this.indicatorManager.hide();
    };
    
    this.isInitialized = true;
    console.log(`✅ LexiPen active - monitoring ${this.textFieldManager.getFieldCount()} text fields`);
  }

  setupEventListeners() {
    // Listen for messages from popup
    this.messageHandler.onMessage('testDetection', (request, sender, sendResponse) => {
      console.log('🧪 Testing LexiPen detection - found', this.textFieldManager.getFieldCount(), 'text fields');
      sendResponse({
        success: true,
        textFields: this.textFieldManager.getFieldCount(),
        url: window.location.href
      });
    });
  }
}

// Initialize LexiPen when page is ready
const lexipen = new LexiPenContentScript();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => lexipen.initialize());
} else {
  lexipen.initialize();
}

console.log('✨ LexiPen content script ready');
