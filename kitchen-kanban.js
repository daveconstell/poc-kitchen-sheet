import { orderData } from './orders.js';

// View switching
const tableViewBtn = document.getElementById("tableViewBtn");
const kanbanViewBtn = document.getElementById("kanbanViewBtn");
const tableView = document.getElementById("tableView");
const kanbanView = document.getElementById("kanbanView");

// Filter elements
const categoryFilter = document.getElementById("categoryFilter");
const guestTypeFilter = document.getElementById("guestTypeFilter");
const spaceFilter = document.getElementById("spaceFilter");
const statusFilter = document.getElementById("statusFilter");
const tableBody = document.getElementById("ordersTableBody");

// Current view state
let currentView = "table";
let currentProductId = null;

// Helper function to find order by ID
function findOrderById(id) {
  return orderData.find(order => order.id === id);
}

// Helper function to find order index by ID
function findOrderIndexById(id) {
  return orderData.findIndex(order => order.id === id);
}

// Modal functionality
const productModal = document.getElementById("productModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModal");
const modalStatusSelect = document.getElementById("modalStatusSelect");

function openProductModal(productId) {
  currentProductId = productId;
  const order = findOrderById(productId);
  
  if (!order) return;

  console.log("Opening product modal for order:", order);

  // Parse time for start/end/duration
  let start = '-', end = '-', duration = '-';
  if (order.time && order.time.includes('–')) {
    [start, end] = order.time.split('–').map(t => t.trim());
    try {
      const d1 = new Date(`2000-01-01T${start}`);
      const d2 = new Date(`2000-01-01T${end}`);
      duration = Math.round((d2 - d1) / (1000 * 60)) + ' minutes';
    } catch {}
  }

  // Notes as bullet points
  let notesHtml = '';
  if (order.notes) {
    if (Array.isArray(order.notes)) {
      notesHtml = order.notes.map(note => `<div class='mb-2'><i class="fas fa-circle text-xs text-gray-400 mr-2"></i>${note}</div>`).join('');
    } else if (typeof order.notes === 'string' && order.notes.includes('.')) {
      notesHtml = order.notes.split('.').filter(Boolean).map(note => `<div class='mb-2'><i class="fas fa-circle text-xs text-gray-400 mr-2"></i>${note.trim()}.</div>`).join('');
    } else {
      notesHtml = `<div class='mb-2'><i class="fas fa-circle text-xs text-gray-400 mr-2"></i>${order.notes}</div>`;
    }
  }

  // Status badge color
  let statusClass = 'bg-blue-200 text-blue-800';
  if (order.status === 'Ready') statusClass = 'bg-green-200 text-green-800';
  else if (order.status === 'In Progress') statusClass = 'bg-yellow-200 text-yellow-800';

  // Modal HTML (template with dynamic data)
  productModal.innerHTML = `
    <div class="h-full flex flex-col">
      <div class="flex items-center justify-between p-8 border-b-2 border-gray-200 bg-primary text-white">
        <h3 class="text-2xl font-serif font-bold">Product Details</h3>
        <button id="closeModal" class="text-white hover:text-gray-200 transition-colors">
          <i class="fas fa-times text-2xl"></i>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-8 space-y-8">
        <div class="text-center">
          <div class="w-full h-48 bg-gray-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden border-2 border-gray-200">
            <img id="productImage" src="${order.image || ''}" alt="${order.product || order.name || ''}" class="w-full h-full object-cover" width="336" height="192">
          </div>
          <h4 id="productTitle" class="text-3xl font-serif font-bold text-gray-900 mb-3">${order.product || order.name || ''}</h4>
          
          <!-- Status Toggle Group Buttons -->
          <div class="flex justify-center mt-4 mb-8">
            <button id="statusPendingBtn" class="px-6 py-3 flex-1 rounded-l-lg bg-gray-300 text-gray-700 data-[active=true]:bg-blue-500 data-[active=true]:text-white font-semibold text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-md">
              <i class="fas fa-clock mr-2"></i>Pending
            </button>
            <button id="statusProgressBtn" class="px-6 py-3 flex-1 bg-gray-300 text-gray-700 data-[active=true]:bg-yellow-500 data-[active=true]:text-white font-semibold text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-md">
              <i class="fas fa-spinner mr-2"></i>In Progress
            </button>
            <button id="statusReadyBtn" class="px-6 py-3 flex-1 rounded-r-lg bg-gray-300 text-gray-700 data-[active=true]:bg-emerald-500 data-[active=true]:text-white font-semibold text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-md">
              <i class="fas fa-check mr-2"></i>Ready
            </button>
          </div>
          
          <p id="productDescription" class="text-gray-600 text-base leading-relaxed text-balance">${order.description || ''}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fas fa-clipboard-list mr-3 text-primary"></i>
            Bestelinformatie
          </h5>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Aantal/Type Gast:</span>
              <span id="modalGuestType" class="text-gray-900 font-bold">${order.guestType || '-'} (${order.quantity || order.amount || '-'})</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Categorie:</span>
              <span id="modalCategory" class="text-gray-900 font-bold">${order.category || '-'}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Locatie:</span>
              <span id="modalSpace" class="text-gray-900 font-bold">${order.space || order.location || '-'}</span>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fas fa-clock mr-3 text-primary"></i>
            Tijdstip
          </h5>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Starttijd:</span>
              <span id="modalStartTime" class="text-gray-900 font-bold">${start}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Eindtijd:</span>
              <span id="modalEndTime" class="text-gray-900 font-bold">${end}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Duur:</span>
              <span id="modalDuration" class="text-gray-900 font-bold">${duration}</span>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fas fa-sticky-note mr-3 text-primary"></i>
            Speciale opmerkingen
          </h5>
          <div id="modalNotes" class="text-gray-700 text-base leading-relaxed">${notesHtml}</div>
        </div>
      </div>
    </div>
  `;

  // Show modal
  modalOverlay.classList.remove("pointer-events-none", "opacity-0");
  modalOverlay.classList.add("opacity-100");
  productModal.classList.remove("translate-x-full");
  productModal.classList.add("translate-x-0");
  document.body.style.overflow = "hidden";

  // Attach close and status update events
  document.getElementById('closeModal').onclick = closeProductModal;
  
  // Attach status button events
  document.getElementById('statusPendingBtn').onclick = function() {
    updateProductStatus('Pending');
  };
  document.getElementById('statusProgressBtn').onclick = function() {
    updateProductStatus('In Progress');
  };
  document.getElementById('statusReadyBtn').onclick = function() {
    updateProductStatus('Ready');
  };

// Set initial active status button
const pendingBtn = document.getElementById('statusPendingBtn');
const progressBtn = document.getElementById('statusProgressBtn');
const readyBtn = document.getElementById('statusReadyBtn');

// Reset all buttons
pendingBtn.classList.remove('bg-blue-500', 'text-white');
progressBtn.classList.remove('bg-yellow-500', 'text-white');
readyBtn.classList.remove('bg-emerald-500', 'text-white');

pendingBtn.removeAttribute('data-active');
progressBtn.removeAttribute('data-active');
readyBtn.removeAttribute('data-active');

// Set active button based on updated product status
const updatedStatus = order.status;
if (updatedStatus === "Pending") {
  pendingBtn.classList.add('bg-blue-500', 'text-white');
  pendingBtn.setAttribute('data-active', 'true');
} else if (updatedStatus === "In Progress") {
  progressBtn.classList.add('bg-yellow-500', 'text-white');
  progressBtn.setAttribute('data-active', 'true');
} else if (updatedStatus === "Ready") {
  readyBtn.classList.add('bg-emerald-500', 'text-white');
  readyBtn.setAttribute('data-active', 'true');
}
}

