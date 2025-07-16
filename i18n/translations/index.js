/**
 * Kitchen Sheet - Translations Index
 * Exports all translation files
 */

// Import individual translation files
import './en.js';
import './nl.js';

// Export a function to get all available languages
window.getAvailableLanguages = function() {
  return [
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];
};
