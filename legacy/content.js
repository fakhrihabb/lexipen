// LexiPen Content Script - Updated UI Flow
console.log('🚀 LexiPen content script loaded on:', window.location.hostname);

// Track text fields and overlays
let textFields = new Set();
let isInitialized = false;
let currentActiveField = null;
let lexipenOverlay = null;
let lexipenIndicator = null;

// Initialize LexiPen
function initializeLexiPen() {
  if (isInitialized) return;
  
  console.log('🖋️ Initializing LexiPen...');
  
  // Create overlay container
  createOverlayContainer();
  
  // Find all text input elements
  discoverTextFields();
  
  // Watch for new text fields (dynamic content)
  observePageChanges();
  
  isInitialized = true;
  console.log(`✅ LexiPen active - monitoring ${textFields.size} text fields`);
}

// Create the main overlay container
function createOverlayContainer() {
  // Create overlay element
  lexipenOverlay = document.createElement('div');
  lexipenOverlay.id = 'lexipen-overlay';
  
  // Add styles first
  addLexiPenStyles();
  
  // Add overlay to page (initially hidden)
  document.body.appendChild(lexipenOverlay);
}

// Add comprehensive CSS styles for LexiPen
function addLexiPenStyles() {
  if (document.getElementById('lexipen-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'lexipen-styles';
  styles.textContent = `
    /* LexiPen Overlay Styles */
    #lexipen-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: lexipen-fade-in 0.3s ease-out;
    }
    
    #lexipen-overlay.show {
      display: flex;
    }
    
    .lexipen-content-box {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      overflow: hidden;
      animation: lexipen-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .lexipen-header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
      color: white;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .lexipen-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: bold;
      font-size: 20px;
    }
    
    .lexipen-icon {
      font-size: 28px;
    }
    
    .lexipen-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .lexipen-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }
    
    .lexipen-content {
      padding: 20px; /* Reduced from 24px */
      max-height: 500px;
      overflow-y: auto;
      overflow-x: hidden; /* Prevent horizontal scroll */
    }
    
    /* Action Menu Styles */
    .lexipen-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .lexipen-action-button {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      position: relative;
    }
    
    .lexipen-action-button:hover {
      background: #e2e8f0;
      border-color: #6366f1;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
    }
    
    .lexipen-action-icon {
      font-size: 24px;
      min-width: 24px;
    }
    
    .lexipen-action-text {
      flex: 1;
    }
    
    .lexipen-action-title {
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 4px;
      font-size: 16px;
    }
    
    .lexipen-action-description {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.4;
    }
    
    /* Sub-actions for tone changing */
    .lexipen-sub-actions {
      margin-top: 12px;
      padding-left: 40px;
      display: none;
      animation: lexipen-slide-down 0.3s ease-out;
    }
    
    .lexipen-sub-actions.show {
      display: block;
    }
    
    .lexipen-sub-action {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 8px;
      transition: all 0.2s ease;
    }
    
    .lexipen-sub-action:hover {
      background: #f3f4f6;
      border-color: #6366f1;
    }
    
    .lexipen-sub-action:last-child {
      margin-bottom: 0;
    }
    
    /* Translation Form Styles */
    .lexipen-translation-form {
      display: none;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      margin-top: 12px;
    }
    
    .lexipen-translation-form.show {
      display: block;
    }
    
    .lexipen-form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      align-items: center;
    }
    
    .lexipen-form-label {
      font-weight: 600;
      color: #374151;
      min-width: 60px;
      font-size: 14px;
    }
    
    .lexipen-select {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .lexipen-translate-button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    
    .lexipen-translate-button:hover {
      background: #5855f7;
    }
    
    /* Writing Prompt Styles */
    .lexipen-writing-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .lexipen-textarea {
      width: calc(100% - 4px); /* Account for border */
      min-height: 100px;
      padding: 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      resize: none; /* Make non-resizable */
      transition: border-color 0.2s ease;
      box-sizing: border-box; /* Include padding and border in width calculation */
    }
    
    .lexipen-textarea:focus {
      outline: none;
      border-color: #6366f1;
    }
    
    .lexipen-options-row {
      display: flex;
      gap: 12px; /* Reduced from 16px */
      width: 100%;
    }

    .lexipen-option-group {
      flex: 1;
      min-width: 0; /* Allow shrinking */
    }
    
    .lexipen-option-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
      font-size: 14px;
    }
    
    .lexipen-generate-button {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      align-self: flex-start;
    }
    
    .lexipen-generate-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    
    /* Before/After Comparison Styles */
    .lexipen-comparison {
      display: none;
      margin-top: 20px;
    }
    
    .lexipen-comparison.show {
      display: block;
    }
    
    .lexipen-comparison-header {
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 16px;
      text-align: center;
      font-size: 16px;
    }
    
    .lexipen-text-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .lexipen-text-box {
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
    }
    
    .lexipen-text-box.original {
      background: #fef2f2;
      border-color: #fca5a5;
    }
    
    .lexipen-text-box.improved {
      background: #f0fdf4;
      border-color: #86efac;
    }
    
    .lexipen-text-label {
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .lexipen-text-label.original {
      color: #dc2626;
    }
    
    .lexipen-text-label.improved {
      color: #16a34a;
    }
    
    .lexipen-text-content {
      font-size: 14px;
      line-height: 1.5;
      color: #374151;
    }
    
    .lexipen-approval-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    
    .lexipen-approve-button, .lexipen-reject-button {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    .lexipen-approve-button {
      background: #16a34a;
      color: white;
    }
    
    .lexipen-approve-button:hover {
      background: #15803d;
    }
    
    .lexipen-reject-button {
      background: #e5e7eb;
      color: #374151;
    }
    
    .lexipen-reject-button:hover {
      background: #d1d5db;
    }
    
    /* Indicator Styles */
    .lexipen-indicator {
      position: absolute;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      z-index: 999998;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      user-select: none;
    }
    
    .lexipen-indicator:hover {
      background: linear-gradient(135deg, #5855f7, #7c3aed);
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }
    
    .lexipen-indicator.empty-field {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
    }

    .lexipen-indicator.empty-field:hover {
      background: linear-gradient(135deg, #5855f7, #7c3aed);
    }
    
    /* Loading States */
    .lexipen-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 40px;
      color: #6b7280;
    }
    
    .lexipen-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #f0f0f0;
      border-top: 3px solid #6366f1;
      border-radius: 50%;
      animation: lexipen-spin 1s linear infinite;
    }
    
    /* Empty State */
    .lexipen-empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
    }
    
    .lexipen-empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.7;
    }
    
    .lexipen-empty-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #374151;
    }
    
    .lexipen-empty-description {
      font-size: 14px;
      line-height: 1.5;
    }
    
    /* Animations */
    @keyframes lexipen-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes lexipen-slide-up {
      from { 
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes lexipen-slide-down {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 200px;
      }
    }
    
    @keyframes lexipen-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Mobile responsiveness */
    @media (max-width: 600px) {
      .lexipen-content-box {
        width: 95%;
        margin: 20px;
      }
      
      .lexipen-text-comparison {
        grid-template-columns: 1fr;
      }
      
      .lexipen-options-row {
        flex-direction: column;
      }
      
      .lexipen-form-row {
        flex-direction: column;
        align-items: stretch;
      }
      
      .lexipen-form-label {
        min-width: auto;
      }
    }
  `;
  
  document.head.appendChild(styles);
}

// Discover all text input fields on the page
function discoverTextFields() {
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
      if (isValidTextField(element)) {
        textFields.add(element);
        setupTextFieldListeners(element);
      }
    });
  });
}