function closeProductModal() {
  modalOverlay.classList.add("pointer-events-none", "opacity-0");
  modalOverlay.classList.remove("opacity-100");
  productModal.classList.add("translate-x-full");
  productModal.classList.remove("translate-x-0");

  // Restore body scroll
  document.body.style.overflow = "";
  currentProductId = null;
}

function updateProductStatus(newStatus) {
  if (!currentProductId) return;

  const order = findOrderById(currentProductId);
  if (!order) return;

  // Update the order data
  order.status = newStatus;

  // Update table view
  const orderIndex = findOrderIndexById(currentProductId);
  if (orderIndex !== -1) {
    updateTableRowStatus(orderIndex, newStatus);
  }

  // Update kanban view if visible
  if (currentView === "kanban") {
    populateKanbanView();
  } else {
    // Update counts even if not in kanban view
    updateKanbanCounts();
  }

  // Reopen the modal to reflect the new status
  openProductModal(currentProductId);
}


function initializeTableView() {
  tableBody.innerHTML = ""; // Clear existing cards
  const tableEmptyState = document.getElementById("tableEmptyState");
  
  // Check if there are any items to display
  if (orderData.length === 0) {
    tableEmptyState.classList.remove("hidden");
    tableEmptyState.classList.add("flex");
    return; // No items to display
  } else {
    tableEmptyState.classList.add("hidden");
    tableEmptyState.classList.remove("flex");
  }

  orderData.forEach((order, index) => {
    // Create card container
    const card = document.createElement("div");
    card.className = "bg-white border-t border-gray-200 transition-colors duration-200 overflow-hidden border-l-0 border-r-0";
    
    card.setAttribute("data-order-index", index);

    // Status badge color and icon
    let statusClass = 'bg-blue-100 text-blue-800';
    let statusIcon = '<i class="fas fa-clock mr-2"></i>';
    
    if (order.status === 'Ready') {
      statusClass = 'bg-emerald-100 text-emerald-800';
      statusIcon = '<i class="fas fa-check mr-2"></i>';
    } else if (order.status === 'In Progress') {
      statusClass = 'bg-yellow-100 text-yellow-800';
      statusIcon = '<i class="fas fa-spinner fa-spin mr-2"></i>';
    }

    // Split time for display
    const [startTime, endTime] = order.time.split("–").map(t => t.trim());

    // Create card content with responsive layout
    card.innerHTML = `
      <!-- Card Header - Responsive Layout -->
      <div class="p-4 cursor-pointer">
        <!-- Mobile Layout (1 column) -->
        <div class="block md:hidden">
          <!-- Time (top left) and Status (top right) -->
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-600 font-medium">
              <i class="fas fa-clock mr-1 text-primary"></i>${startTime} – ${endTime}
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${statusClass} flex items-center whitespace-nowrap">
              ${statusIcon}${order.status}
            </span>
          </div>
          
          <!-- Product Name (centered) -->
          <h3 class="font-bold text-lg text-gray-800 mb-3 text-center truncate">
            ${order.product}
          </h3>
          
          <!-- Info underneath product name -->
          <div class="text-center space-y-2">
            <div class="flex justify-center items-center text-sm text-gray-600">
              <i class="fas fa-users text-primary mr-2"></i>
              <span class="font-semibold">${order.guestType} (${order.quantity})</span>
            </div>
            <div class="flex justify-center gap-4 text-sm text-gray-600">
              <div class="flex items-center">
                <i class="fas fa-map-marker-alt text-primary mr-1"></i>
                <span>${order.space}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-tag text-primary mr-1"></i>
                <span>${order.category}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tablet Layout (3 columns) -->
        <div class="hidden md:grid lg:hidden grid-cols-3 gap-4 items-center">
          <!-- Column 1: Product Name with time, space, category underneath -->
          <div>
            <h3 class="font-bold text-lg text-gray-800 mb-2 truncate">
              ${order.product}
            </h3>
            <div class="space-y-1 text-sm text-gray-600">
              <div>
                <i class="fas fa-clock mr-1 text-primary"></i>${startTime} – ${endTime}
              </div>
              <div class="flex items-center">
                <i class="fas fa-map-marker-alt text-primary mr-1"></i>
                <span>${order.space}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-tag text-primary mr-1"></i>
                <span>${order.category}</span>
              </div>
            </div>
          </div>
          
          <!-- Column 2: Guest Type Amount -->
          <div class="flex justify-end">
            <div class="flex items-center text-sm">
              <i class="fas fa-users text-primary mr-2"></i>
              <span class="font-semibold">${order.guestType} (${order.quantity})</span>
            </div>
          </div>
          
          <!-- Column 3: Status -->
          <div class="flex justify-end">
            <span class="px-4 py-2 rounded-full text-sm font-bold ${statusClass} flex items-center whitespace-nowrap">
              ${statusIcon}${order.status}
            </span>
          </div>
        </div>

        <!-- Desktop Layout (4 columns with custom grid template) -->
        <div class="hidden lg:grid gap-4 items-center" style="grid-template-columns: 120px 1fr auto 140px;">
          <!-- Column 1: Time (fixed width 120px) -->
          <div class="flex justify-start">
            <span class="text-sm text-gray-600 font-medium">${startTime} – ${endTime}</span>
          </div>
          
          <!-- Column 2: Product Name with space, category underneath (flexible width) -->
          <div>
            <h3 class="font-bold text-lg text-gray-800 mb-2 truncate">
              ${order.product}
            </h3>
            <div class="flex gap-4 text-sm text-gray-600">
              <div class="flex items-center">
                <i class="fas fa-map-marker-alt text-primary mr-1"></i>
                <span>${order.space}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-tag text-primary mr-1"></i>
                <span>${order.category}</span>
              </div>
            </div>
          </div>
          
          <!-- Column 3: Guest Type Amount (auto width) -->
          <div class="flex justify-end">
            <div class="flex items-center text-sm">
              <i class="fas fa-users text-primary mr-2"></i>
              <span class="font-semibold">${order.guestType} (${order.quantity})</span>
            </div>
          </div>
          
          <!-- Column 4: Status (fixed width 140px) -->
          <div class="flex justify-end">
            <span class="px-4 py-2 rounded-full text-sm font-bold ${statusClass} flex items-center whitespace-nowrap">
              ${statusIcon}${order.status}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Card Content -->
      <div class="card-body p-4">
        <div class="flex flex-wrap lg:flex-nowrap gap-8">
          <!-- Product Image -->
          <div class="w-full lg:w-1/4 mb-4 lg:mb-0">
            <div class="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              ${order.image ? 
                `<img src="${order.image}" alt="${order.product}" class="w-full h-full object-cover">` : 
                `<div class="w-full h-full flex items-center justify-center bg-gray-100">
                  <i class="fas fa-image text-gray-400 text-3xl"></i>
                </div>`
              }
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="w-full lg:w-3/4">
            ${order.description ? `
            <!-- Product Description -->
            <div class="mb-5">
              <h4 class="text-lg font-semibold text-gray-700 mb-2">Description</h4>
              <p class="text-gray-600">
                ${order.description}
              </p>
            </div>
            ` : ''}
            
            ${order.notes ? `
            <!-- Product Notes -->
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div class="text-gray-700">
                <div class="flex items-start mb-3">
                  <i class="fas fa-sticky-note text-yellow-500 mr-2 mt-1"></i>
                  <span class="font-semibold text-lg">Notes:</span>
                </div>
                <ul class="list-disc pl-10 space-y-2">
                  ${Array.isArray(order.notes) 
                    ? order.notes.map(note => `<li>${note}</li>`).join('')
                    : typeof order.notes === 'string' && order.notes.includes('.') 
                      ? order.notes.split('.').filter(Boolean).map(note => `<li>${note.trim()}.</li>`).join('')
                      : `<li>${order.notes}</li>`
                  }
                </ul>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Add click event listener for modal only to the header
    const cardHeader = card.querySelector('div:first-child');
    cardHeader.addEventListener("click", () => {
      openProductModal(order.id);
    });

    tableBody.appendChild(card);
  });
  
  // Check if we need to show empty state after filtering
  filterTable();
}

