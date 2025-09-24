# Prompt API for Extensions Documentation Summary

## Overview

The **Prompt API for Chrome Extensions** enables sending natural language requests to Gemini Nano directly in the browser. It provides general-purpose AI capabilities for complex tasks that don't have specialized APIs, offering maximum flexibility for custom AI-powered features.

## Use Cases

* Event extraction: Automatically extract calendar events from web pages.
* Contact extraction: Pull contact information from websites for easy saving.
* Content analysis: Analyze and filter news articles based on user-defined topics.
* Custom AI workflows: Any task requiring general AI intelligence.
* Complex text processing: Tasks beyond simple grammar, translation, or rewriting.

## Requirements

### Hardware Requirements

* **Operating System:** Windows 10/11, macOS 13+, Linux (ChromeOS not yet supported).
* **Storage:** At least 22 GB free space in Chrome profile volume.
* **GPU:** Strictly more than 4 GB VRAM.
* **Network:** Unlimited data or unmetered connection.
* **Not supported:** Mobile devices (Android, iOS, ChromeOS).

### Extension Availability

* Stable in Chrome Extensions (no origin trial needed for extensions).
* Extension-exclusive: More powerful than web version.
* No special permissions: Works directly in extensions.
* No flags required: Available immediately in stable Chrome.

## API Usage

### Feature Detection

```javascript
if (typeof LanguageModel !== 'undefined') {
  // Prompt API is available in extensions
}
```

### Model Availability

```javascript
const availability = await LanguageModel.availability();
// Returns: 'available', 'downloadable', 'downloading', or 'unavailable'
```

### Model Parameters

```javascript
const params = await LanguageModel.params();
// Returns: {defaultTopK: 3, maxTopK: 8, defaultTemperature: 1, maxTemperature: 2}
```

### Creating a Session

```javascript
const session = await LanguageModel.create({
  // Optional: Custom parameters (must specify both or neither)
  temperature: 0.8,  // 0.0-2.0, controls randomness
  topK: 5,          // 1-8, controls vocabulary diversity
  
  // Optional: Initial conversation context
  initialPrompts: [
    { role: 'system', content: 'You are a helpful writing assistant.' },
    { role: 'user', content: 'Hello!' },
    { role: 'assistant', content: 'Hi! How can I help with your writing?' }
  ],
  
  // Optional: Download progress monitoring
  monitor(m) {
    m.addEventListener("downloadprogress", (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  },
  
  // Optional: Abort signal for cancellation
  signal: controller.signal
});
```

### Prompting Methods

#### Non-Streaming (Complete response)

```javascript
const result = await session.prompt("Analyze this text for sentiment: 'I love this product!'");
console.log(result); // Full response once complete
```

#### Streaming (Real-time chunks)

```javascript
const stream = session.promptStreaming("Write a detailed explanation of AI...");
for await (const chunk of stream) {
  console.log(chunk); // Partial responses as they arrive
  outputDiv.append(chunk);
}
```

#### With Abort Control

```javascript
const controller = new AbortController();
stopButton.onclick = () => controller.abort();

const result = await session.prompt(
  "Long analysis task...",
  { signal: controller.signal }
);
```

### Session Management

#### Session Context and Memory

```javascript
// Sessions remember previous interactions
const session = await LanguageModel.create({
  initialPrompts: [{
    role: "system",
    content: "You are a writing coach specialized in business communication."
  }]
});

const result1 = await session.prompt("How do I write a professional email?");
const result2 = await session.prompt("What about for a casual follow-up?");
// result2 will reference the previous context
```

#### Session Limits and Usage

```javascript
// Monitor token usage
console.log(`Used: ${session.inputUsage}/${session.inputQuota} tokens`);

// Check if approaching limit
if (session.inputUsage / session.inputQuota > 0.8) {
  console.log("Session approaching token limit");
}
```

#### Cloning Sessions

```javascript
// Clone session (resets conversation but keeps initial prompts)
const clonedSession = await session.clone({
  signal: controller.signal
});
```

#### Session Cleanup

```javascript
// Destroy session to free resources
session.destroy();

// Session becomes unusable after destruction
// Subsequent prompts will throw errors
```

## Important Notes

### For Future LexiPen Development

* Fallback option: When specialized APIs aren't sufficient.
* Custom features: Complex analysis beyond standard writing assistance.
* Extension exclusive: More powerful than web-based Prompt API.
* No origin trial: Ready to use immediately in extensions.
* Context memory: Can maintain conversation across multiple interactions.

### When to Use Prompt API vs Specialized APIs

* **Use Specialized APIs for:**
  * Grammar checking → Proofreader API
  * Tone changes → Rewriter API
  * Translation → Translator API
  * Content creation → Writer API
* **Use Prompt API for:**
  * Complex analysis tasks.
  * Custom AI workflows.
  * Multi-step reasoning.
  * Tasks requiring conversation context.
  * Anything not covered by specialized APIs.

### Configuration Options

* **temperature:** Controls creativity/randomness
  * 0.0: Very deterministic, consistent outputs
  * 1.0: Balanced (default)
  * 2.0: Very creative, varied outputs
* **topK:** Controls vocabulary diversity
  * 3: Conservative word choices (default)
  * 8: More diverse vocabulary (maximum)

### Advanced Features

* **Initial prompts:** Set up AI personality and context.
* **Session cloning:** Reuse configuration without conversation history.
* **Progress monitoring:** Track model download progress.
* **Abort control:** Cancel long-running operations.
* **Token management:** Monitor usage limits.

## Performance Considerations

* **Session creation:** Takes time, reuse sessions when possible.
* **Token limits:** Sessions have finite context windows.
* **Memory usage:** Each session consumes resources.
* **Download time:** First use requires 22GB model download.
* **Sequential processing:** Like other AI APIs, processes one request at a time.

### Potential Future Uses in LexiPen

* **Content analysis:** "What type of document is this?"
* **Style analysis:** "What writing style is this in?"
* **Custom instructions:** "Rewrite this following specific brand guidelines"
* **Complex workflows:** Multi-step text processing
* **Educational features:** Detailed writing explanations and tutorials

### Limitations

* Desktop only (no mobile support).
* Requires significant resources (22GB storage, 4GB+ VRAM).
* Token limits per session.
* Sequential processing (one prompt at a time).
* No Web Workers support.
* Cross-origin iframe restrictions unless explicitly allowed.
