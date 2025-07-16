/**
 * Kitchen Sheet - Common JavaScript Functions
 * Contains shared functionality used across multiple pages
 */

/**
 * Toggles the mobile menu visibility
 */
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}

/**
 * Initializes the mobile menu toggle button
 */
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
  }
}

/**
 * Enables smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initialize all common functionality
 */
function initCommon() {
  // Initialize mobile menu
  initMobileMenu();

  // Initialize smooth scrolling
  initSmoothScrolling();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initCommon);
