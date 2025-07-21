/**
 * Kitchen Sheet - i18n Configuration
 * Handles internationalization using i18next
 */

// Initialize i18next
function initI18n() {
  // Default language is Dutch (nl)
  const defaultLanguage = 'nl';

  // Get saved language from localStorage or use default
  const savedLanguage = localStorage.getItem('kitchen-sheet-language') || defaultLanguage;

  // Initialize i18next
  return i18next.init({
    lng: savedLanguage,
    fallbackLng: defaultLanguage,
    debug: false,
    resources: {
      nl: window.translations_nl || {},
      en: window.translations_en || {},
      de: window.translations_de || {}
    }
  });
}

/**
 * Changes the application language
 * @param {string} language - The language code to switch to (e.g., 'nl', 'en')
 * @returns {Promise} - Promise that resolves when language is changed
 */
function changeLanguage(language) {
  // Save language preference to localStorage
  localStorage.setItem('kitchen-sheet-language', language);

  // Change language in i18next
  return i18next.changeLanguage(language).then(() => {
    // Update all elements with data-i18n attribute
    updateContent();

    // Dispatch custom event for components that need to react to language change
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
  });
}

/**
 * Updates all content with translations based on data-i18n attributes
 */
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      // Handle elements with HTML content
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = i18next.t(key);
      } else {
        element.textContent = i18next.t(key);
      }
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (key) {
      element.placeholder = i18next.t(key);
    }
  });

  // Update titles/tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    if (key) {
      element.title = i18next.t(key);
    }
  });
}

/**
 * Creates and adds the language switcher to the page
 */
function addLanguageSwitcher() {
  // Create language switcher container
  const switcher = document.createElement('div');

  // Find the header container with the specified classes
  const headerContainer = document.querySelector('.flex.justify-between.items-center.h-\\[124px\\]');

  if (headerContainer) {
    // If we found the header container, we'll add the switcher there
    switcher.className = 'flex items-center language-switcher';

    // Create language dropdown
    const dropdown = document.createElement('select');
    dropdown.className = 'p-2 text-black rounded-md language-dropdown bg-white/20';

    // Get available languages from the global function
    const languages = window.getAvailableLanguages();

    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = `${lang.flag} ${lang.code.toUpperCase()}`;
      if (lang.code === i18next.language) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    });

    // Add change event to switch languages
    dropdown.addEventListener('change', (e) => {
      const newLang = e.target.value;
      changeLanguage(newLang);
    });

    switcher.appendChild(dropdown);
    headerContainer.appendChild(switcher);
  } else {
    // Fallback to the original fixed position if header container not found
    switcher.className = 'fixed z-50 p-2 border border-gray-200 rounded-full shadow-lg language-switcher top-4 right-4 bg-white/80 backdrop-blur-sm';

    // Create language dropdown
    const dropdown = document.createElement('select');
    dropdown.className = 'p-2 text-black rounded-md language-dropdown bg-white/20';

    // Get available languages from the global function
    const languages = window.getAvailableLanguages();

    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = `${lang.flag} ${lang.code.toUpperCase()}`;
      if (lang.code === i18next.language) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    });

    // Add change event to switch languages
    dropdown.addEventListener('change', (e) => {
      const newLang = e.target.value;
      changeLanguage(newLang);
    });

    switcher.appendChild(dropdown);
    document.body.appendChild(switcher);
  }
}

/**
 * Initialize i18n when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load i18next library dynamically if not already loaded
  if (typeof i18next === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/i18next@latest/i18next.min.js';
    script.onload = () => {
      initI18n().then(() => {
        updateContent();
        addLanguageSwitcher();
      });
    };
    document.head.appendChild(script);
  } else {
    initI18n().then(() => {
      updateContent();
      addLanguageSwitcher();
    });
  }
});

// Export functions for use in other modules
window.i18nUtils = {
  changeLanguage,
  updateContent,
  t: (key) => i18next.t(key)
};
