# Banquete Sheet Specification

## Feature: Banqueting Event Planning Sheet

As an event planner
I want to view detailed event plans with spaces and products
So that I can organize events efficiently and track all necessary details

### Background:

Given I am on the banquete sheet page
And sample event data is loaded

### Scenario: Viewing event summary

Given I am on the banquete sheet
Then I should see the summary section
And it should display total hours, spaces, products, and max guests
And it should show financial summary information

### Scenario: Viewing event details

Given I am on the banquete sheet
Then I should see the event details section
And it should display information about the event
Including status, event name, event type, dates, and contacts

### Scenario: Viewing program information

Given I am on the banquete sheet
Then I should see the program section
And it should display day and timeslot information
And each timeslot should be collapsible

### Scenario: Expanding a timeslot

Given I am on the banquete sheet
When I click on a timeslot header
Then the timeslot content should expand
And I should see spaces and products for that timeslot

### Scenario: Collapsing a timeslot

Given I am on the banquete sheet
And I am viewing an expanded timeslot
When I click on the timeslot header
Then the timeslot content should collapse

### Scenario: Using the "Read More" functionality

Given I am on the banquete sheet
And I am viewing an expanded timeslot with a description
When I click on "Read More"
Then I should see the full description
And when I click on "Read Less"
Then I should see the shortened description

### Scenario: Viewing space details

Given I am on the banquete sheet
When I click on a space row in a timeslot
Then a modal should open showing detailed information about the space
Including image, description, capacity, layout, and pricing

### Scenario: Viewing product details

Given I am on the banquete sheet
When I click on a product row in a timeslot
Then a modal should open showing detailed information about the product
Including image, description, guest types, category, and timing

### Scenario: Using the back-to-top button

Given I am on the banquete sheet
And I have scrolled down the page
Then the back-to-top button should appear
And when I click the back-to-top button
Then the page should scroll back to the top

### Scenario: Navigating to the home page

Given I am on the banquete sheet
When I click on the home icon in the navigation
Then I should be taken to the event dashboard

### Scenario: Responsive layout on mobile devices

Given I am on the banquete sheet
When I view the page on a mobile device
Then the layout should adapt to the smaller screen
And all functionality should remain accessible
