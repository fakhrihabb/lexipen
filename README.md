# LexiPen - Smart Writing Assistant

LexiPen is a Chrome extension that provides intelligent writing assistance using Chrome's built-in AI capabilities. It offers grammar checking, tone adjustment, translation, and content generation features directly in any text field on the web.

## 🏗️ Project Structure

The codebase has been reorganized into a clean, modular architecture:

```
lexipen/
├── src/                          # Main source code
│   ├── content/                  # Content script functionality
│   │   ├── content-main.js       # Main content script entry point
│   │   └── text-field-manager.js # Text field detection and management
│   ├── popup/                    # Extension popup
│   │   ├── popup-main.js         # Popup entry point
│   │   ├── popup.html            # Popup HTML structure
│   │   ├── popup-ui.js           # UI management for popup
│   │   └── popup-actions.js      # Popup action handlers
│   ├── shared/                   # Shared utilities
│   │   └── message-handler.js    # Chrome extension messaging
│   └── ui/                       # User interface components
│       ├── styles.js             # All CSS styles for content script
│       ├── indicator-manager.js  # Text field indicators
│       ├── overlay-manager.js    # Main overlay UI
│       └── action-handlers.js    # AI action implementations
├── styles/                       # CSS files
│   └── popup.css                 # Popup styling
├── assets/                       # Assets (icons, images)
├── utils/                        # Additional utilities
├── manifest.json                 # Extension manifest
└── README.md                     # This file
```

## 🎯 Features

- **Grammar & Spelling Check**: Fix grammar, spelling, and punctuation errors
- **Tone Adjustment**: Change writing tone (professional, casual)
- **Translation**: Translate text between multiple languages
- **Content Generation**: Generate content based on prompts
- **Privacy-First**: All processing happens locally using Chrome's built-in AI
- **Universal Compatibility**: Works on any website with text input fields

## 🔧 Architecture Overview

### Content Script Layer (`src/content/`)

- **`content-main.js`**: Main orchestrator that initializes all managers and coordinates interactions
- **`text-field-manager.js`**: Handles detection, monitoring, and interaction with text input fields

### User Interface Layer (`src/ui/`)

- **`styles.js`**: Centralized CSS styling for all content script UI elements
- **`indicator-manager.js`**: Manages the floating indicators that appear near text fields
- **`overlay-manager.js`**: Controls the main modal overlay for writing assistance
- **`action-handlers.js`**: Implements all AI-powered writing actions (grammar, tone, translation, etc.)

### Popup Layer (`src/popup/`)

- **`popup-main.js`**: Entry point for the extension popup
- **`popup.html`**: Popup HTML structure
- **`popup-ui.js`**: Handles popup UI updates and rendering
- **`popup-actions.js`**: Implements popup functionality (testing, diagnostics)

### Shared Layer (`src/shared/`)

- **`message-handler.js`**: Handles Chrome extension messaging between popup and content scripts

## 🚀 Key Improvements Made

### 1. **Separation of Concerns**
- UI logic separated from business logic
- Clear boundaries between different functional areas
- Single responsibility principle applied to each module

### 2. **Maintainability**
- Large monolithic files broken into focused, manageable modules
- Clear file naming conventions
- Logical folder structure

### 3. **Reusability**
- Shared utilities can be reused across popup and content scripts
- Modular components can be easily extended or modified

### 4. **Testability**
- Each module has a clear interface
- Dependencies are explicit
- Easier to unit test individual components

### 5. **Code Organization**
- Related functionality grouped together
- Clear data flow between components
- Consistent coding patterns

## 🔄 Data Flow

1. **Text Field Detection**: `TextFieldManager` discovers and monitors text input fields
2. **User Interaction**: When user focuses on a field, `IndicatorManager` shows an indicator
3. **Action Trigger**: User clicks indicator, `OverlayManager` displays the main UI
4. **AI Processing**: User selects an action, `ActionHandlers` processes the request
5. **Result Display**: Results shown in overlay with approval/rejection options
6. **Application**: Approved changes applied back to the original text field

## 🛠️ Development Guidelines

### Adding New Features

1. **Content Script Features**: Add to appropriate manager in `src/content/` or `src/ui/`
2. **Popup Features**: Add to `src/popup/popup-actions.js`
3. **Shared Utilities**: Add to `src/shared/`
4. **Styling**: Add to `src/ui/styles.js` for content script or `styles/popup.css` for popup

### File Naming Conventions
- Use kebab-case for file names
- Include purpose in name (e.g., `text-field-manager.js`, `popup-actions.js`)
- Group related files in appropriate folders

### Code Style
- Use descriptive class and method names
- Include comments for complex functionality
- Follow consistent error handling patterns
- Use meaningful variable names

## 📱 Browser Compatibility

- Chrome 120+ (requires Chrome Built-in AI support)
- Enable Chrome flags: `chrome://flags/#prompt-api-for-gemini-nano`
- Manifest V3 compliant

## 🔐 Privacy & Security

- All AI processing happens locally on the user's device
- No data is sent to external servers
- Zero telemetry or tracking
- Privacy-first architecture

## 🧪 Testing

Use the popup interface to test:
- **Text Field Detection**: Verify LI field monitoring works
- **AI Availability**: Check Chrome's built-in AI status
- **Feature Testing**: Test each writing assistance feature

## 📄 License

This project is part of the Chrome Built-in AI Challenge 2025.

---

**Note**: This reorganized structure maintains 100% backward compatibility while providing a much cleaner, more maintainable codebase for future development.
