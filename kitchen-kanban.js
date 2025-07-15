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
let currentProductIndex = -1;

// Modal functionality
const productModal = document.getElementById("productModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModal");
const modalStatusSelect = document.getElementById("modalStatusSelect");

function openProductModal(productIndex) {
  currentProductIndex = productIndex;
  const product = orderData[productIndex];

  // Parse time for start/end/duration
  let start = '-', end = '-', duration = '-';
  if (product.time && product.time.includes('–')) {
    [start, end] = product.time.split('–').map(t => t.trim());
    try {
      const d1 = new Date(`2000-01-01T${start}`);
      const d2 = new Date(`2000-01-01T${end}`);
      duration = Math.round((d2 - d1) / (1000 * 60)) + ' minutes';
    } catch {}
  }

  // Notes as bullet points
  let notesHtml = '';
  if (product.notes) {
    if (Array.isArray(product.notes)) {
      notesHtml = product.notes.map(note => `<div class='mb-2'><i class="fas fa-circle text-xs text-gray-400 mr-2"></i>${note}</div>`).join('');
    } else if (typeof product.notes === 'string' && product.notes.includes('.')) {
      notesHtml = product.notes.split('.').filter(Boolean).map(note => `<div class='mb-2'><i class="fas fa-circle text-xs text-gray-400 mr-2"></i>${note.trim()}.</div>`).join('');
    } else {
      notesHtml = `<div class='mb-2'><i class="fas fa-circle text-xs text-gray-400 mr-2"></i>${product.notes}</div>`;
    }
  }

  // Status badge color
  let statusClass = 'bg-blue-200 text-blue-800';
  if (product.status === 'Ready') statusClass = 'bg-green-200 text-green-800';
  else if (product.status === 'In Progress') statusClass = 'bg-yellow-200 text-yellow-800';

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
            <img id="productImage" src="${product.image || ''}" alt="${product.product || product.name || ''}" class="w-full h-full object-cover" width="336" height="192">
          </div>
          <h4 id="productTitle" class="text-3xl font-serif font-bold text-gray-900 mb-3">${product.product || product.name || ''}</h4>
          
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
          
          <p id="productDescription" class="text-gray-600 text-base leading-relaxed text-balance">${product.description || ''}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fas fa-clipboard-list mr-3 text-primary"></i>
            Bestelinformatie
          </h5>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Aantal/Type Gast:</span>
              <span id="modalGuestType" class="text-gray-900 font-bold">${product.guestType || '-'} (${product.quantity || product.amount || '-'})</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Categorie:</span>
              <span id="modalCategory" class="text-gray-900 font-bold">${product.category || '-'}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Locatie:</span>
              <span id="modalSpace" class="text-gray-900 font-bold">${product.space || product.location || '-'}</span>
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
  pendingBtn.removeAttribute('data-active');
  progressBtn.removeAttribute('data-active');
  readyBtn.removeAttribute('data-active');
  
  // Set active button based on current status
  if (product.status === "Pending") {
    pendingBtn.setAttribute('data-active', 'true');
  } else if (product.status === "In Progress") {
    progressBtn.setAttribute('data-active', 'true');
  } else if (product.status === "Ready") {
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
  currentProductIndex = -1;
}

function updateProductStatus(newStatus) {
  if (currentProductIndex === -1) return;

  const product = orderData[currentProductIndex];

  // Update the product data
  product.status = newStatus;

  // Update table view
  updateTableRowStatus(currentProductIndex, newStatus);

  // Update kanban view if visible
  if (currentView === "kanban") {
    populateKanbanView();
  } else {
    // Update counts even if not in kanban view
    updateKanbanCounts();
  }

  // Update status buttons
  const pendingBtn = document.getElementById('statusPendingBtn');
  const progressBtn = document.getElementById('statusProgressBtn');
  const readyBtn = document.getElementById('statusReadyBtn');
  
  // Reset all buttons
  pendingBtn.removeAttribute('data-active');
  progressBtn.removeAttribute('data-active');
  readyBtn.removeAttribute('data-active');
  
  // Set active button
  if (newStatus === "Pending") {
    pendingBtn.setAttribute('data-active', 'true');
  } else if (newStatus === "In Progress") {
    progressBtn.setAttribute('data-active', 'true');
  } else if (newStatus === "Ready") {
    readyBtn.setAttribute('data-active', 'true');
  }
}

// Order data extracted from table with additional details
const orderData = [
  {
    time: "10:30–11:00",
    product: "Fresh Fruit Juice",
    category: "Beverages",
    quantity: "15",
    guestType: "VIP",
    space: "Bar Area",
    status: "Ready",
    image:
      "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Freshly squeezed seasonal fruit juice blend with oranges, apples, and pineapple.",
    notes:
      "VIP guests prefer fresh-pressed juice. Serve in chilled glasses with mint garnish.",
  },
  {
    time: "11:00–11:30",
    product: "Sparkling Water",
    category: "Beverages",
    quantity: "25",
    guestType: "All",
    space: "Banquet Hall B",
    status: "In Progress",
    image:
      "https://images.pexels.com/photos/4046763/pexels-photo-4046763.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Premium sparkling water served ice-cold with lemon slices.",
    notes:
      "Ensure bottles are chilled to 4°C. Provide lemon and lime slices on the side.",
  },
  {
    time: "11:00–11:30",
    product: "Orange Juice",
    category: "Beverages",
    quantity: "8",
    guestType: "Kids",
    space: "Banquet Hall B",
    status: "Ready",
    image:
      "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Fresh-squeezed orange juice, no pulp, served in kid-friendly cups.",
    notes:
      "Use small cups with lids and straws. No artificial additives - some kids have allergies.",
  },
  {
    time: "11:00–11:30",
    product: "Coffee Station Setup",
    category: "Beverages",
    quantity: "1",
    guestType: "Staff",
    space: "Kitchen",
    status: "Ready",
    image:
      "https://images.pexels.com/photos/33017872/pexels-photo-33017872.jpeg",
    description:
      "Complete coffee station with premium beans, milk alternatives, and sweeteners.",
    notes:
      "Include decaf option, oat milk, almond milk, and sugar-free sweeteners.",
  },
  {
    time: "11:15–11:30",
    product: "Bruschetta",
    category: "Appetizers",
    quantity: "30",
    guestType: "Adults",
    space: "Banquet Hall B",
    status: "Ready",
    image:
      "https://images.pexels.com/photos/4871119/pexels-photo-4871119.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Classic Italian bruschetta with fresh tomatoes, basil, and garlic on toasted bread.",
    notes:
      "Gluten-free bread available for 3 guests. Extra virgin olive oil drizzle on top.",
  },
  {
    time: "11:15–11:30",
    product: "Cheese Sticks",
    category: "Appetizers",
    quantity: "10",
    guestType: "Kids",
    space: "Banquet Hall B",
    status: "In Progress",
    image:
      "https://images.pexels.com/photos/7218637/pexels-photo-7218637.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Crispy mozzarella cheese sticks with marinara dipping sauce.",
    notes:
      "Ensure they are not too hot for kids. Serve with mild marinara sauce.",
  },
  {
    time: "11:15–11:30",
    product: "Shrimp Cocktail",
    category: "Appetizers",
    quantity: "20",
    guestType: "VIP",
    space: "Outdoor Terrace",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Large gulf shrimp served chilled with cocktail sauce and lemon wedges.",
    notes:
      "Premium jumbo shrimp. One guest has shellfish allergy - prepare separate item.",
  },
  {
    time: "11:20–11:40",
    product: "Caesar Salad",
    category: "Salads",
    quantity: "25",
    guestType: "All",
    space: "Banquet Hall B",
    status: "In Progress",
    image:
      "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Fresh romaine lettuce with Caesar dressing, parmesan, and croutons.",
    notes:
      "Dressing on the side for 5 guests. Gluten-free croutons for 3 guests.",
  },
  {
    time: "11:30–12:00",
    product: "Roast Beef",
    category: "Main Course",
    quantity: "20",
    guestType: "Adults",
    space: "Banquet Hall B",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Slow-roasted beef with herbs, served with au jus and horseradish cream.",
    notes:
      "5 guests prefer medium-rare, 10 medium, 5 well-done. One guest is pregnant - well-done only.",
  },
  {
    time: "11:30–12:00",
    product: "Chicken Nuggets",
    category: "Main Course",
    quantity: "5",
    guestType: "Kids",
    space: "Banquet Hall B",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Homemade chicken nuggets with honey mustard and ketchup.",
    notes:
      "Cut into smaller pieces for younger kids. Ensure internal temp reaches 165°F.",
  },
  {
    time: "11:30–12:00",
    product: "Grilled Salmon",
    category: "Main Course",
    quantity: "15",
    guestType: "VIP",
    space: "Outdoor Terrace",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/1148086/pexels-photo-1148086.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Atlantic salmon grilled with lemon herb butter and seasonal vegetables.",
    notes:
      "Wild-caught salmon only. 3 guests prefer no seasoning due to dietary restrictions.",
  },
  {
    time: "11:45–12:15",
    product: "Vegetarian Pasta",
    category: "Main Course",
    quantity: "8",
    guestType: "Adults",
    space: "Banquet Hall B",
    status: "In Progress",
    image:
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Penne pasta with roasted vegetables in a light olive oil and herb sauce.",
    notes:
      "Vegan option - no cheese. 2 guests need gluten-free pasta. Extra vegetables for fiber.",
  },
  {
    time: "12:00–12:30",
    product: "Side Salad",
    category: "Sides",
    quantity: "25",
    guestType: "All",
    space: "Banquet Hall B",
    status: "In Progress",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Mixed greens with cherry tomatoes, cucumber, and choice of dressing.",
    notes:
      "Variety of dressings available. No nuts in salad - allergy concern.",
  },
  {
    time: "12:00–12:30",
    product: "Garlic Bread",
    category: "Sides",
    quantity: "25",
    guestType: "All",
    space: "Banquet Hall B",
    status: "Ready",
    image:
      "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Warm garlic bread with butter and herbs, served fresh from the oven.",
    notes: "Gluten-free option available for 3 guests. Extra herbs on request.",
  },
  {
    time: "12:00–12:30",
    product: "Roasted Vegetables",
    category: "Sides",
    quantity: "30",
    guestType: "All",
    space: "Banquet Hall B",
    status: "In Progress",
    image:
      "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Seasonal roasted vegetables with olive oil, herbs, and sea salt.",
    notes:
      "Mix includes carrots, zucchini, bell peppers. Low-sodium preparation for 2 guests.",
  },
  {
    time: "12:15–12:45",
    product: "Quinoa Bowl",
    category: "Salads",
    quantity: "12",
    guestType: "Adults",
    space: "Outdoor Terrace",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Quinoa bowl with roasted vegetables, chickpeas, and tahini dressing.",
    notes:
      "Superfood bowl - high protein. Tahini on side for those with sesame allergies.",
  },
  {
    time: "12:30–13:00",
    product: "Coffee",
    category: "Beverages",
    quantity: "20",
    guestType: "Adults",
    space: "Banquet Hall B",
    status: "In Progress",
    image:
      "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Freshly brewed premium coffee with cream and sugar options.",
    notes:
      "Include decaf option. Oat milk and almond milk available. Some prefer it black.",
  },
  {
    time: "12:30–13:00",
    product: "Herbal Tea",
    category: "Beverages",
    quantity: "10",
    guestType: "VIP",
    space: "Outdoor Terrace",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Selection of premium herbal teas including chamomile, peppermint, and ginger.",
    notes:
      "Caffeine-free options. Honey and lemon available. Some guests prefer no sweeteners.",
  },
  {
    time: "12:30–13:00",
    product: "Chocolate Cake",
    category: "Desserts",
    quantity: "25",
    guestType: "All",
    space: "Banquet Hall B",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Rich chocolate layer cake with chocolate ganache and fresh berries.",
    notes:
      "Reduced sugar version for 3 guests with diabetes. Nut-free preparation.",
  },
  {
    time: "12:30–13:00",
    product: "Tiramisu",
    category: "Desserts",
    quantity: "15",
    guestType: "VIP",
    space: "Outdoor Terrace",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Classic Italian tiramisu with mascarpone, coffee, and cocoa.",
    notes:
      "Contains alcohol (marsala wine). Non-alcoholic version available for 2 guests.",
  },
  {
    time: "12:45–13:00",
    product: "Ice Cream",
    category: "Desserts",
    quantity: "8",
    guestType: "Kids",
    space: "Banquet Hall B",
    status: "Pending",
    image:
      "https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Vanilla and chocolate ice cream with rainbow sprinkles and cherries.",
    notes:
      "Lactose-free option for 2 kids. Small portions, colorful presentation.",
  },
  {
    time: "12:45–13:00",
    product: "Fresh Fruit Platter",
    category: "Desserts",
    quantity: "20",
    guestType: "All",
    space: "Banquet Hall B",
    status: "In Progress",
    image:
      "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Seasonal fresh fruit arrangement with berries, melons, and citrus.",
    notes:
      "Sugar-free option. Include variety for visual appeal. Some guests prefer no citrus.",
  },
];

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
      openProductModal(index);
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
        element.classList.toggle('expanded', isFullView);
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
function createKanbanCard(order, index) {
  const card = document.createElement("div");
  card.className =
    "kanban-card bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer shadow-sm text-sm md:text-base";
  card.setAttribute("data-category", order.category);
  card.setAttribute("data-guest-type", order.guestType);
  card.setAttribute("data-space", order.space);
  card.setAttribute("data-order-index", index);

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
    openProductModal(index);
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
      const card = createKanbanCard(order, originalIndex);

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
        onEnd: function(evt) {
          const card = evt.item;
          const newStatus = column.status;
          const orderIndex = parseInt(card.getAttribute('data-order-index'));
          
          if (orderIndex !== -1) {
            // Update the order status
            orderData[orderIndex].status = newStatus;
            
            // Update table view if visible
            if (currentView === "table") {
              updateTableRowStatus(orderIndex, newStatus);
            }
            
            // Update counts with visible items in each column
            updateKanbanCounts();
          }
        }
      });
    }
  });
}

// Update kanban counts
function updateKanbanCounts() {
  // Count actual visible items in each column
  const readyColumn = document.getElementById("readyColumn");
  const progressColumn = document.getElementById("progressColumn");
  const pendingColumn = document.getElementById("pendingColumn");
  
  const readyCount = readyColumn ? readyColumn.children.length : 0;
  const progressCount = progressColumn ? progressColumn.children.length : 0;
  const pendingCount = pendingColumn ? pendingColumn.children.length : 0;

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