initializeTableView(); // Call this function to populate the table on load

// Full View Toggle functionality
const fullViewToggle = document.getElementById('fullViewToggle');

// Load full view state from localStorage
function loadFullViewState() {
    const savedState = localStorage.getItem('kitchenKanbanFullView');
    return savedState === 'true'; // Default to false if not set
}

// Save full view state to localStorage
function saveFullViewState(isFullView) {
    localStorage.setItem('kitchenKanbanFullView', isFullView.toString());
}

function toggleFullView() {
    const isFullView = fullViewToggle.checked;
    
    // Save state to localStorage
    saveFullViewState(isFullView);
    
    // Handle table view card bodies
    const cardBodies = document.querySelectorAll('#ordersTableBody .card-body');
    cardBodies.forEach(body => {
        body.classList.toggle('expanded', isFullView);
        if (isFullView) {
            body.style.padding = '1rem'; // 16px
        } else {
            body.style.padding = '0';
        }
    });
    
    // Handle table view card headers border bottom
    const cardHeaders = document.querySelectorAll('#ordersTableBody > div > div:first-child');
    cardHeaders.forEach(header => {
        if (isFullView) {
            header.classList.add('border-b', 'border-gray-200');
        } else {
            header.classList.remove('border-b', 'border-gray-200');
        }
    });
    
    // Handle kanban view descriptions and notes
    const kanbanDescriptions = document.querySelectorAll('#kanbanView .kanban-description');
    const kanbanNotes = document.querySelectorAll('#kanbanView .kanban-notes');
    
    [...kanbanDescriptions, ...kanbanNotes].forEach(element => {
        if (isFullView) {
            element.classList.remove('hidden');
            element.classList.add('block');
        } else {
            element.classList.add('hidden');
            element.classList.remove('block');
        }
    });
}

