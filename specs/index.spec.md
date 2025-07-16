# Event Dashboard Specification

## Feature: Event Dashboard

As an event manager
I want to view and manage all events in a dashboard
So that I can efficiently organize and track event details

### Background:

Given I am on the event dashboard page
And sample event data is loaded

### Scenario: Viewing all events

Given I am on the event dashboard
Then I should see a list of event cards
And each card should display basic event information
And each card should have an expand/collapse button

### Scenario: Expanding event details

Given I am on the event dashboard
When I click on an event card header
Then the card should expand to show additional details
And I should see the event's spaces and products
And the arrow icon should rotate 180 degrees

### Scenario: Collapsing event details

Given I am viewing an expanded event card
When I click on the event card header
Then the card should collapse to show only basic information
And the arrow icon should rotate back to its original position

### Scenario: Filtering events by status

Given I am on the event dashboard
When I select a status from the status filter dropdown
Then I should only see events with the selected status
And events with other statuses should be hidden

### Scenario: Filtering events by event type

Given I am on the event dashboard
When I select an event type from the type filter dropdown
Then I should only see events of the selected type
And events of other types should be hidden

### Scenario: Filtering events by search term

Given I am on the event dashboard
When I enter a search term in the search box
Then I should only see events with names matching the search term
And the search results should update in real-time

### Scenario: Viewing empty state when no events match filters

Given I am on the event dashboard
When I apply filters that no events match
Then I should see an empty state message
And the message should indicate no events were found

### Scenario: Navigating to banqueting sheet

Given I am on the event dashboard
When I expand an event card
And I click on the "Banqueting" button
Then I should be taken to the banqueting sheet for that event

### Scenario: Navigating to kitchen view

Given I am on the event dashboard
When I expand an event card
And I click on the "Keukenweergave" button
Then I should be taken to the kitchen view for that event

### Scenario: Responsive layout on mobile devices

Given I am on the event dashboard
When I view the page on a mobile device
Then the layout should adapt to the smaller screen
And all functionality should remain accessible
