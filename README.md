# ◈ XML Studio

### Shape data. Transform logic. See the result.

**XML Studio** is a modern, professional XML + XSLT development workbench designed to make XML authoring, XSLT transformation, validation, and live preview feel effortless.

> **Write XML → Define XSLT → Transform → Preview**

Built for developers who want a focused, beautiful, and powerful environment for working with XML and XSLT — without the complexity of a full IDE.

---

<p align="center">

![XML Studio](https://img.shields.io/badge/XML%20Studio-XSLT%20Workbench-7C5CFC?style=for-the-badge\&logo=xml\&logoColor=white)

![Status](https://img.shields.io/badge/Status-Active-22C55E?style=for-the-badge)

![License](https://img.shields.io/badge/License-MIT-111827?style=for-the-badge)

</p>

<p align="center">
  <strong>A beautiful workspace for XML data and XSLT transformations.</strong>
</p>

---

## ✦ Why XML Studio?

Working with XML and XSLT often means jumping between editors, validators, browsers, and command-line tools.

**XML Studio brings the workflow together in one focused workspace.**

```text
                 ┌───────────────┐
                 │   XML DATA    │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     XSLT      │
                 │ TRANSFORMATION│
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ LIVE PREVIEW  │
                 └───────────────┘
```

No unnecessary complexity.

No scattered tools.

Just a clean transformation workflow.

---

# ✨ Features

### 📝 Professional XML Editor

Write and edit XML with a developer-focused editing experience.

* Syntax highlighting
* Line numbers
* Code folding
* Indentation guides
* Bracket matching
* Search
* Formatting
* Copy to clipboard
* Current-line highlighting

---

### ⚡ XSLT Workspace

Create powerful XSLT transformations alongside your XML document.

* Dedicated XSLT editor
* Syntax highlighting
* XSLT templates
* XPath support
* Transformation workflow
* Error reporting

---

### 🔄 Live Transformation

Transform XML using your XSLT stylesheet and instantly see the result.

```text
XML
 │
 │  + XSLT
 ▼
TRANSFORMATION ENGINE
 │
 ▼
OUTPUT
```

The preview updates without requiring you to leave the workspace.

---

### 👁 Live Preview

View transformed HTML directly inside XML Studio.

The integrated preview provides a browser-like environment for inspecting the final result.

**Write → Transform → Preview**

All in one place.

---

### ✅ Validation

Catch XML problems before they become transformation problems.

Example:

```text
XML VALIDATION ERROR

Line 18 · Column 12

Unexpected closing tag:
</product>

Expected:
</catalog>

[ Jump to Error ]
```

Errors are presented directly inside the development workflow instead of through generic browser alerts.

---

### 📂 File Management

Import and work with:

```text
.xml
.xsl
.xslt
```

Drag and drop files directly into the workspace.

Project structure:

```text
my-project/
│
├── data.xml
├── transform.xsl
└── output.html
```

---

### 📦 Export

Export your work with a single click.

```text
↓ XML Document
↓ XSLT Stylesheet
↓ Transformed HTML
↓ Complete Project
```

---

### ⌘ Command Palette

Use the command center to quickly access common actions.

```text
⌘ / Ctrl + K

> New XML Document
> New XSLT Stylesheet
> Import XML
> Import XSLT
> Validate XML
> Validate XSLT
> Transform XML
> Format Document
> Copy Code
> Download XML
> Download XSL
> Download HTML
> Toggle Preview
> Toggle Sidebar
> Settings
```

---

# 🎨 Designed Like a Developer Tool

XML Studio isn't intended to look like another generic dashboard.

The interface is inspired by modern developer products while maintaining its own visual identity.

### Design principles

* Dark-first interface
* Premium typography
* Focused workspace
* Minimal visual noise
* Subtle motion
* High information density
* Clear hierarchy
* Keyboard-friendly workflows
* Responsive layouts
* Professional error states

The goal:

> **Powerful enough for developers. Beautiful enough to enjoy using.**

---

# 🖥 Interface

> Replace the screenshots below with screenshots of your application.

### Main Workspace

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ◈ XML STUDIO                         Validate  Transform  Export    │
├────────────┬───────────────────────────┬────────────────────────────┤
│            │                           │                            │
│ PROJECT    │       XML DOCUMENT        │       LIVE PREVIEW         │
│            │                           │                            │
│ data.xml   │  <catalog>               │   ┌────────────────────┐   │
│ transform  │    <product>             │   │                    │   │
│ output     │       ...                │   │  Transformed HTML  │   │
│            │  </catalog>              │   │                    │   │
│            │                           │   └────────────────────┘   │
│            │       XSLT                │                            │
│            │                           │                            │
├────────────┴───────────────────────────┴────────────────────────────┤
│ ✓ XML Valid       ✓ XSLT Ready                Ln 24  Col 18         │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 🚀 Getting Started

## Requirements

Make sure you have:

* Node.js 18+
* npm / pnpm / yarn
* A modern browser

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/xml-studio.git
```

Move into the project:

```bash
cd xml-studio
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

---

# 🛠 Tech Stack

XML Studio is built using modern frontend technologies.

| Technology                 | Purpose                     |
| -------------------------- | --------------------------- |
| React                      | UI framework                |
| TypeScript                 | Type-safe development       |
| Tailwind CSS               | Styling                     |
| Monaco Editor / CodeMirror | Code editing                |
| Lucide                     | Interface icons             |
| XML Parser                 | XML validation              |
| XSLT Engine                | XML transformation          |
| Vite                       | Development & build tooling |

---

# 🧩 Architecture

The application follows a modular architecture.

```text
src/
│
├── components/
│   ├── editor/
│   ├── preview/
│   ├── sidebar/
│   ├── toolbar/
│   ├── command-palette/
│   └── status-bar/
│
├── features/
│   ├── xml/
│   ├── xslt/
│   ├── transformation/
│   ├── validation/
│   └── export/
│
├── hooks/
│
├── lib/
│
├── types/
│
├── utils/
│
└── App.tsx
```

---

# ⌨️ Keyboard Shortcuts

| Shortcut                 | Action                         |
| ------------------------ | ------------------------------ |
| `Ctrl / Cmd + K`         | Open Command Palette           |
| `Ctrl / Cmd + S`         | Save                           |
| `Ctrl / Cmd + Enter`     | Transform XML                  |
| `Ctrl / Cmd + Shift + F` | Format Document                |
| `Ctrl / Cmd + P`         | Quick File Search              |
| `Ctrl / Cmd + B`         | Toggle Sidebar                 |
| `Ctrl / Cmd + Shift + V` | Toggle Preview                 |
| `Esc`                    | Close Dialog / Command Palette |

> Keyboard shortcuts may vary depending on the operating system and editor configuration.

---

# 🔄 Typical Workflow

### 01 — Create XML

```xml
<catalog>
    <product>
        <name>Professional Laptop</name>
        <price>1299</price>
    </product>
</catalog>
```

### 02 — Create XSLT

```xml
<xsl:template match="/">
    <html>
        <body>
            <h1>Products</h1>

            <xsl:for-each select="catalog/product">
                <p>
                    <xsl:value-of select="name"/>
                </p>
            </xsl:for-each>

        </body>
    </html>
</xsl:template>
```

### 03 — Transform

Click:

**Transform XML**

### 04 — Preview

The transformed output appears instantly in the integrated preview.

---

# 🧠 Design Philosophy

XML Studio follows three principles.

### Focus

Give developers the tools they need without unnecessary UI.

### Clarity

Make the relationship between XML, XSLT, and output obvious.

### Craft

Every interaction, spacing decision, animation, and component should feel intentional.

---

# 🌙 Themes

XML Studio is designed around a premium dark interface.

Planned theme support:

```text
◐ Dark
○ Light
○ System
```

The light theme will preserve the same visual hierarchy and design language rather than simply inverting colors.

---

# 📱 Responsive Experience

XML Studio is designed primarily for desktop development but adapts to smaller screens.

### Desktop

```text
Project │ XML / XSLT Workspace │ Preview
```

### Tablet

```text
Project
   ↓
Editor
   ↓
Preview
```

### Mobile

```text
Editor
   ↓
Preview
   ↓
Project
```

The interface prioritizes readability and usability rather than simply shrinking desktop components.

---

# 🔐 Privacy

XML Studio is designed with a **local-first workflow** for core editing and transformation functionality.

Your XML and XSLT documents should remain within your browser/session unless you explicitly choose to upload or connect them to an external service.

> Always review the implementation and deployment configuration before using XML Studio with sensitive data.

---

# 🗺 Roadmap

## Phase 1 — Foundation

* [x] XML editor
* [x] XSLT editor
* [x] Live preview
* [x] XML validation
* [x] File import
* [x] File export
* [x] Responsive interface

## Phase 2 — Developer Experience

* [ ] Advanced XPath assistance
* [ ] XML formatting
* [ ] XSLT formatting
* [ ] Command palette
* [ ] Keyboard shortcuts
* [ ] Multiple document tabs
* [ ] Improved diagnostics
* [ ] Search across project

## Phase 3 — Power Features

* [ ] XML schema support
* [ ] XSD validation
* [ ] Advanced transformation debugging
* [ ] Transformation history
* [ ] Project persistence
* [ ] Custom themes
* [ ] Workspace management

## Phase 4 — Advanced Tooling

* [ ] Multi-file projects
* [ ] Transformation pipelines
* [ ] Advanced XPath tooling
* [ ] Developer extensions
* [ ] Optional cloud workspace
* [ ] Collaboration features

---

# 🤝 Contributing

Contributions are welcome.

If you have an idea, improvement, bug fix, or feature proposal:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Make your changes
4. Commit your work

```bash
git commit -m "feat: add amazing feature"
```

5. Push the branch

```bash
git push origin feature/amazing-feature
```

6. Open a Pull Request

Please keep contributions focused, documented, and consistent with the existing design system.

---

# 🐛 Bug Reports

Found something that doesn't work?

Please open an issue with:

* Description
* Steps to reproduce
* Expected behavior
* Actual behavior
* Browser
* Operating system
* Screenshots if relevant
* Example XML/XSLT when possible

---

# 💡 Feature Requests

Have an idea?

Open a feature request and describe:

```text
Problem
   ↓
Proposed Solution
   ↓
Expected User Experience
   ↓
Possible Implementation
```

The more context you provide, the easier it is to evaluate the idea.

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

# ⭐ Support the Project

If XML Studio is useful to you:

⭐ Star the repository

🐛 Report bugs

💡 Suggest features

🔧 Submit improvements

📢 Share it with other developers

Every contribution helps improve the project.

---

# ◈ XML Studio

### Shape data. Transform logic. See the result.

```text
XML
 │
 ├──────────────┐
 │              │
 ▼              ▼
DATA          XSLT
 │              │
 └───────┬──────┘
         │
         ▼
    TRANSFORMATION
         │
         ▼
    LIVE PREVIEW
```

**Built for XML. Designed for developers. Crafted with precision.**

---

<p align="center">

**XML Studio** · XML / XSLT Workbench

Made with precision for developers who work with structured data.

</p>