// View switching functions
function switchToTableView() {
  currentView = "table";
  tableView.classList.remove("hidden");
  kanbanView.classList.add("hidden");
  
  // Reset all buttons
  tableViewBtn.removeAttribute('data-active');
  kanbanViewBtn.removeAttribute('data-active');
  
  // Set active button
  tableViewBtn.setAttribute('data-active', 'true');
  
  // Apply current full view state to table view
  toggleFullView();
  
  // Update kanban counts even when switching to table view
  updateKanbanCounts();
}

function switchToKanbanView() {
  currentView = "kanban";
  kanbanView.classList.remove("hidden");
  tableView.classList.add("hidden");
  
  // Reset all buttons
  tableViewBtn.removeAttribute('data-active');
  kanbanViewBtn.removeAttribute('data-active');
  
  // Set active button
  kanbanViewBtn.setAttribute('data-active', 'true');
  
  populateKanbanView();
  
  // Apply current full view state to kanban view after populating
  toggleFullView();
}

// Create kanban card
function createKanbanCard(order) {
  const card = document.createElement("div");
  card.className =
    "kanban-card bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer shadow-sm text-sm md:text-base";
  card.setAttribute("data-category", order.category);
  card.setAttribute("data-guest-type", order.guestType);
  card.setAttribute("data-space", order.space);
  card.setAttribute("data-order-id", order.id);

  card.innerHTML = `
                ${order.image ? 
                  `<div class="relative w-full aspect-video mb-2 overflow-hidden rounded-t-lg">
                    <img src="${order.image}" alt="${order.product}" class="w-full h-full object-cover">
                    <span class="absolute top-2 right-2 border border-gray-300 bg-gray-100/80 backdrop-blur-sm text-gray-700 px-2 py-1 rounded text-xs shadow-sm"><i class="fas fa-clock mr-1"></i>${order.time}</span>
                   </div>` : ''}
                <div class="mb-2">
                    <div class="flex items-center">
                        <h4 class="font-semibold text-gray-800 text-sm md:text-base truncate">${order.product}</h4>
                    </div>
                    ${order.description ? 
                      `<div class="kanban-description">
                        <p class="text-gray-600 text-sm mt-2">${order.description}</p>
                        ${order.notes ? 
                          `<div class="kanban-notes mt-2 bg-yellow-50/50 p-2 rounded">
                            <p class="text-sm font-semibold text-gray-700 mb-1">Opmerkingen:</p>
                            <ul class="list-disc pl-4 space-y-1">
                              ${Array.isArray(order.notes) 
                                ? order.notes.map(note => `<li class="text-gray-600 text-sm">${note}</li>`).join('')
                                : typeof order.notes === 'string' && order.notes.includes('.') 
                                  ? order.notes.split('.').filter(Boolean).map(note => `<li class="text-gray-600 text-sm">${note.trim()}.</li>`).join('')
                                  : `<li class="text-gray-600 text-sm">${order.notes}</li>`
                              }
                            </ul>
                           </div>` 
                          : ''}
                      </div>` 
                      : ''}
                </div>
                <div class="flex justify-between items-center text-xs md:text-sm text-gray-600">
                    <span><i class="fas fa-map-marker-alt mr-1"></i>${order.space}</span>
                    <span class="text-gray-600 text-xs"><i class="fas fa-users mr-1"></i>${order.guestType} (${order.quantity})</span>
                </div>
            `;

  // Add click event listener for modal only to the header
  const cardHeader = card.querySelector('div:first-child');
  cardHeader.addEventListener("click", () => {
    openProductModal(order.id);
  });
  
  // Add cursor-pointer class only to the header
  cardHeader.classList.add('cursor-pointer');

  return card;
}

