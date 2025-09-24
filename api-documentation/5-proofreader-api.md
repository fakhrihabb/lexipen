# Proofreader API Documentation Summary

## Overview

The **Proofreader API** provides interactive proofreading for web applications and extensions using built-in AI. It corrects errors in grammar, spelling, and punctuation while providing labels and explanations for each correction.

## Key Features

* **Correction:** Fix grammar, spelling, and punctuation errors.
* **Labels:** Categorize each correction by error type.
* **Explanation:** Provide plain language explanations for why corrections are necessary.
* **Interactive proofreading:** Real-time correction suggestions.

## Use Cases

* Suggest corrections for forum messages, comments, and emails before submission.
* Provide corrections during active note-taking.
* Real-time writing assistance in web applications.
* Educational writing tools with explanations.

## Requirements

### Hardware Requirements

* **Operating System:** Windows 10/11, macOS 13+, Linux, or ChromeOS (Platform 16389.0.0+) on Chromebook Plus.
* **Storage:** At least 22 GB free space in Chrome profile volume.
* **GPU:** Strictly more than 4 GB VRAM.
* **Network:** Unlimited data or unmetered connection.
* **Not supported:** Mobile devices (Android, iOS, non-Chromebook Plus ChromeOS).

### Origin Trial Access

* **Available:** Chrome 141-145 via origin trial.
* **Must acknowledge:** Google's Generative AI Prohibited Uses Policy.
* **For extensions:** Use `chrome-extension://YOUR_EXTENSION_ID` as origin.
* **Token required:** Must be added to extension manifest.

### Local Development

* **Enable flag:** `chrome://flags/#proofreader-api-for-gemini-nano`.
* **Requires:** Latest Chrome version.

## API Usage

### Feature Detection

```javascript
if ('Proofreader' in self) {
  // Proofreader API is supported
}
```

### Model Availability

```javascript
const availability = await Proofreader.availability();
// Returns: 'available', 'downloadable', 'downloading', or 'unavailable'
```

### Creating a Proofreader Instance

```javascript
const proofreader = await Proofreader.create({
  expectedInputLanguages: ["en"], // Array of expected languages
  monitor(m) {
    m.addEventListener("downloadprogress", e => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  }
});
```

### Configuration Options

* `expectedInputLanguages`: Array of expected input languages (e.g., `["en"]`, `["en", "es"]`).
* **Note:** `includeCorrectionTypes` and `includeCorrectionExplanation` options from explainer are **NOT** supported.

### Proofreading Text

```javascript
const text = 'I seen him yesterday at the store, and he bought two loafs of bread.';
const proofreadResult = await proofreader.proofread(text);
```

### ProofreadResult Structure

```javascript
// Result object contains:
{
  correction: "I saw him yesterday at the store, and he bought two loaves of bread.", // Fully corrected text
  corrections: [
    {
      startIndex: 2,      // Start position of error in original text
      endIndex: 6,        // End position of error in original text
      correctedText: "saw", // Suggested correction
      // Additional properties may include error type and explanation
    },
    {
      startIndex: 67,
      endIndex: 72,
      correctedText: "loaves",
    }
  ]
}
```

### Rendering Corrections (Example)

```javascript
let inputRenderIndex = 0;
const input = 'I seen him yesterday at the store, and he bought two loafs of bread.';

console.log(proofreadResult.correction); // Full corrected text

for (const correction of proofreadResult.corrections) {
  // Render unchanged text
  if (correction.startIndex > inputRenderIndex) {
    const unchangedInput = document.createElement('span');
    unchangedInput.textContent = input.substring(inputRenderIndex, correction.startIndex);
    editBox.append(unchangedInput);
  }
  
  // Render error text with highlighting
  const errorInput = document.createElement('span');
  errorInput.textContent = input.substring(correction.startIndex, correction.endIndex);
  errorInput.classList.add('error'); // Add red underline CSS
  editBox.append(errorInput);
  
  inputRenderIndex = correction.endIndex;
}

// Render remaining unchanged text
if (inputRenderIndex !== input.length) {
  const unchangedInput = document.createElement('span');
  unchangedInput.textContent = input.substring(inputRenderIndex, input.length);
  editBox.append(unchangedInput);
}
```

## Important Notes

### For LexiPen Implementation

* Perfect for "Check Grammar & Spelling" feature.
* Provides structured corrections with start/end positions.
* Includes full corrected text for easy replacement.
* Shows specific error locations for highlighting.
* Language-specific processing via `expectedInputLanguages`.
* Origin trial token required - same as Writer/Rewriter APIs.

### Key Advantages Over Prompt API

* **Specialized for proofreading:** More accurate than general Prompt API.
* **Structured output:** Exact error positions and corrections.
* **Faster processing:** Optimized for grammar/spelling tasks.
* **Consistent format:** Standardized correction objects.

### Error Highlighting Strategy

```javascript
// CSS for error highlighting
.error {
  text-decoration: underline;
  text-decoration-color: red;
  text-decoration-style: wavy;
  cursor: pointer;
}

.error:hover {
  background-color: rgba(255, 0, 0, 0.1);
}
```

### Integration with LexiPen UI

```javascript
// LexiPen Grammar Check implementation
const checkGrammar = async (userText) => {
  try {
    const proofreader = await Proofreader.create({
      expectedInputLanguages: ["en"]
    });
    
    const result = await proofreader.proofread(userText);
    
    // Show before/after comparison
    return {
      original: userText,
      corrected: result.correction,
      corrections: result.corrections,
      hasErrors: result.corrections.length > 0
    };
    
  } catch (error) {
    console.error('Proofreading failed:', error);
    return { error: 'Grammar check temporarily unavailable' };
  }
};
```

### Multi-language Support

```javascript
// Support multiple languages
const proofreader = await Proofreader.create({
  expectedInputLanguages: ["en", "es", "fr"] // Multiple languages
});
```

### Limitations

* Desktop only (no mobile support).
* Requires significant resources (22GB storage, 4GB+ VRAM).
* Origin trial period limited (Chrome 141-145).
* Not available in Web Workers.
* Cross-origin iframe restrictions unless explicitly allowed.
* Limited configuration options (correction types/explanations not configurable).

### Error Handling

```javascript
const availability = await Proofreader.availability();

if (availability === 'unavailable') {
  // Show fallback UI or disable feature
  return { error: 'Grammar checking not available on this device' };
}

if (availability === 'downloadable') {
  // Show loading UI during model download
  // First use requires user activation
}
```

### Performance Considerations

* **First use:** Requires model download (22GB).
* **Subsequent uses:** Fast processing with cached model.
* **User activation:** Required for initial model download.
* **Sequential processing:** Like other AI APIs, processes one request at a time.
