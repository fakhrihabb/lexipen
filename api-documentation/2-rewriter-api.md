# Rewriter API Documentation Summary

## Overview

*The **Rewriter API** helps revise and restructure existing text. It's part of the Writing Assistance APIs proposal alongside the Writer API, designed to improve user-generated content by changing tone, length, or style.*

## Use Cases

* Rewrite text to be more polite and formal (e.g., emails)

* Edit customer reviews for clarity or toxicity removal

* Format content for specific audiences

* Adjust tone from casual to professional or vice versa

* Make content longer or shorter while preserving meaning

## Requirements

### Hardware Requirements

* **Operating System:** Windows 10/11, macOS 13+, Linux, or ChromeOS (Platform 16389.0.0+) on Chromebook Plus

* **Storage:** At least 22 GB free space in Chrome profile volume

* **GPU:** Strictly more than 4 GB VRAM

* **Network:** Unlimited data or unmetered connection

* **Not supported:** Mobile devices (Android, iOS, non-Chromebook Plus ChromeOS)

### Origin Trial Access

* Available in **Chrome 137-142** via joint origin trial with Writer API

* Must acknowledge Google's **Generative AI Prohibited Uses Policy**

* For extensions: Use `chrome-extension://YOUR_EXTENSION_ID` as origin

* Token must be added to extension manifest

### Local Development

* Enable flag: `chrome://flags/#rewriter-api-for-gemini-nano`

* Requires latest Chrome version

## API Usage

### Feature Detection

```javascript
if ('Rewriter' in self) {
  // Rewriter API is supported
}
```

### Model Availability

```javascript
const availability = await Rewriter.availability();
// Returns: 'available', 'downloadable', 'downloading', or 'unavailable'
```

### Creating a Rewriter Instance

```javascript
const rewriter = await Rewriter.create({
  tone: 'more-formal',     // 'more-formal', 'as-is' (default), 'more-casual'
  format: 'plain-text',    // 'as-is' (default), 'markdown', 'plain-text'
  length: 'as-is',         // 'shorter', 'as-is' (default), 'longer'
  sharedContext: 'Optional context for multiple rewriting tasks',
  monitor(m) {
    m.addEventListener("downloadprogress", e => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  }
});
```

### Configuration Options

* **tone:** Writing style adjustment

  * `'more-formal'`: Make text more professional/business-like

  * `'as-is'`: Keep original tone (default)

  * `'more-casual'`: Make text more friendly/informal

* **format:** Output formatting

  * `'as-is'`: Keep original formatting (default)

  * `'markdown'`: Add markdown formatting

  * `'plain-text'`: Remove all formatting

* **length:** Content length adjustment

  * `'shorter'`: Make text more concise

  * `'as-is'`: Keep original length (default)

  * `'longer'`: Expand with more detail

* **sharedContext:** Background info for multiple rewriting tasks

### Rewriting Content

#### Non-Streaming (Get complete result at once)

```javascript
const result = await rewriter.rewrite(
  "hey john, ur presentation was good", // Original text to rewrite
  {
    context: "This is a professional email to a colleague" // Optional context
  }
);
```

#### Streaming (Real-time output)

```javascript
const stream = rewriter.rewriteStreaming(
  originalText,
  {
    context: "Make this suitable for LinkedIn",
    tone: "more-formal"
  }
);

for await (const chunk of stream) {
  outputTextarea.append(chunk);
}
```

### Multiple Tasks with Shared Context

```javascript
const rewriter = await Rewriter.create({
  sharedContext: "These are customer reviews for an e-commerce site"
});

const review1 = await rewriter.rewrite("Product was ok I guess", {
  context: "Make this more helpful for other customers"
});

const review2 = await rewriter.rewrite("WORST PURCHASE EVER!!!", {
  context: "Remove toxic language and make constructive"
});
```

### Stopping and Cleanup

```javascript
// Aborting with AbortController
const controller = new AbortController();
const rewriter = await Rewriter.create({ signal: controller.signal });
stopButton.onclick = () => controller.abort();

// Destroying when done
rewriter.destroy();
```

## Important Notes

### For LexiPen Implementation

* Perfect for "Change Tone" feature - exactly what we need!

* Tone options match our needs:

  * "More Professional" → `{ tone: 'more-formal' }`

  * "More Casual" → `{ tone: 'more-casual' }`

* Works with existing text - user has already written something

* Context parameter allows us to provide specific instructions

* Same origin trial as Writer API (already signed up)

* Preserves original meaning while changing style

### Key Differences from Writer API

* **Writer:** Creates new content from prompts

* **Rewriter:** Modifies existing text

* **Input required:** Rewriter needs existing text to modify

* **Tone options:** Different naming (`more-formal` vs `formal`)

## Limitations

* Desktop only (no mobile support)

* Requires significant resources (22GB storage, 4GB+ VRAM)

* Origin trial period limited (Chrome 137-142)

* Not available in Web Workers

* Cross-origin iframe restrictions unless explicitly allowed

## Error Handling

* Always check `Rewriter.availability()` before creating instance

* Handle `'unavailable'` state gracefully

* Monitor download progress for better UX

* Use `AbortController` for user cancellation

## Mapping to LexiPen Features

* "Make More Professional" → `{ tone: 'more-formal' }`

* "Make More Casual" → `{ tone: 'more-casual' }`

* Keep original length → `{ length: 'as-is' }`

* Plain text output → `{ format: 'plain-text' }`

* Email context → `{ context: "This is a professional email" }`