// Populate kanban view
function populateKanbanView() {
  const readyColumn = document.getElementById("readyColumn");
  const progressColumn = document.getElementById("progressColumn");
  const pendingColumn = document.getElementById("pendingColumn");
  
  // Get empty states
  const readyEmptyState = document.getElementById("readyEmptyState");
  const progressEmptyState = document.getElementById("progressEmptyState");
  const pendingEmptyState = document.getElementById("pendingEmptyState");

  // Clear columns but preserve empty states
  readyColumn.innerHTML = "";
  progressColumn.innerHTML = "";
  pendingColumn.innerHTML = "";
  
  // Add empty states back
  readyColumn.appendChild(readyEmptyState);
  progressColumn.appendChild(progressEmptyState);
  pendingColumn.appendChild(pendingEmptyState);
  
  // Hide all empty states initially
  readyEmptyState.classList.add("hidden");
  readyEmptyState.classList.remove("flex");
  progressEmptyState.classList.add("hidden");
  progressEmptyState.classList.remove("flex");
  pendingEmptyState.classList.add("hidden");
  pendingEmptyState.classList.remove("flex");

  // Track counts for each column
  let readyCount = 0;
  let progressCount = 0;
  let pendingCount = 0;

  // Filter orders based on current filter values
  const filteredOrders = getFilteredOrders();

  // Populate columns with original indices preserved
  orderData.forEach((order, originalIndex) => {
    // Check if this order should be displayed based on filters
    const categoryValue = categoryFilter.value.toLowerCase();
    const guestTypeValue = guestTypeFilter.value.toLowerCase();
    const spaceValue = spaceFilter.value.toLowerCase();
    const statusValue = statusFilter.value.toLowerCase();

    const categoryMatch =
      !categoryValue || order.category.toLowerCase().includes(categoryValue);
    const guestTypeMatch =
      !guestTypeValue || order.guestType.toLowerCase().includes(guestTypeValue);
    const spaceMatch =
      !spaceValue || order.space.toLowerCase().includes(spaceValue);
    const statusMatch =
      !statusValue || order.status.toLowerCase().includes(statusValue);

    if (categoryMatch && guestTypeMatch && spaceMatch && statusMatch) {
      const card = createKanbanCard(order);

      if (order.status === "Ready") {
        readyColumn.appendChild(card);
        readyCount++;
      } else if (order.status === "In Progress") {
        progressColumn.appendChild(card);
        progressCount++;
      } else if (order.status === "Pending") {
        pendingColumn.appendChild(card);
        pendingCount++;
      }
    }
  });

  // Show empty states if no items in column
  if (readyCount === 0) {
    readyEmptyState.classList.remove("hidden");
    readyEmptyState.classList.add("flex");
  }
  
  if (progressCount === 0) {
    progressEmptyState.classList.remove("hidden");
    progressEmptyState.classList.add("flex");
  }
  
  if (pendingCount === 0) {
    pendingEmptyState.classList.remove("hidden");
    pendingEmptyState.classList.add("flex");
  }

  // Update counts with visible items in each column
  updateKanbanCounts();
  
  // Initialize SortableJS for each column
  initializeSortable();
}

