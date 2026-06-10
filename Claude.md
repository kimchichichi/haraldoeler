# Claude.md

## Role
Act as a **Senior Frontend Developer** and **UI/UX Designer**.

---

## Task
Create a new selected HTML file by extracting the design language, CSS framework implementation, and layout components from `Projekte.html`.

---

## Requirements

### 1. Design Parity
Use the **exact same `<head>` configuration** found in `Projekte.html`, including:
- All `<meta>` tags (charset, viewport, description, etc.)
- Google Fonts `<link>` imports
- Bootstrap and/or Tailwind CDN `<link>` and `<script>` tags
- Any additional CSS framework or icon library links (e.g. Font Awesome, Bootstrap Icons)
- Replicate all custom CSS classes, CSS variables, and utility overrides defined in `Projekte.html`

### 2. Structure
- **Navigation Bar** — Retain the navbar exactly as it appears in `Projekte.html`:
  - Same logo / brand element
  - Same nav links and ordering
  - Same responsive collapse behaviour (hamburger menu, breakpoints)
  - Same CSS classes and inline styles
- **Footer** — Retain the footer exactly as it appears in `Projekte.html`:
  - Same column layout and content blocks
  - Same social links, copyright text, and spacing
  - Same CSS classes and inline styles

### 3. Layout Components
Extract and reuse the following design tokens and components from `Projekte.html`:
- Color palette (primary, secondary, accent, background, text)
- Typography scale (font families, sizes, weights, line-heights)
- Spacing system (margin/padding classes or CSS custom properties)
- Card components and grid layout patterns
- Button styles and interactive states (hover, focus, active)
- Any animation or transition classes

---

## Deliverable
A clean, valid HTML file that:
1. Passes W3C validation with no errors
2. Is fully responsive across mobile, tablet, and desktop breakpoints
3. Contains **placeholder `<main>` content** clearly marked with `<!-- PAGE CONTENT HERE -->` so new page-specific content can be inserted
4. Preserves all CDN links and does **not** inline or bundle external libraries
5. Includes comments indicating which sections were extracted from `Projekte.html`

---

## Workflow
```
1. Read Projekte.html in full
2. Extract <head> block verbatim
3. Extract <nav> block verbatim
4. Extract <footer> block verbatim
5. Identify and document the CSS design tokens
6. Assemble the new file with the extracted blocks + placeholder <main>
7. Validate structure and class consistency
8. Output the final HTML file
```

---

## Notes
- Do **not** modify the navbar or footer markup — fidelity to the source is required.
- If `Projekte.html` uses a CSS preprocessor output (e.g. compiled Tailwind), replicate only the utility classes present in the file.
- If custom JavaScript is tied to the navbar (e.g. scroll behaviour, active-link highlighting), carry it over into a `<script>` block at the bottom of the new file.
