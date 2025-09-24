// LexiPen Overlay Management
class OverlayManager {
  constructor() {
    this.overlay = null;
    this.onClose = null;
    this.actionHandlers = new ActionHandlers();
  }

  async initialize() {
    this.createOverlay();
    this.setupActionHandlers();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'lexipen-overlay';
    document.body.appendChild(this.overlay);
  }

  setupActionHandlers() {
    // Setup action handlers for the overlay interactions
    this.actionHandlers.onShowComparison = (original, improved, action) => {
      this.showComparison(original, improved, action);
    };

    this.actionHandlers.onShowGeneratedContent = (content) => {
      this.showGeneratedContent(content);
    };

    this.actionHandlers.onApproveChanges = (newText, currentField) => {
      this.applyChangesToField(newText, currentField);
      this.hide();
    };

    this.actionHandlers.onRejectChanges = () => {
      this.hide();
    };

    // Make action handlers globally available for onclick handlers
    window.lexipenActionHandlers = this.actionHandlers;
  }

  show(currentActiveField) {
    if (!this.overlay || !currentActiveField) return;
    
    const hasText = this.getFieldText(currentActiveField).trim().length > 0;
    
    if (hasText) {
      this.showImprovementActions();
    } else {
      this.showWritingPrompt();
    }
    
    this.overlay.classList.add('show');
    
    // Setup event listeners
    this.setupOverlayEventListeners();
    
    // Pass current field to action handlers
    this.actionHandlers.setCurrentField(currentActiveField);
  }