// Initialize SortableJS for kanban columns
function initializeSortable() {
  const columns = [
    { id: 'pendingColumn', status: 'Pending' },
    { id: 'progressColumn', status: 'In Progress' },
    { id: 'readyColumn', status: 'Ready' }
  ];

  columns.forEach(column => {
    const element = document.getElementById(column.id);
    if (element) {
      new Sortable(element, {
        group: 'kanban',
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onEnd: (evt) => {
          const card = evt.item;
          const orderId = card.getAttribute('data-order-id');
          
          // Determine the new status based on the target column
          const targetColumn = evt.to;
          let newStatus = 'Pending'; // default
          
          if (targetColumn.id === 'pendingColumn') {
            newStatus = 'Pending';
          } else if (targetColumn.id === 'progressColumn') {
            newStatus = 'In Progress';
          } else if (targetColumn.id === 'readyColumn') {
            newStatus = 'Ready';
          }
          
          console.log('Kanban card moved:', { orderId, newStatus, targetColumnId: targetColumn.id });
          
          if (orderId) {
            const order = findOrderById(orderId);
            if (order) {
              const oldStatus = order.status;
              
              // Only update if the status is actually different
              if (oldStatus !== newStatus) {
                // Update the order status in the data
                order.status = newStatus;
                
                console.log('Order status updated:', { orderId, oldStatus, newStatus });
                
                // Update table view if it's the current view
                if (currentView === "table") {
                  const orderIndex = findOrderIndexById(orderId);
                  if (orderIndex !== -1) {
                    updateTableRowStatus(orderIndex, newStatus);
                  }
                }
                
                // Update counts without refreshing the kanban
                updateKanbanCounts();
                
                // If the modal is currently open for this item, update it to reflect the new status
                if (currentProductId === orderId) {
                  console.log('Refreshing modal for updated order:', orderId);
                  openProductModal(orderId);
                }
              } else {
                console.log('Order status unchanged:', { orderId, status: oldStatus });
                return; // No need to update anything if status hasn't changed
              }
            } else {
              console.error('Order not found for ID:', orderId);
            }
          } else {
            console.error('No order ID found on dragged card');
          }
        }
      });
    }
  });
}

