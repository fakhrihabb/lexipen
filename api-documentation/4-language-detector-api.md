# Language Detector API Documentation Summary

## Overview

The **Language Detector API** determines what language is used in given text, processing entirely client-side for privacy protection. It uses a fine-tuned ranking model to identify languages with confidence scores, enabling seamless integration with translation and other language-specific features.

## Use Cases

* Pre-translation detection: Determine source language before translating text.
* Language-specific processing: Load appropriate models for tasks like toxicity detection.
* Content labeling: Automatically tag content with detected language for social networks.
* UI adaptation: Adjust interface based on user's detected language (e.g., Belgian site showing French interface).
* Content moderation: Apply language-appropriate filtering and analysis.

## Requirements

### Hardware Requirements

* **Operating System:** Desktop (Windows, macOS, Linux, ChromeOS).
* **Mobile support:** Available (unlike other AI APIs that require desktop).
* **Storage:** Very small model size (much smaller than other AI models).
* **Network:** Required for initial model download only.

### API Availability

* Stable in Chrome (no origin trial needed).
* No special flags required.
* Model often pre-downloaded (used by other Chrome features).
* Fast availability due to small model size.

## API Usage

### Feature Detection

```javascript
if ('LanguageDetector' in self) {
  // Language Detector API is available
}
```

### Model Availability and Download

```javascript
const availability = await LanguageDetector.availability();
// Returns: 'available', 'downloadable', 'downloading', or 'unavailable'

// Create detector with download monitoring
const detector = await LanguageDetector.create({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Language model downloaded ${e.loaded * 100}%`);
    });
  }
});
```

### Language Detection

```javascript
const someUserText = 'Hallo und herzlich willkommen!';
const results = await detector.detect(someUserText);

// Results are ranked by confidence (highest to lowest)
for (const result of results) {
  console.log(result.detectedLanguage, result.confidence);
}

// Example output:
// de 0.9993835687637329    (German - 99.9% confidence)
// en 0.00038279531872831285 (English - 0.04% confidence)  
// nl 0.00010798392031574622 (Dutch - 0.01% confidence)
```

### Getting Top Detection Result

```javascript
const results = await detector.detect(userText);
const topResult = results[0]; // Most likely language

console.log(`Detected: ${topResult.detectedLanguage}`);
console.log(`Confidence: ${(topResult.confidence * 100).toFixed(1)}%`);
```

### Confidence Threshold Filtering

```javascript
const results = await detector.detect(userText);
const highConfidenceResults = results.filter(result => result.confidence > 0.8);

if (highConfidenceResults.length > 0) {
  const detectedLanguage = highConfidenceResults[0].detectedLanguage;
  console.log(`High confidence detection: ${detectedLanguage}`);
} else {
  console.log('No high-confidence language detection');
}
```

## Important Notes

### For LexiPen Implementation

* Perfect for translation workflow - detect source language before translating.
* No origin trial required - works immediately in stable Chrome.
* Fast and lightweight - small model, quick detection.
* Ranking system - provides multiple candidates with confidence scores.
* Essential for auto-translation - users don't need to specify source language.

### Language Code Format

* Returns **BCP 47** language codes (same as Translator API).
* **Examples:** `'en'`, `'es'`, `'fr'`, `'de'`, `'ja'`, `'zh'`.
* Consistent with Translator API - can pass results directly.

### Confidence Scoring

* **Range:** 0.0 (no confidence) to 1.0 (complete confidence).
* **Interpretation:**
  * > 0.9: Very high confidence
  * > 0.7: High confidence
  * > 0.5: Moderate confidence
  * < 0.5: Low confidence (consider as "unknown")

### Text Length Considerations

* **Short phrases:** Lower accuracy, use with caution.
* **Single words:** Very unreliable, avoid if possible.
* **Longer text:** More accurate detection.
* **Recommendation:** Use confidence thresholds for short text.

### Integration with Translator API

```javascript
// Complete translation workflow for LexiPen
const detector = await LanguageDetector.create();
const results = await detector.detect(userText);

if (results[0].confidence > 0.7) {
  const sourceLanguage = results[0].detectedLanguage;
  
  // Check if translation is supported
  const translatorAvailability = await Translator.availability({
    sourceLanguage: sourceLanguage,
    targetLanguage: 'en'
  });
  
  if (translatorAvailability === 'available') {
    const translator = await Translator.create({
      sourceLanguage: sourceLanguage,
      targetLanguage: 'en'
    });

    const translation = await translator.translate(userText);
  }
} else {
  // Low confidence - ask user to specify language
}
```

### Performance Characteristics

* Very fast detection (small model).
* Often pre-cached (model used by Chrome features).
* Minimal download time compared to other AI APIs.
* Low resource usage.

### Error Handling Best Practices

```javascript
try {
  const results = await detector.detect(userText);
  
  if (results.length === 0) {
    console.log('No language detected');
    return;
  }
  
  const topResult = results[0];
  
  if (topResult.confidence < 0.5) {
    console.log('Low confidence detection, ask user to specify');
    return;
  }
  
  // Use detected language
  const detectedLanguage = topResult.detectedLanguage;
  
} catch (error) {
  console.error('Language detection failed:', error);
  // Fallback: ask user to manually select language
}
```

## Limitations

* **Short text accuracy:** Less reliable with very short phrases.
* **Similar languages:** May confuse closely related languages.
* **Mixed languages:** Detects primary language, not code-switching.
* Not available in Web Workers.
* Cross-origin iframe restrictions unless explicitly allowed.

## LexiPen Translation UI Flow

* User types text in any language.
* Auto-detect language using Language Detector API.
* Show detected language in dropdown (pre-selected).
* Allow user to change source language if detection is wrong.
* User selects target language.
* Create translator with confirmed language pair.
* Translate and show results.
