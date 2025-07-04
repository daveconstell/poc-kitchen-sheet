document.addEventListener('DOMContentLoaded', function () {
    // Remove chat code and implement event card toggle using click

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
                card.classList.remove('open');
                content.style.maxHeight = '0';
                if (arrow) arrow.style.transform = '';
            } else {
                card.classList.add('open');
                content.style.maxHeight = content.scrollHeight + 'px';
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                card.scrollIntoView({ behavior: 'smooth', block: 'start' });
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