// Check if element is a valid text field we want to monitor
function isValidTextField(element) {
  if (element.style.display === 'none') return false;
  if (element.offsetParent === null) return false;
  if (element.type === 'password') return false;
  
  const rect = element.getBoundingClientRect();
  if (rect.width < 50 || rect.height < 20) return false;
  
  return true;
}

// Set up event listeners for text field
function setupTextFieldListeners(element) {
  element.addEventListener('focus', () => {
    currentActiveField = element;
    showLexiPenIndicator(element);
  });
  
  element.addEventListener('blur', () => {
    setTimeout(() => {
      if (!lexipenOverlay || !lexipenOverlay.classList.contains('show')) {
        hideLexiPenIndicator();
      }
    }, 200);
  });
  
  // Listen for text changes to update indicator
  element.addEventListener('input', () => {
    if (currentActiveField === element) {
      updateIndicatorForField(element);
    }
  });
}

// Show LexiPen indicator next to text field
function showLexiPenIndicator(element) {
  hideLexiPenIndicator();
  
  const hasText = getFieldText(element).trim().length > 0;
  
  lexipenIndicator = document.createElement('div');
  lexipenIndicator.className = hasText ? 'lexipen-indicator' : 'lexipen-indicator empty-field';
  
  if (hasText) {
    lexipenIndicator.innerHTML = '🖋️ Let Lexi improve your writing...';
  } else {
    lexipenIndicator.innerHTML = '✨ Write with Lexi...';
  }
  
  // Position indicator
  const rect = element.getBoundingClientRect();
  lexipenIndicator.style.position = 'fixed';
  lexipenIndicator.style.top = `${rect.top - 45}px`;
  lexipenIndicator.style.right = `${window.innerWidth - rect.right}px`;
  
  // Add click handler
  lexipenIndicator.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showLexiPenOverlay();
  });
  
  document.body.appendChild(lexipenIndicator);
}

