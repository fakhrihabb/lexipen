// LexiPen UI Styles
class LexiPenStyles {
  static inject() {
    if (document.getElementById('lexipen-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'lexipen-styles';
    styles.textContent = this.getStylesCSS();
    document.head.appendChild(styles);
  }

  static getStylesCSS() {
    return `
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
        padding: 20px;
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
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
        width: calc(100% - 4px);
        min-height: 100px;
        padding: 12px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
        resize: none;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
      }
      
      .lexipen-textarea:focus {
        outline: none;
        border-color: #6366f1;
      }
      
      .lexipen-options-row {
        display: flex;
        gap: 12px;
        width: 100%;
      }

      .lexipen-option-group {
        flex: 1;
        min-width: 0;
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
  }
}