  setupOverlayEventListeners() {
    const closeButton = document.getElementById('lexipen-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide());
    }
    
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });
  }

  showImprovementActions() {
    this.overlay.innerHTML = `
      <div class="lexipen-content-box">
        <div class="lexipen-header">
          <div class="lexipen-logo">
            <span class="lexipen-icon">🖋️</span>
            <span>LexiPen</span>
          </div>
          <button class="lexipen-close" id="lexipen-close">✕</button>
        </div>
        <div class="lexipen-content">
          <div class="lexipen-actions">
            
            <div class="lexipen-action-button" onclick="lexipenActionHandlers.checkGrammar()">
              <div class="lexipen-action-icon">📝</div>
              <div class="lexipen-action-text">
                <div class="lexipen-action-title">Check grammar & spelling</div>
                <div class="lexipen-action-description">Fix grammar, spelling, and punctuation errors</div>
              </div>
            </div>
            
            <div class="lexipen-action-button" onclick="lexipenActionHandlers.toggleTone(this)">
              <div class="lexipen-action-icon">🎭</div>
              <div class="lexipen-action-text">
                <div class="lexipen-action-title">Change tone</div>
                <div class="lexipen-action-description">Adjust the style and formality of your writing</div>
              </div>
              <div class="lexipen-sub-actions" id="tone-options">
                <div class="lexipen-sub-action" onclick="lexipenActionHandlers.changeTone('professional')">
                  <span>💼</span>
                  <span>More Professional</span>
                </div>
                <div class="lexipen-sub-action" onclick="lexipenActionHandlers.changeTone('casual')">
                  <span>😊</span>
                  <span>More Casual</span>
                </div>
              </div>
            </div>
            
            <div class="lexipen-action-button" onclick="lexipenActionHandlers.toggleTranslation(this)">
              <div class="lexipen-action-icon">🌐</div>
              <div class="lexipen-action-text">
                <div class="lexipen-action-title">Translate writing</div>
                <div class="lexipen-action-description">Translate your text to another language</div>
              </div>
              <div class="lexipen-translation-form" id="translation-form">
                <div class="lexipen-form-row">
                  <span class="lexipen-form-label">From:</span>
                  <select class="lexipen-select" id="source-language">
                    <option value="auto">Detecting...</option>
                  </select>
                </div>
                <div class="lexipen-form-row">
                  <span class="lexipen-form-label">To:</span>
                  <select class="lexipen-select" id="target-language">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ja">Japanese</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
                <button class="lexipen-translate-button" onclick="lexipenActionHandlers.translate()">
                  Translate
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    `;
  }

  showWritingPrompt() {
    this.overlay.innerHTML = `
      <div class="lexipen-content-box">
        <div class="lexipen-header">
          <div class="lexipen-logo">
            <span class="lexipen-icon">🖋️</span>
            <span>Write with Lexi</span>
          </div>
          <button class="lexipen-close" id="lexipen-close">✕</button>
        </div>
        <div class="lexipen-content">
          <div class="lexipen-writing-form">
            <textarea 
              class="lexipen-textarea" 
              id="writing-prompt" 
              placeholder="What would you like to write? Describe your ideas and Lexi will help you create great content..."
            ></textarea>
            
            <div class="lexipen-options-row">
              <div class="lexipen-option-group">
                <label class="lexipen-option-label">Tone</label>
                <select class="lexipen-select" id="writing-tone">
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              
              <div class="lexipen-option-group">
                <label class="lexipen-option-label">Length</label>
                <select class="lexipen-select" id="writing-length">
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>
            
            <button class="lexipen-generate-button" onclick="lexipenActionHandlers.generateContent()">
              Generate Content
            </button>
          </div>
        </div>
      </div>
    `;
  }

  showComparison(original, improved, action) {
    const comparisonHTML = `
      <div class="lexipen-comparison show">
        <div class="lexipen-comparison-header">
          ${action} Results
        </div>
        <div class="lexipen-text-comparison">
          <div class="lexipen-text-box original">
            <div class="lexipen-text-label original">Original</div>
            <div class="lexipen-text-content">${this.escapeHtml(original)}</div>
          </div>
          <div class="lexipen-text-box improved">
            <div class="lexipen-text-label improved">Improved</div>
            <div class="lexipen-text-content">${this.escapeHtml(improved)}</div>
          </div>
        </div>
        <div class="lexipen-approval-buttons">
          <button class="lexipen-approve-button" onclick="lexipenActionHandlers.approveChanges('${this.escapeForJs(improved)}')">
            ✅ Apply Changes
          </button>
          <button class="lexipen-reject-button" onclick="lexipenActionHandlers.rejectChanges()">
            ❌ Keep Original
          </button>
        </div>
      </div>
    `;
    
    const contentDiv = document.querySelector('.lexipen-content');
    if (contentDiv) {
      contentDiv.innerHTML += comparisonHTML;
    }
  }

  showGeneratedContent(content) {
    const contentDiv = document.querySelector('.lexipen-content');
    contentDiv.innerHTML = `
      <div class="lexipen-comparison show">
        <div class="lexipen-comparison-header">
          Generated Content
        </div>
        <div class="lexipen-text-box improved" style="margin-bottom: 20px;">
          <div class="lexipen-text-label improved">Generated Text</div>
          <div class="lexipen-text-content">${this.escapeHtml(content)}</div>
        </div>
        <div class="lexipen-approval-buttons">
          <button class="lexipen-approve-button" onclick="lexipenActionHandlers.approveChanges('${this.escapeForJs(content)}')">
            ✅ Use This Content
          </button>
          <button class="lexipen-reject-button" onclick="lexipenActionHandlers.rejectChanges()">
            ❌ Try Again
          </button>
        </div>
      </div>
    `;
  }

  showLoading(message = 'Processing...') {
    const contentDiv = document.querySelector('.lexipen-content');
    if (contentDiv) {
      contentDiv.innerHTML = `
        <div class="lexipen-loading">
          <div class="lexipen-spinner"></div>
          <span>${message}</span>
        </div>
      `;
    }
  }

  applyChangesToField(newText, field) {
    if (field) {
      if (field.value !== undefined) {
        field.value = newText;
      } else {
        field.textContent = newText;
      }
      
      // Trigger input event to notify other scripts
      field.dispatchEvent(new Event('input', { bubbles: true }));
      
      console.log('✅ Changes applied to text field');
    }
  }

  hide() {
    if (this.overlay) {
      this.overlay.classList.remove('show');
    }
    
    if (this.onClose) {
      this.onClose();
    }
  }

  isVisible() {
    return this.overlay && this.overlay.classList.contains('show');
  }

  getFieldText(element) {
    return element.value || element.textContent || '';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  escapeForJs(text) {
    return text.replace(/'/g, "\\'").replace(/\n/g, '\\n');
  }
}
