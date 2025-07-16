# Kitchen Sheet - Development Guide

## Build & Run Commands

- **Serve locally**: `python3 -m http.server 8000` or `npx serve .`
- **Open browser**: Navigate to `http://localhost:8000/index.html`
- **No build process**: Static HTML/CSS/JS files
- **Test single page**: Open any `.html` file directly in browser

## Architecture Overview

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS via CDN, custom CSS variables
- **Icons**: Font Awesome 6.5.2
- **Fonts**: Google Fonts (Playfair Display, Open Sans)
- **State**: Client-side only, no backend

## Project Structure

```
kitchen-sheet/
├── index.html          # Main event dashboard
├── index.js           # Dashboard JavaScript
├── kitchen-kanban.html # Kitchen production view
├── kitchen-kanban.js  # Kitchen kanban logic
├── banquete.html      # Banqueting sheet
├── .gitignore
└── twig/              # Empty directory
```

## Key Features

- **Event Dashboard**: Filterable event cards with expandable details
- **Kitchen Kanban**: Drag-drop production management (SortableJS)
- **Banquete Sheet**: Detailed event planning with spaces/products
- **Responsive**: Mobile-first design with breakpoints
- **Dutch**: All UI text in Dutch language

## Code Style Guidelines

- **Naming**: camelCase for variables/functions, kebab-case for CSS classes
- **Indentation**: 2 spaces for HTML/JS, 4 spaces for CSS
- **Quotes**: Double quotes for HTML attributes, single for JS strings
- **Comments**: Use `//` for JS, `<!-- -->` for HTML
- **Error Handling**: Use try-catch for data parsing, graceful fallbacks

## CSS Conventions

- **Colors**: Primary (#7C9286), Secondary (#E5AEA1)
- **Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (1024px+)
- **Animations**: CSS transitions (0.3s ease), fadeIn keyframes
- **Spacing**: Tailwind spacing scale (p-4, m-2, etc.)

## JavaScript Patterns

- **DOM Ready**: `document.addEventListener('DOMContentLoaded', ...)`
- **Event Delegation**: Use `addEventListener` on parent elements
- **Data Attributes**: Store state in `data-*` attributes
- **Local Storage**: Persist user preferences (full view toggle)
- **Modals**: Off-canvas sliding panels with backdrop

## Testing Approach

- **Manual Testing**: Open each page in browser
- **Responsive**: Test mobile (375px), tablet (768px), desktop (1440px)
- **Functionality**: Test filters, modals, drag-drop, animations
- **Data**: Verify sample data loads correctly in all views

## Development Workflow

1. Edit files directly in text editor
2. Save and refresh browser
3. Test responsive behavior
4. Check console for JavaScript errors
5. Validate HTML with W3C validator
6. Test all interactive features
