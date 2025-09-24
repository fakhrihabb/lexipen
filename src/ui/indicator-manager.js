// LexiPen Indicator Management
class IndicatorManager {
  constructor() {
    this.indicator = null;
    this.onIndicatorClick = null;
  }

  show(element) {
    this.hide();
    
    const hasText = this.getFieldText(element).trim().length > 0;
    
    this.indicator = document.createElement('div');
    this.indicator.className = hasText ? 'lexipen-indicator' : 'lexipen-indicator empty-field';
    
    if (hasText) {
      this.indicator.innerHTML = '🖋️ Let Lexi improve your writing...';
    } else {
      this.indicator.innerHTML = '✨ Write with Lexi...';
    }
    
    // Position indicator
    this.positionIndicator(element);
    
    // Add click handler
    this.indicator.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.onIndicatorClick) {
        this.onIndicatorClick();
      }
    });
    
    document.body.appendChild(this.indicator);
  }

  positionIndicator(element) {
    const rect = element.getBoundingClientRect();
    this.indicator.style.position = 'fixed';
    this.indicator.style.top = `${rect.top - 45}px`;
    this.indicator.style.right = `${window.innerWidth - rect.right}px`;
  }

  updateForField(element) {
    if (!this.indicator) return;
    
    const hasText = this.getFieldText(element).trim().length > 0;
    
    if (hasText) {
      this.indicator.className = 'lexipen-indicator';
      this.indicator.innerHTML = '🖋️ Let Lexi improve your writing...';
    } else {
      this.indicator.className = 'lexipen-indicator empty-field';
      this.indicator.innerHTML = '✨ Write with Lexi...';
    }
  }

  getFieldText(element) {
    return element.value || element.textContent || '';
  }

  hide() {
    if (this.indicator) {
      this.indicator.remove();
      this.indicator = null;
    }
  }
}