// Update indicator based on field content
function updateIndicatorForField(element) {
  if (!lexipenIndicator) return;
  
  const hasText = getFieldText(element).trim().length > 0;
  
  if (hasText) {
    lexipenIndicator.className = 'lexipen-indicator';
    lexipenIndicator.innerHTML = '🖋️ Let Lexi improve your writing...';
  } else {
    lexipenIndicator.className = 'lexipen-indicator empty-field';
    lexipenIndicator.innerHTML = '✨ Write with Lexi...';
  }
}

// Get text content from field
function getFieldText(element) {
  return element.value || element.textContent || '';
}

// Hide LexiPen indicator
function hideLexiPenIndicator() {
  if (lexipenIndicator) {
    lexipenIndicator.remove();
    lexipenIndicator = null;
  }
}

// Show LexiPen overlay with appropriate content
function showLexiPenOverlay() {
  if (!lexipenOverlay || !currentActiveField) return;
  
  const hasText = getFieldText(currentActiveField).trim().length > 0;
  
  if (hasText) {
    showImprovementActions();
  } else {
    showWritingPrompt();
  }
  
  lexipenOverlay.classList.add('show');
  hideLexiPenIndicator();
  
  // Add event listeners
  const closeButton = document.getElementById('lexipen-close');
  if (closeButton) {
    closeButton.addEventListener('click', hideLexiPenOverlay);
  }
  
  lexipenOverlay.addEventListener('click', (e) => {
    if (e.target === lexipenOverlay) {
      hideLexiPenOverlay();
    }
  });
}

// Show improvement actions for existing text
function showImprovementActions() {
  lexipenOverlay.innerHTML = `
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
          
          <div class="lexipen-action-button" onclick="lexipenCheckGrammar()">
            <div class="lexipen-action-icon">📝</div>
            <div class="lexipen-action-text">
              <div class="lexipen-action-title">Check grammar & spelling</div>
              <div class="lexipen-action-description">Fix grammar, spelling, and punctuation errors</div>
            </div>
          </div>
          
          <div class="lexipen-action-button" onclick="lexipenToggleTone(this)">
            <div class="lexipen-action-icon">🎭</div>
            <div class="lexipen-action-text">
              <div class="lexipen-action-title">Change tone</div>
              <div class="lexipen-action-description">Adjust the style and formality of your writing</div>
            </div>
            <div class="lexipen-sub-actions" id="tone-options">
              <div class="lexipen-sub-action" onclick="lexipenChangeTone('professional')">
                <span>💼</span>
                <span>More Professional</span>
              </div>
              <div class="lexipen-sub-action" onclick="lexipenChangeTone('casual')">
                <span>😊</span>
                <span>More Casual</span>
              </div>
            </div>
          </div>
          
          <div class="lexipen-action-button" onclick="lexipenToggleTranslation(this)">
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
              <button class="lexipen-translate-button" onclick="lexipenTranslate()">
                Translate
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
}

// Show writing prompt for empty fields
function showWritingPrompt() {
  lexipenOverlay.innerHTML = `
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
          
          <button class="lexipen-generate-button" onclick="lexipenGenerateContent()">
            Generate Content
          </button>
        </div>
      </div>
    </div>
  `;
}

// Show before/after comparison
function showComparison(original, improved, action) {
  const comparisonHTML = `
    <div class="lexipen-comparison show">
      <div class="lexipen-comparison-header">
        ${action} Results
      </div>
      <div class="lexipen-text-comparison">
        <div class="lexipen-text-box original">
          <div class="lexipen-text-label original">Original</div>
          <div class="lexipen-text-content">${original}</div>
        </div>
        <div class="lexipen-text-box improved">
          <div class="lexipen-text-label improved">Improved</div>
          <div class="lexipen-text-content">${improved}</div>
        </div>
      </div>
      <div class="lexipen-approval-buttons">
        <button class="lexipen-approve-button" onclick="lexipenApproveChanges('${improved.replace(/'/g, "\\'")}')">
          ✅ Apply Changes
        </button>
        <button class="lexipen-reject-button" onclick="lexipenRejectChanges()">
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

// Hide LexiPen overlay
function hideLexiPenOverlay() {
  if (lexipenOverlay) {
    lexipenOverlay.classList.remove('show');
  }
}

// Global functions for UI interactions (placeholders for now)
window.lexipenCheckGrammar = function() {
  console.log('🔧 Grammar check requested - API implementation pending');
  const originalText = getFieldText(currentActiveField);
  // Simulate API call delay
  setTimeout(() => {
    showComparison(
      originalText,
      "This is a simulated grammar-corrected version of your text.",
      "Grammar Check"
    );
  }, 1000);
};

