# Common Functionality Specification

## Feature: Common Application Features

As a user of the kitchen sheet application
I want consistent navigation and UI elements across all pages
So that I can efficiently use the application with a familiar experience

### Background:

Given I am using the kitchen sheet application
And I have access to all features

### Scenario: Header consistency

Given I am on any page in the application
Then I should see a consistent header with the logo
And the header should have the same height and styling across all pages

### Scenario: Navigation to home page

Given I am on the kitchen kanban or banquete sheet page
When I click on the home icon in the navigation
Then I should be taken to the event dashboard

### Scenario: Mobile menu functionality

Given I am on any page in the application
And I am viewing on a mobile device
When I click the mobile menu button
Then the mobile menu should expand
And when I click the mobile menu button again
Then the mobile menu should collapse

### Scenario: Language consistency

Given I am on any page in the application
Then all UI text should be in Dutch
And all dates should be formatted according to Dutch standards
And all currency values should be formatted according to Dutch standards

### Scenario: Color scheme consistency

Given I am on any page in the application
Then the color scheme should be consistent
And the primary color should be #7C9286
And the secondary color should be #E5AEA1

### Scenario: Font consistency

Given I am on any page in the application
Then the fonts should be consistent
And headings should use Playfair Display
And body text should use Open Sans

### Scenario: Icon consistency

Given I am on any page in the application
Then icons should be consistent
And all icons should be from Font Awesome 6.5.2

### Scenario: Page header banner consistency

Given I am on any page in the application
Then I should see a consistent page header banner
With a background image, overlay, and page title
And a descriptive subtitle

### Scenario: Responsive behavior

Given I am on any page in the application
When I resize the browser window
Then the layout should adapt appropriately
And all functionality should remain accessible at all screen sizes