// Update kanban counts
function updateKanbanCounts() {
  // Count actual kanban cards in each column (excluding empty states)
  const readyColumn = document.getElementById("readyColumn");
  const progressColumn = document.getElementById("progressColumn");
  const pendingColumn = document.getElementById("pendingColumn");
  
  const readyCount = readyColumn ? readyColumn.querySelectorAll('.kanban-card').length : 0;
  const progressCount = progressColumn ? progressColumn.querySelectorAll('.kanban-card').length : 0;
  const pendingCount = pendingColumn ? pendingColumn.querySelectorAll('.kanban-card').length : 0;

  document.getElementById("readyCount").textContent = readyCount;
  document.getElementById("progressCount").textContent = progressCount;
  document.getElementById("pendingCount").textContent = pendingCount;
}

// Get filtered orders based on current filter values
function getFilteredOrders() {
  const categoryValue = categoryFilter.value.toLowerCase();
  const guestTypeValue = guestTypeFilter.value.toLowerCase();
  const spaceValue = spaceFilter.value.toLowerCase();
  const statusValue = statusFilter.value.toLowerCase();

  return orderData.filter((order) => {
    const categoryMatch =
      !categoryValue || order.category.toLowerCase().includes(categoryValue);
    const guestTypeMatch =
      !guestTypeValue || order.guestType.toLowerCase().includes(guestTypeValue);
    const spaceMatch =
      !spaceValue || order.space.toLowerCase().includes(spaceValue);
    const statusMatch =
      !statusValue || order.status.toLowerCase().includes(statusValue);

    return categoryMatch && guestTypeMatch && spaceMatch && statusMatch;
  });
}

