// Popup Actions
import { PopupUI } from './popup-ui.js';
import { MessageHandler } from '../shared/message-handler.js';

export class PopupActions {
  constructor() {
    this.ui = new PopupUI();
    this.messageHandler = new MessageHandler();
  }

  async testDetection() {
    this.ui.showLoading('Testing LexiPen text field detection...');
    
    try {
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        throw new Error('Chrome APIs not available');
      }

      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      chrome.tabs.sendMessage(tab.id, {
        action: 'testDetection'
      }, (response) => {
        if (chrome.runtime.lastError) {
          this.ui.showError('Content script not loaded. Try refreshing the page.');
          return;
        }
        
        if (response && response.success) {
          this.ui.showSuccess(`LexiPen found ${response.textFields} text fields on this page!`);
        } else {
          this.ui.showError('No text fields detected on this page.');
        }
      });
      
    } catch (error) {
      this.ui.showError(`Error: ${error.message}`);
    }
  }

  async testAI() {
    this.ui.showLoading('Checking Chrome Built-in AI availability...');
    
    try {
      if (typeof LanguageModel !== 'undefined') {
        const availability = await LanguageModel.availability();
        
        switch(availability) {
          case 'available':
            this.ui.showSuccess('AI is ready! Testing LexiPen intelligence...');
            await this.testAICapability();
            break;
            
          case 'downloadable':
            this.ui.showResult('⏳ AI model needs download (22GB). Click to start.', 'loading');
            break;
            
          case 'downloading':
            this.ui.showResult('📥 AI model downloading... Please wait.', 'loading');
            break;
            
          default:
            this.ui.showError('AI not available on this device.');
        }
      } else {
        this.ui.showError('Built-in AI not enabled. Check chrome://flags/#prompt-api-for-gemini-nano');
      }
    } catch (error) {
      this.ui.showError(`AI Error: ${error.message}`);
    }
  }

  async testAICapability() {
    try {
      const session = await LanguageModel.create({
        initialPrompts: [
          {
            role: "system", 
            content: "You are LexiPen, a helpful writing assistant that provides clear, concise suggestions."
          }
        ],
        expectedOutputs: [
          {
            type: "text",
            languages: ["en"]
          }
        ]
      });
      
      const testResult = await session.prompt("Fix this grammar and make it professional: 'hey john, ur presentation was pretty good'");
      
      this.ui.appendResult(`
        <div style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 6px;">
          <strong>🧠 AI Test Result:</strong><br>
          <span style="font-size: 11px; line-height: 1.4;">${testResult}</span>
        </div>
      `);
    } catch (promptError) {
      this.ui.appendResult(`<br><span class="error">❌ AI Prompt Error: ${promptError.message}</span>`);
    }
  }
}
