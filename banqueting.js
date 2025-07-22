// Mobile menu toggle removed

// Back to top button
const backToTopButton = document.getElementById('back-to-top');
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});

backToTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Accordion functionality
function toggleTimeslot(slotId) {
    const content = document.getElementById(slotId);
    const icon = document.getElementById(slotId + '-icon');

    if (content) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
            content.classList.add('hidden');
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    }
}

// Read More functionality
function toggleDescription(slotId) {
    const shortText = document.getElementById(slotId + '-short');
    const fullText = document.getElementById(slotId + '-full');
    const toggle = document.getElementById(slotId + '-toggle');
    const content = document.getElementById(slotId);

    if (fullText.classList.contains('hidden')) {
        shortText.classList.add('hidden');
        fullText.classList.remove('hidden');
        toggle.textContent = 'Read Less';
    } else {
        shortText.classList.remove('hidden');
        fullText.classList.add('hidden');
        toggle.textContent = 'Read More';
    }

    // Recalculate max-height
    if (content && !content.classList.contains('hidden')) {
        setTimeout(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
        }, 10);
    }
}

// Add transition classes after page load
document.addEventListener('DOMContentLoaded', function () {
    const timeslotContents = document.querySelectorAll('.timeslot-content');
    timeslotContents.forEach(content => {
        // Remove any maxHeight/overflow styling for expanded state
        content.style.transition = '';
        content.style.overflow = '';
        content.style.maxHeight = '';
    });

    // Offcanvas modal logic
    function renderSpaceModal(data) {
        document.getElementById('space-offcanvas').innerHTML = `
            <div class="h-full flex flex-col">
                <div class="flex items-center justify-between p-8 border-b border-gray-200 bg-primary text-white">
                    <h3 class="text-2xl font-serif font-bold" data-i18n="banqueting.space_details">Ruimte Details</h3>
                    <button id="offcanvas-close" class="text-white hover:text-gray-200 transition-colors">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-8 space-y-8">
                    <div class="text-center">
                        <div class="w-full h-48 bg-gray-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-gray-200">
                            <img src="${data.cover || ''}" alt="${data.name || ''}" class="w-full h-full object-cover" width="336" height="192">
                        </div>
                        <h4 class="text-3xl font-serif font-bold text-gray-900 mb-3">${data.name || ''}</h4>
                        <p class="text-gray-600 text-base leading-relaxed text-balance">${data.description || ''}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-building mr-3 text-primary"></i>
                            <span data-i18n="banqueting.space_information">Ruimte Informatie</span>
                        </h5>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.time_label">Tijd:</span><span class="text-gray-900 font-bold">${data.time || '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.capacity_label">Capaciteit:</span><span class="text-gray-900 font-bold">${data.capacity || '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.layout_label">Opstelling:</span><span class="text-gray-900 font-bold">${data.layout || '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.amount_label">Aantal:</span><span class="text-gray-900 font-bold">${data.amount || '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.unit_price">Prijs per eenheid:</span><span class="text-gray-900 font-bold">${data.unitPrice || '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.total">Totaal:</span><span class="text-gray-900 font-bold">${data.total || '-'}</span></div>
                        </div>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-sticky-note mr-3 text-primary"></i>
                            <span data-i18n="banqueting.special_notes">Speciale opmerkingen</span>
                        </h5>
                        <div class="text-gray-700 text-base leading-relaxed">${data.notes ? `<div class='mb-2'><i class='fas fa-circle text-xs text-gray-400 mr-2'></i>${data.notes}</div>` : ''}</div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('space-offcanvas').classList.remove('translate-x-full');
        document.getElementById('offcanvas-backdrop').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.getElementById('offcanvas-close').onclick = closeOffcanvas;
    }
    function renderProductModal(data) {
        document.getElementById('space-offcanvas').innerHTML = `
            <div class="h-full flex flex-col">
                <div class="flex items-center justify-between p-8 border-b border-gray-200 bg-primary text-white">
                    <h3 class="text-2xl font-serif font-bold" data-i18n="banqueting.product_details">Product Details</h3>
                    <button id="offcanvas-close" class="text-white hover:text-gray-200 transition-colors">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-8 space-y-8">
                    <div class="text-center">
                        <div class="w-full h-48 bg-gray-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-gray-200">
                            <img src="${data.cover || ''}" alt="${data.name || ''}" class="w-full h-full object-cover" width="336" height="192">
                        </div>
                        <h4 class="text-3xl font-serif font-bold text-gray-900 mb-3">${data.name || ''}</h4>
                        <p class="text-gray-600 text-base leading-relaxed text-balance">${data.description || ''}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-clipboard-list mr-3 text-primary"></i>
                            <span data-i18n="banqueting.order_information">Bestelinformatie</span>
                        </h5>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.guest_type">Type Gast:</span><span class="text-gray-900 font-bold">${Array.isArray(data.guestTypes) && data.guestTypes.length ? data.guestTypes.map(gt => gt.type).join(', ') : '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.amount_label">Aantal:</span><span class="text-gray-900 font-bold">${Array.isArray(data.guestTypes) && data.guestTypes.length ? data.guestTypes.map(gt => gt.count).join(', ') : (data.amount || '-')}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.category">Categorie:</span><span class="text-gray-900 font-bold">${data.category || '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.location">Locatie:</span><span class="text-gray-900 font-bold">${data.location || '-'}</span></div>
                        </div>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-clock mr-3 text-primary"></i>
                            <span data-i18n="banqueting.time">Tijdstip</span>
                        </h5>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.start_time">Starttijd:</span><span class="text-gray-900 font-bold">${data.time ? data.time.split('-')[0].trim() : '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.end_time">Eindtijd:</span><span class="text-gray-900 font-bold">${data.time ? data.time.split('-')[1].trim() : '-'}</span></div>
                            <div class="flex justify-between items-center"><span class="text-gray-600 font-medium" data-i18n="banqueting.duration">Duur:</span><span class="text-gray-900 font-bold">-</span></div>
                        </div>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-sticky-note mr-3 text-primary"></i>
                            <span data-i18n="banqueting.special_notes">Speciale opmerkingen</span>
                        </h5>
                        <div class="text-gray-700 text-base leading-relaxed">${Array.isArray(data.notes) ? data.notes.map(note => `<div class='mb-2'><i class='fas fa-circle text-xs text-gray-400 mr-2'></i>${note}</div>`).join('') : (data.notes ? `<div class='mb-2'><i class='fas fa-circle text-xs text-gray-400 mr-2'></i>${data.notes}</div>` : '')}</div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('space-offcanvas').classList.remove('translate-x-full');
        document.getElementById('offcanvas-backdrop').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.getElementById('offcanvas-close').onclick = closeOffcanvas;
    }
    function closeOffcanvas() {
        document.getElementById('space-offcanvas').classList.add('translate-x-full');
        document.getElementById('offcanvas-backdrop').classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Modal event listeners for closing
    document.getElementById('offcanvas-backdrop').addEventListener('click', closeOffcanvas);

    // Escape key closes modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !document.getElementById('space-offcanvas').classList.contains('translate-x-full')) {
            closeOffcanvas();
        }
    });

    document.querySelectorAll('.space-row').forEach(row => {
        row.addEventListener('click', function () {
            const data = JSON.parse(this.getAttribute('data-space'));
            renderSpaceModal(data);
        });
    });
    document.querySelectorAll('.product-row').forEach(row => {
        row.addEventListener('click', function () {
            const data = JSON.parse(this.getAttribute('data-product'));
            renderProductModal(data);
        });
    });
});

// Read More functionality for event description
document.addEventListener('DOMContentLoaded', function () {
    const shortDesc = document.getElementById('event-desc-short');
    const fullDesc = document.getElementById('event-desc-full');
    const toggleBtn = document.getElementById('event-desc-toggle');
    if (shortDesc && fullDesc && toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            const expanded = fullDesc.classList.contains('hidden') === false;
            if (expanded) {
                fullDesc.classList.add('hidden');
                shortDesc.classList.remove('hidden');
                toggleBtn.textContent = 'Read More';
            } else {
                fullDesc.classList.remove('hidden');
                shortDesc.classList.add('hidden');
                toggleBtn.textContent = 'Read Less';
            }
        });
    }
});