window.lexipenToggleTone = function(button) {
  const subActions = button.querySelector('.lexipen-sub-actions');
  subActions.classList.toggle('show');
};

window.lexipenChangeTone = function(tone) {
  console.log(`🔧 Tone change to ${tone} requested - API implementation pending`);
  const originalText = getFieldText(currentActiveField);
  setTimeout(() => {
    const toneText = tone === 'professional' ? 
      "This is a simulated professional version of your text." :
      "This is a simulated casual version of your text.";
    showComparison(
      originalText,
      toneText,
      `${tone.charAt(0).toUpperCase() + tone.slice(1)} Tone`
    );
  }, 1000);
};

window.lexipenToggleTranslation = function(button) {
  const form = button.querySelector('.lexipen-translation-form');
  form.classList.toggle('show');
  
  if (form.classList.contains('show')) {
    console.log('🔧 Auto-detecting language - API implementation pending');
    // Simulate language detection
    setTimeout(() => {
      const sourceSelect = document.getElementById('source-language');
      if (sourceSelect) {
        sourceSelect.innerHTML = `
          <option value="en" selected>English (detected)</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        `;
      }
    }, 500);
  }
};

window.lexipenTranslate = function() {
  console.log('🔧 Translation requested - API implementation pending');
  const originalText = getFieldText(currentActiveField);
  const targetLang = document.getElementById('target-language').value;
  
  setTimeout(() => {
    showComparison(
      originalText,
      "This is a simulated translation of your text.",
      "Translation"
    );
  }, 1000);
};

window.lexipenGenerateContent = function() {
  console.log('🔧 Content generation requested - API implementation pending');
  const prompt = document.getElementById('writing-prompt').value;
  const tone = document.getElementById('writing-tone').value;
  const length = document.getElementById('writing-length').value;
  
  if (!prompt.trim()) {
    alert('Please describe what you want to write!');
    return;
  }
  
  console.log(`Generating ${length} ${tone} content for: "${prompt}"`);
  
  // Show loading state
  const contentDiv = document.querySelector('.lexipen-content');
  contentDiv.innerHTML = `
    <div class="lexipen-loading">
      <div class="lexipen-spinner"></div>
      <span>Generating your content...</span>
    </div>
  `;
  
  setTimeout(() => {
    showGeneratedContent(
      "This is simulated generated content based on your prompt. It will be " + 
      length + " and written in a " + tone + " tone."
    );
  }, 2000);
};

// Show generated content with approval
function showGeneratedContent(content) {
  const contentDiv = document.querySelector('.lexipen-content');
  contentDiv.innerHTML = `
    <div class="lexipen-comparison show">
      <div class="lexipen-comparison-header">
        Generated Content
      </div>
      <div class="lexipen-text-box improved" style="margin-bottom: 20px;">
        <div class="lexipen-text-label improved">Generated Text</div>
        <div class="lexipen-text-content">${content}</div>
      </div>
      <div class="lexipen-approval-buttons">
        <button class="lexipen-approve-button" onclick="lexipenApproveChanges('${content.replace(/'/g, "\\'")}')">
          ✅ Use This Content
        </button>
        <button class="lexipen-reject-button" onclick="lexipenRejectChanges()">
          ❌ Try Again
        </button>
      </div>
    </div>
  `;
}

window.lexipenApproveChanges = function(newText) {
  if (currentActiveField) {
    // Apply the changes to the text field
    if (currentActiveField.value !== undefined) {
      currentActiveField.value = newText;
    } else {
      currentActiveField.textContent = newText;
    }
    
    // Trigger input event to notify other scripts
    currentActiveField.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log('✅ Changes applied to text field');
  }
  
  hideLexiPenOverlay();
};

window.lexipenRejectChanges = function() {
  console.log('❌ Changes rejected');
  hideLexiPenOverlay();
};

// Watch for dynamically added content
function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (isValidTextField(node)) {
            textFields.add(node);
            setupTextFieldListeners(node);
          }
          
          const newTextFields = node.querySelectorAll('input, textarea, [contenteditable]');
          newTextFields.forEach(field => {
            if (isValidTextField(field)) {
              textFields.add(field);
              setupTextFieldListeners(field);
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'testDetection') {
    console.log('🧪 Testing LexiPen detection - found', textFields.size, 'text fields');
    sendResponse({
      success: true,
      textFields: textFields.size,
      url: window.location.href
    });
  }
});

// Start LexiPen when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLexiPen);
} else {
  initializeLexiPen();
}

console.log('✨ LexiPen content script ready');