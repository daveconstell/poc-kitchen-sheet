document.addEventListener('DOMContentLoaded', function () {
    // Apply background images from data attributes
    document.querySelectorAll('[data-bg-url]').forEach(element => {
        const bgUrl = element.getAttribute('data-bg-url');
        if (bgUrl) {
            element.style.backgroundImage = `url('${bgUrl}')`;
        }
    });

    // Staggered fade-in animation for event cards
    const allEventCards = document.querySelectorAll('.event-card');
    allEventCards.forEach((card, index) => {
        card.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;
    });

    // Event card toggle logic (no checkbox)
    document.querySelectorAll('.event-card-header').forEach(header => {
        header.addEventListener('click', function () {
            const card = header.closest('.event-card');
            const content = card.querySelector('.event-card-content');
            const arrow = card.querySelector('.event-card-arrow');
            const isOpen = card.classList.contains('open');
            
            if (isOpen) {
                // Close the card
                card.classList.remove('open');
                content.classList.remove('event-card-content--open');
                
                // Reset height to 0 after a brief delay to allow for animation
                setTimeout(() => {
                    content.style.height = '0';
                }, 50);
                
                if (arrow) arrow.style.transform = '';
            } else {
                // Open the card
                card.classList.add('open');
                
                // Set height to auto to calculate the full height
                content.style.height = 'auto';
                const height = content.scrollHeight;
                
                // Reset height to 0 and force a reflow
                content.style.height = '0';
                content.offsetHeight; // Force reflow
                
                // Add the open class and set the calculated height
                content.classList.add('event-card-content--open');
                content.style.height = height + 'px';
                
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                
                // Smooth scroll to the card on mobile only
                if (window.innerWidth < 768) {
                    setTimeout(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        });
    });

    // Filter logic
    const searchBox = document.getElementById('search-box');
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    const eventGroups = document.querySelectorAll('.event-group');
    const emptyState = document.getElementById('empty-state');

    function filterEvents() {
        const searchTerm = searchBox.value.toLowerCase();
        const statusValue = statusFilter.value;
        const typeValue = typeFilter.value;
        let anyEventVisible = false;

        eventGroups.forEach(group => {
            let groupHasVisibleCards = false;
            const eventCards = group.querySelectorAll('.event-card');

            eventCards.forEach(card => {
                const eventNameElement = card.querySelector('.event-name');
                if (eventNameElement) {
                    const eventName = eventNameElement.textContent.toLowerCase();
                    const eventStatus = card.dataset.status;
                    const eventType = card.dataset.type;

                    const matchesSearch = eventName.includes(searchTerm);
                    const matchesStatus = statusValue === 'all' || eventStatus === statusValue;
                    const matchesType = typeValue === 'all' || eventType === typeValue;

                    if (matchesSearch && matchesStatus && matchesType) {
                        card.style.display = '';
                        groupHasVisibleCards = true;
                        anyEventVisible = true;
                    } else {
                        card.style.display = 'none';
                    }
                }
            });

            if (groupHasVisibleCards) {
                group.style.display = '';
            } else {
                group.style.display = 'none';
            }
        });

        if (emptyState) {
            if (anyEventVisible) {
                emptyState.classList.add('hidden');
            } else {
                emptyState.classList.remove('hidden');
            }
        }
    }

    if (searchBox) {
        searchBox.addEventListener('input', filterEvents);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterEvents);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterEvents);
    }
});
