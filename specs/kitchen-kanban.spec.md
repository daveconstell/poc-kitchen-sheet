# Kitchen Kanban Specification

## Feature: Kitchen Production Kanban Board

As a kitchen manager
I want to organize and track production tasks using a kanban board
So that I can efficiently manage kitchen workflow and track progress

### Background:

Given I am on the kitchen kanban page
And production data is loaded

### Scenario: Viewing event details

Given I am on the kitchen kanban page
Then I should see the event details section
And it should display information about the event
Including status, event name, event type, dates, and contacts

### Scenario: Switching between table and kanban views

Given I am on the kitchen kanban page
When I click on the "Tabelweergave" button
Then I should see the table view of production tasks
And when I click on the "Kanbanweergave" button
Then I should see the kanban board view of production tasks

### Scenario: Viewing production tasks in table view

Given I am on the kitchen kanban page
And I am in table view
Then I should see a list of production tasks
And each task should display product name, time, status, and guest information

### Scenario: Viewing production tasks in kanban view

Given I am on the kitchen kanban page
And I am in kanban view
Then I should see columns for "Pending", "In Progress", and "Ready" statuses
And I should see task cards in each column
And each column should display a count of tasks

### Scenario: Toggling full view mode

Given I am on the kitchen kanban page
When I toggle the "Full View" switch
Then the display format should change to show more details
And my preference should be saved for future sessions

### Scenario: Dragging tasks between columns in kanban view

Given I am on the kitchen kanban page
And I am in kanban view
When I drag a task card from one column to another
Then the task should move to the new column
And the task's status should be updated accordingly
And the column counts should update

### Scenario: Filtering tasks by category

Given I am on the kitchen kanban page
When I select a category from the category filter dropdown
Then I should only see tasks of the selected category
And tasks of other categories should be hidden

### Scenario: Filtering tasks by guest type

Given I am on the kitchen kanban page
When I select a guest type from the guest type filter dropdown
Then I should only see tasks for the selected guest type
And tasks for other guest types should be hidden

### Scenario: Filtering tasks by space

Given I am on the kitchen kanban page
When I select a space from the space filter dropdown
Then I should only see tasks for the selected space
And tasks for other spaces should be hidden

### Scenario: Filtering tasks by status

Given I am on the kitchen kanban page
When I select a status from the status filter dropdown
Then I should only see tasks with the selected status
And tasks with other statuses should be hidden

### Scenario: Viewing task details

Given I am on the kitchen kanban page
When I click on a task card
Then a modal should open showing detailed information about the task
Including product image, description, guest information, timing, and notes

### Scenario: Updating task status from the modal

Given I am viewing a task's details in the modal
When I click on a status button (Pending, In Progress, or Ready)
Then the task's status should be updated
And the task should move to the appropriate column in kanban view
And the status indicator should update in table view

### Scenario: Viewing empty state when no tasks match filters

Given I am on the kitchen kanban page
When I apply filters that no tasks match
Then I should see an empty state message
And the message should indicate no items were found

### Scenario: Responsive layout on mobile devices

Given I am on the kitchen kanban page
When I view the page on a mobile device
Then the layout should adapt to the smaller screen
And all functionality should remain accessible
