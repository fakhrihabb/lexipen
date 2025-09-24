# Writer API Documentation Summary

## Overview

The **Writer API** is part of the Writing Assistance APIs proposal. It helps create new content that conforms to specified writing tasks and works with the Rewriter API to improve user-generated content.

## Use Cases

* Support users writing various content (e.g., reviews, blog posts, emails).

* Help users write better support requests.

* Draft introductions for work samples.

* Generate content based on initial ideas and optional context.

## Requirements

### Hardware Requirements

* **Operating System:** Windows 10/11, macOS 13+, Linux, or ChromeOS (Platform 16389.0.0+) on Chromebook Plus.

* **Storage:** At least 22 GB free space in the Chrome profile volume.

* **GPU:** Strictly more than 4 GB VRAM.

* **Network:** Unlimited data or unmetered connection.

* **Not supported:** Mobile devices (Android, iOS, non-Chromebook Plus ChromeOS).

### Origin Trial Access

* Available in **Chrome 137-142** via origin trial.

* Joint trial with the Rewriter API.

* Must acknowledge Google's **Generative AI Prohibited Uses Policy**.

* For extensions, use `chrome-extension://YOUR_EXTENSION_ID` as the origin.

* A token must be added to the extension manifest.

### Local Development

* Enable the flag: `chrome://flags/#writer-api-for-gemini-nano`.

* Requires the latest Chrome version.

## API Usage

### Feature Detection

```javascript
if ('Writer' in self) {
  // Writer API is supported
}
```

### Model Availability

```javascript
const availability = await Writer.availability();
// Returns: 'available', 'downloadable', 'downloading', or 'unavailable'
```

```javascript
const availability = await Writer.availability();
// Returns: 'available', 'downloadable', 'downloading', or 'unavailable'
```

### Creating a Writer Instance

```javascript
const writer = await Writer.create({
  tone: 'formal',      // 'formal', 'neutral' (default), 'casual'
  format: 'markdown',  // 'markdown' (default), 'plain-text'
  length: 'medium',    // 'short', 'medium' (default), 'long'
  sharedContext: 'Optional context for multiple writing tasks',
  monitor(m) {
    m.addEventListener("downloadprogress", e => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  }
});
```

### Configuration Options

* **tone:** Writing style/attitude.

  * `'formal'`: Business/professional tone.

  * `'neutral'`: Default balanced tone.

  * `'casual'`: Friendly/informal tone.

* **format:** Output formatting.

  * `'markdown'`: Default with formatting.

  * `'plain-text'`: Simple text output.

* **length:** Content length.

  * `'short'`: Brief content.

  * `'medium'`: Default length.

  * `'long'`: Extended content.

* **sharedContext:** Background info for multiple writing tasks.

### Writing Content

#### Non-Streaming (Get complete result at once)

```javascript
const result = await writer.write(
  "An inquiry to my bank about how to enable wire transfers on my account.",
  {
    context: "I'm a longstanding customer" // Optional additional context
  }
);
```

#### Streaming (Real-time output)

```javascript
const stream = writer.writeStreaming(
  "Write a blog post about AI development",
  {
    context: "For a tech startup audience"
  }
);

for await (const chunk of stream) {
  composeTextbox.append(chunk);
}
```

### Multiple Tasks with Shared Context

```javascript
const writer = await Writer.create({
  sharedContext: "Writing for LinkedIn, a professional social media platform"
});

const post1 = await writer.write("Post about AI achievements");
const post2 = await writer.write("Post about team collaboration");
```

### Stopping and Cleanup

```javascript
// Aborting with AbortController
const controller = new AbortController();
const writer = await Writer.create({ signal: controller.signal });
stopButton.onclick = () => controller.abort();

// Destroying when done
writer.destroy();
```

## Important Notes

### For LexiPen Implementation

* Perfect for the "Write with Lexi" feature when the text field is empty.

* An origin trial token is required and must be added to the extension manifest.

* User activation is needed for the first model download.

* The tone options (`casual`/`professional`) map perfectly to the API's `casual`/`formal`.

* The length options (`short`/`medium`/`long`) match our needs exactly.

* The `context` parameter allows for custom writing prompts.

* Streaming is good for real-time feedback during content generation.

## Limitations

* **Desktop only** (no mobile support).

* Requires **significant resources** (22GB storage, 4GB+ VRAM).

* Origin trial period is **limited** (Chrome 137-142).

* Not available in **Web Workers**.

* Cross-origin iframe restrictions unless explicitly allowed.

## Error Handling

* Always check `Writer.availability()` before creating an instance.

* Handle the `'unavailable'` state gracefully.

* Monitor download progress for a better user experience.

* Use `AbortController` for user cancellation.