// Filter table view
function filterTable() {
  const allCards = Array.from(tableBody.querySelectorAll('[data-order-index]'));
  const categoryValue = categoryFilter.value.toLowerCase();
  const guestTypeValue = guestTypeFilter.value.toLowerCase();
  const spaceValue = spaceFilter.value.toLowerCase();
  const statusValue = statusFilter.value.toLowerCase();
  
  let visibleCount = 0;
  let lastVisibleCard = null;

  // First pass: determine visibility and count
  allCards.forEach(card => {
    const index = parseInt(card.getAttribute('data-order-index'));
    const order = orderData[index];

    const categoryMatch =
      !categoryValue || order.category.toLowerCase().includes(categoryValue);
    const guestTypeMatch =
      !guestTypeValue || order.guestType.toLowerCase().includes(guestTypeValue);
    const spaceMatch =
      !spaceValue || order.space.toLowerCase().includes(spaceValue);
    const statusMatch =
      !statusValue || order.status.toLowerCase().includes(statusValue);

    const isVisible = categoryMatch && guestTypeMatch && spaceMatch && statusMatch;
    card.style.display = isVisible ? "" : "none";
    
    // Remove border-b from all cards first
    card.classList.remove("border-b");
    
    if (isVisible) {
      visibleCount++;
      lastVisibleCard = card;
    }
  });
  
  // Add border-b only to the last visible card
  if (lastVisibleCard) {
    lastVisibleCard.classList.add("border-b");
  }
  
  // Show or hide empty state based on visible items
  const tableEmptyState = document.getElementById("tableEmptyState");
  if (visibleCount === 0) {
    tableEmptyState.classList.remove("hidden");
    tableEmptyState.classList.add("flex");
  } else {
    tableEmptyState.classList.add("hidden");
    tableEmptyState.classList.remove("flex");
  }
}

// Handle filtering for both views
function handleFilter() {
  if (currentView === "table") {
    filterTable();
  } else {
    populateKanbanView();
  }
}

// This function is no longer needed as we add click listeners directly in initializeTableView
function addTableRowListeners() {
  // Functionality moved to initializeTableView
}

// Update card status
function updateTableRowStatus(orderIndex, newStatus) {
  const cards = tableBody.querySelectorAll('[data-order-index]');
  const card = cards[orderIndex];
  
  if (card) {
    // Update all status badges in the card (there are multiple for different responsive layouts)
    const statusBadges = card.querySelectorAll('.rounded-full');
    
    // Status badge color and icon
    let statusClass = 'bg-blue-100 text-blue-800';
    let statusIcon = '<i class="fas fa-clock mr-2"></i>';
    
    if (newStatus === "Ready") {
      statusClass = 'bg-emerald-100 text-emerald-800';
      statusIcon = '<i class="fas fa-check mr-2"></i>';
    } else if (newStatus === "In Progress") {
      statusClass = 'bg-yellow-100 text-yellow-800';
      statusIcon = '<i class="fas fa-spinner fa-spin mr-2"></i>';
    }
    
    // Update all status badges
    statusBadges.forEach(statusBadge => {
      // Remove old classes and reset
      statusBadge.className = "rounded-full font-bold flex items-center whitespace-nowrap";
      
      // Add size-specific classes based on the badge
      if (statusBadge.classList.contains('text-xs') || statusBadge.parentElement.classList.contains('md:hidden')) {
        // Mobile badge (smaller)
        statusBadge.classList.add('px-3', 'py-1', 'text-xs');
      } else {
        // Tablet/Desktop badge (larger)
        statusBadge.classList.add('px-4', 'py-2', 'text-sm');
      }
      
      // Add status-specific classes
      statusBadge.classList.add(...statusClass.split(' '));
      
      // Update content
      statusBadge.innerHTML = `${statusIcon}${newStatus}`;
    });
  }
}

// Event listeners
tableViewBtn.addEventListener("click", switchToTableView);
kanbanViewBtn.addEventListener("click", switchToKanbanView);
categoryFilter.addEventListener("change", handleFilter);
guestTypeFilter.addEventListener("change", handleFilter);
spaceFilter.addEventListener("change", handleFilter);
statusFilter.addEventListener("change", handleFilter);

// Initialize with table view
switchToTableView();
addTableRowListeners();

// Initialize kanban counts
updateKanbanCounts();

// Add event listener for toggle
fullViewToggle.addEventListener('change', toggleFullView);

// Initialize with saved state from localStorage
const savedFullViewState = loadFullViewState();
fullViewToggle.checked = savedFullViewState;
toggleFullView();

// Modal event listeners for closing
modalOverlay.addEventListener("click", closeProductModal);

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    !productModal.classList.contains("translate-x-full")
  ) {
    closeProductModal();
  }
});
