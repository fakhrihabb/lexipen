# Translator API Documentation Summary

## Overview

The **Translator API** enables client-side text translation using AI models built into Chrome. It allows users to write in their native language while providing translations to target languages, all processed locally on the device for privacy and speed.

## Use Cases

* Support chat translation (users write in native language, agents receive in their language).
* User-generated content translation.
* Real-time text translation without cloud services.
* Ephemeral content translation that doesn't need server storage.
* Inclusive multilingual experiences.

## Requirements

### Hardware Requirements

* **Operating System:** Desktop only (Windows, macOS, Linux, ChromeOS).
* **Mobile:** **NOT** supported (Android, iOS, non-Chromebook Plus ChromeOS).
* **Storage:** Language packs downloaded on demand (size varies by language pair).
* **Network:** Required for initial language pack downloads.

### API Availability

* Stable in Chrome (no origin trial needed).
* No special flags required for basic usage.
* Works immediately on supported devices.

## API Usage

### Feature Detection

```javascript
if ('Translator' in self) {
  // Translator API is supported
}
```

### Check Language Pair Support

```javascript
const translatorCapabilities = await Translator.availability({
  sourceLanguage: 'es',  // Spanish
  targetLanguage: 'fr'   // French
});
// Returns: 'available', 'downloadable', 'downloading', or 'unavailable'
```

### Language Codes

* Uses **BCP 47** language codes (ISO standard).
* **Examples:** `'en'` for English, `'es'` for Spanish, `'fr'` for French, `'de'` for German, `'ja'` for Japanese, `'zh'` for Chinese.

### Creating a Translator Instance

```javascript
const translator = await Translator.create({
  sourceLanguage: 'en',    // Language of input text
  targetLanguage: 'fr',    // Language to translate to
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Language pack downloaded ${e.loaded * 100}%`);
    });
  }
});
```

### Translation Methods

#### Non-Streaming (Complete translation at once)

```javascript
const result = await translator.translate('Where is the next bus stop, please?');
// Returns: "Où est le prochain arrêt de bus, s'il vous plaît ?"
```

#### Streaming (For longer texts)

```javascript
const stream = translator.translateStreaming(longText);
for await (const chunk of stream) {
  console.log(chunk);
  outputDiv.append(chunk);
}
```

### Language Pack Management

* Language packs downloaded on demand per language pair.
* First use requires download (user activation needed).
* Subsequent translations with same language pair are instant.
* Download progress can be monitored for better UX.

## Important Notes

### For LexiPen Implementation

* Perfect for "Translate Writing" feature.
* No origin trial required - works immediately.
* Should combine with Language Detector API for auto-detection.
* Language packs are cached - subsequent translations are fast.
* Works with any language pair (if supported).
* Preserves original tone and context.

### Language Pair Strategy

```javascript
// Check if specific language pair is supported
const checkSupport = async (source, target) => {
  const availability = await Translator.availability({
    sourceLanguage: source,
    targetLanguage: target
  });
  return availability !== 'unavailable';
};

// Example: Check if Spanish to English is supported
const isSupported = await checkSupport('es', 'en');
```

### Sequential Processing

* Translations processed sequentially - not parallel.
* Large texts block subsequent requests.
* **Best practice:** Chunk large texts and show loading UI.
* **User experience:** Always show translation progress.

### Integration with Language Detector

```javascript
// Typical workflow for LexiPen
// 1. Detect source language
const detector = await LanguageDetector.create();
const results = await detector.detect(userText);
const detectedLanguage = results[0].detectedLanguage;

// 2. Check if translation is supported
const canTranslate = await Translator.availability({
  sourceLanguage: detectedLanguage,
  targetLanguage: 'en'
});

// 3. Create translator if supported
if (canTranslate === 'available') {
  const translator = await Translator.create({
    sourceLanguage: detectedLanguage,
    targetLanguage: 'en'
  });
  
  const translation = await translator.translate(userText);
}
```

## Error Handling

* **Language pair not supported:** Handle `'unavailable'` status gracefully.
* **Download failures:** Monitor `downloadprogress` events for failures.
* **Network issues:** Language pack downloads may fail.
* **User activation:** First use requires user interaction.

## Limitations

* Desktop only (no mobile device support).
* Sequential processing (can't parallel process multiple texts).
* Language pack dependencies (requires download for new pairs).
* Not available in Web Workers.
* Cross-origin iframe restrictions unless explicitly allowed.

## Performance Considerations

* First translation with new language pair takes time (download).
* Subsequent translations are fast (cached language packs).
* Large texts should use streaming API.
* Show progress indicators for better UX.

## Supported Languages

* **Common languages:** English, Spanish, French, German, Italian, Portuguese, Dutch, etc.
* **Asian languages:** Japanese, Chinese, Korean, etc.
* Check availability for specific pairs before using.
* Language support may vary by Chrome version and region.
