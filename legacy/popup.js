// LexiPen Popup Logic
console.log('🖋️ LexiPen popup loaded');

// DOM elements
const testDetectionBtn = document.getElementById('test-detection');
const testAIBtn = document.getElementById('test-ai');
const resultDiv = document.getElementById('result');
const activeSitesSpan = document.getElementById('active-sites');

// Update active sites count
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  if (tabs[0]) {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;
    activeSitesSpan.textContent = domain;
  }
});

// Test text field detection
testDetectionBtn.addEventListener('click', async () => {
  resultDiv.innerHTML = '<span class="loading">🔍 Testing LexiPen text field detection...</span>';
  
  try {
    // Send message to content script to test detection
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    chrome.tabs.sendMessage(tab.id, {
      action: 'testDetection'
    }, (response) => {
      if (chrome.runtime.lastError) {
        resultDiv.innerHTML = '<span class="error">❌ Content script not loaded. Try refreshing the page.</span>';
        return;
      }
      
      if (response && response.success) {
        resultDiv.innerHTML = `<span class="success">✅ LexiPen found ${response.textFields} text fields on this page!</span>`;
      } else {
        resultDiv.innerHTML = '<span class="error">❌ No text fields detected on this page.</span>';
      }
    });
    
  } catch (error) {
    resultDiv.innerHTML = `<span class="error">❌ Error: ${error.message}</span>`;
  }
});

// Enhanced AI test with proper language specification
testAIBtn.addEventListener('click', async () => {
  resultDiv.innerHTML = '<span class="loading">🧠 Checking Chrome Built-in AI availability...</span>';
  
  try {
    if (typeof LanguageModel !== 'undefined') {
      const availability = await LanguageModel.availability();
      
      switch(availability) {
        case 'available':
          resultDiv.innerHTML = '<span class="success">✅ AI is ready! Testing LexiPen intelligence...</span>';
          
          // Test real AI capability with proper language specification
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
            
            resultDiv.innerHTML += `
              <div style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 6px;">
                <strong>🧠 AI Test Result:</strong><br>
                <span style="font-size: 11px; line-height: 1.4;">${testResult}</span>
              </div>
            `;
          } catch (promptError) {
            resultDiv.innerHTML += `<br><span class="error">❌ AI Prompt Error: ${promptError.message}</span>`;
          }
          break;
          
        case 'downloadable':
          resultDiv.innerHTML = '<span class="loading">⏳ AI model needs download (22GB). Click to start.</span>';
          break;
        case 'downloading':
          resultDiv.innerHTML = '<span class="loading">📥 AI model downloading... Please wait.</span>';
          break;
        default:
          resultDiv.innerHTML = '<span class="error">❌ AI not available on this device.</span>';
      }
    } else {
      resultDiv.innerHTML = '<span class="error">❌ Built-in AI not enabled. Check chrome://flags/#prompt-api-for-gemini-nano</span>';
    }
  } catch (error) {
    resultDiv.innerHTML = `<span class="error">❌ AI Error: ${error.message}</span>`;
  }
});

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  console.log('🖋️ LexiPen popup initialized');
  resultDiv.innerHTML = '<span style="opacity: 0.7;">Click buttons above to test LexiPen functionality</span>';
});