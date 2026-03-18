# Luka's nest 🌐

A sleek, high-performance personal technical blog and project portfolio built entirely with Vanilla JavaScript, HTML5, and CSS3. 

This hub serves as a central nexus for exploring technical documentation, AI, decentralized systems, and other development projects. It requires no complex build tools or backend servers, running completely client-side.

## 🎨 Styling Conventions: Liquid Glass x Aviary

The user interface was built from the ground up using a custom design system that merges two distinct aesthetic concepts:

* **Liquid Glass (Glassmorphism):** Structural elements utilize CSS `backdrop-filter: blur()` paired with highly transparent backgrounds and subtle semi-transparent borders. This creates a "frosted glass" effect that allows the dynamic, animated background gradients to shine through without sacrificing text legibility.
* **Aviary Layout:** The spatial design prioritizes a lightweight, "floating" feel. Using CSS Grid and Flexbox, elements are given ample padding and rounded corners. Box-shadows are kept soft, and an `IntersectionObserver` triggers smooth, cascading `transform: translateY()` scroll animations to make the UI feel alive as the user navigates.
* **Dynamic Theming:** CSS Custom Properties (`:root` variables) handle a seamless transition between Day Mode (vibrant, airy) and Night Mode (deep, high-contrast). User preferences are saved locally via `localStorage`.
* **Minimalist Iconography:** Employs the [Boxicons](https://boxicons.com/) library for clean, monochromatic, line-based UI icons.

## ⚙️ Core Functionalities

This project punches above its weight for a static site, utilizing various APIs and lightweight libraries to mimic a full-stack application:

* **Real-Time GitHub Synchronization:** The hub connects directly to the GitHub REST API on page load. It fetches, sorts (by recently updated), and renders public repositories dynamically.
* **Live Repository Search:** A client-side search bar instantly filters the fetched GitHub repositories by name and description.
* **Dynamic Markdown Parsing:** Technical documentation is written in pure `.md` files stored in a `/docs` directory. The hub uses `marked.js` to fetch and render these files as HTML asynchronously, meaning zero page-reloads are required to navigate the documentation.
* **Theme-Aware Syntax Highlighting:** Code blocks within the Markdown files are processed by `highlight.js`. The syntax color palette dynamically swaps between `atom-one-light` and `atom-one-dark` depending on the active global theme.
* **Integrated Discussions (Giscus):** The discussion section is powered by [Giscus](https://giscus.app/). Comments left on the site are securely mapped to the repository's native GitHub Discussions tab.
* **Floating Ambient Audio:** A custom, floating album player sits in the corner, gently rotating while playing background music. It features autoplay detection and a slide-in "Toast" notification to credit the artists.
* **Resilient Localization:** Incorporates a custom-styled Google Translate widget. If the Google script fails to load (due to regional restrictions or strict ad-blockers), the JavaScript catches the error and injects a fallback routing to Microsoft Bing Translator.
* **Analytics & Utilities:** Includes a live, to-the-second clock and a persistent page-visit counter utilizing a database-free counting API.

## 🚀 Local Development

Because this project uses the JavaScript `fetch()` API to load local Markdown files, it cannot be run by simply double-clicking the `index.html` file (due to browser CORS security policies). 

To run this locally:
1. Clone the repository.
2. Serve the directory using a local web server. 
   * *If using VS Code:* Install the "Live Server" extension and click "Go Live".
   * *If using Python:* Run `python -m http.server` in your terminal and navigate to `http://localhost:8000`.

## 📁 Repository Structure
```text
/
├── index.html        # Main application layout and glass panels
├── css/
│   └── style.css     # Theme variables, glassmorphism, and animations
├── js/
│   └── app.js        # API logic, markdown routing, and UI controllers
└── docs/             # Markdown files for technical documentation
    ├── overview.md
    └── ...
```

## ⚖️ License & Copyright

* **Source Code:** The HTML, CSS, JavaScript, and Markdown documentation in this repository are open-source and released under the [MIT License](LICENSE). 
* **Media Assets:** The background music (`Tropic Love` by Diviners feat. Contacreast) located in the `/misc/` directory is **NOT** covered by the MIT License. It is the copyrighted property of [NoCopyrightSounds (NCS)](https://ncs.io/) and is used strictly in accordance with their independent creator usage policy. Do not redistribute or use this audio file for commercial purposes without obtaining the proper rights from NCS.