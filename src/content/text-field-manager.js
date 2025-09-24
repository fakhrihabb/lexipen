// Text Field Management
class TextFieldManager {
  constructor() {
    this.textFields = new Set();
    this.currentActiveField = null;
    this.observer = null;
    
    // Event callbacks
    this.onFieldFocus = null;
    this.onFieldBlur = null;
    this.onFieldInput = null;
  }

  async initialize() {
    this.discoverTextFields();
    this.observePageChanges();
  }

  // Discover all text input fields on the page
  discoverTextFields() {
    const selectors = [
      'input[type="text"]',
      'input[type="email"]', 
      'input[type="search"]',
      'input:not([type])',
      'textarea',
      '[contenteditable="true"]',
      '[contenteditable=""]'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isValidTextField(element)) {
          this.textFields.add(element);
          this.setupTextFieldListeners(element);
        }
      });
    });
  }

  // Check if element is a valid text field we want to monitor
  isValidTextField(element) {
    if (element.style.display === 'none') return false;
    if (element.offsetParent === null) return false;
    if (element.type === 'password') return false;
    
    const rect = element.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 20) return false;
    
    return true;
  }

  // Set up event listeners for text field
  setupTextFieldListeners(element) {
    element.addEventListener('focus', () => {
      this.currentActiveField = element;
      if (this.onFieldFocus) {
        this.onFieldFocus(element);
      }
    });
    
    element.addEventListener('blur', () => {
      setTimeout(() => {
        if (this.onFieldBlur) {
          this.onFieldBlur();
        }
      }, 200);
    });
    
    // Listen for text changes
    element.addEventListener('input', () => {
      if (this.currentActiveField === element && this.onFieldInput) {
        this.onFieldInput(element);
      }
    });
  }

  // Get text content from field
  getFieldText(element) {
    return element.value || element.textContent || '';
  }

  // Set text content to field
  setFieldText(element, text) {
    if (element.value !== undefined) {
      element.value = text;
    } else {
      element.textContent = text;
    }
    
    // Trigger input event to notify other scripts
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Watch for dynamically added content
  observePageChanges() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (this.isValidTextField(node)) {
              this.textFields.add(node);
              this.setupTextFieldListeners(node);
            }
            
            const newTextFields = node.querySelectorAll('input, textarea, [contenteditable]');
            newTextFields.forEach(field => {
              if (this.isValidTextField(field)) {
                this.textFields.add(field);
                this.setupTextFieldListeners(field);
              }
            });
          }
        });
      });
    });
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  getCurrentActiveField() {
    return this.currentActiveField;
  }

  getFieldCount() {
    return this.textFields.size;
  }

  hasFieldText(element) {
    return this.getFieldText(element).trim().length > 0;
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
