# Styling Plan for Kitchen Sheet

This document outlines the styling architecture and plan for the Kitchen Sheet application.

## Objective

The primary goal is to refactor the application's styling to be more maintainable, consistent, and scalable by centralizing the styling logic.

## Core Technologies

- **Tailwind CSS**: The application uses Tailwind CSS via its CDN for rapid UI development with utility classes.
- **Custom CSS**: A minimal custom stylesheet is used for styles that are difficult or impossible to implement with Tailwind utilities alone.

## Configuration Strategy

1.  **Centralized Configuration**: A single `tailwind.config.js` file is the source of truth for all styling customizations. This includes:

    - **Fonts**: `Playfair Display` (serif) and `Open Sans` (sans-serif).
    - **Colors**: Custom primary (`#7C9286`) and secondary (`#E5AEA1`) colors and their variants.
    - **Animations**: Custom `fadeIn` and `slideInRight` keyframe animations.
    - **Other Extensions**: Any other theme extensions like `maxWidth`.

2.  **Browser Compatibility**: The `tailwind.config.js` is written to be browser-compatible. Instead of using `module.exports`, it assigns the configuration object directly to `tailwind.config`.

3.  **Loading**:
    - The Tailwind CSS library is loaded from the CDN.
    - The `tailwind.config.js` file is loaded as a script in each HTML page _before_ the main Tailwind script, allowing the CDN build to pick up the custom configuration.

## File Structure

```
.
├── index.html
├── kitchen-kanban.html
├── banquete.html
├── tailwind.config.js
└── style.css
```

## Implementation Summary

- The inline style configurations have been removed from all HTML files.
- All pages now link to the central `tailwind.config.js` and `style.css` files.
- This creates a single, unified styling system across the entire application.
