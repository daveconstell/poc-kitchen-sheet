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
          <p id="productDescription" class="text-gray-600 text-base leading-relaxed text-balance">${product.description || ''}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fas fa-clipboard-list mr-3 text-primary"></i>
            Bestelinformatie
          </h5>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Type Gast:</span>
              <span id="modalGuestType" class="text-gray-900 font-bold">${product.guestType || '-'}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Aantal:</span>
              <span id="modalQuantity" class="text-gray-900 font-bold">${product.quantity || product.amount || '-'}</span>
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
        <div class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border-2 border-primary/20">
          <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fas fa-tasks mr-3 text-primary"></i>
            Status
          </h5>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 font-medium">Huidige Status:</span>
              <span id="modalCurrentStatus" class="px-3 py-1 rounded-full text-sm font-medium truncate max-w-[120px] inline-block ${statusClass}">${product.status}</span>
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">Status wijzigen:</label>
              <select id="modalStatusSelect" class="w-full p-4 rounded-lg bg-white text-gray-900 border-2 border-gray-200 focus-primary font-medium">
                <option value="Pending"${product.status === "Pending" ? " selected" : ""}>Pending</option>
                <option value="In Progress"${product.status === "In Progress" ? " selected" : ""}>In Progress</option>
                <option value="Ready"${product.status === "Ready" ? " selected" : ""}>Ready</option>
              </select>
            </div>
            <button id="updateStatusBtn" class="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 rounded-lg transition-colors font-bold text-lg shadow-lg hover:shadow-xl">
              <i class="fas fa-save mr-2"></i>Status bijwerken
            </button>
          </div>
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
  document.getElementById('updateStatusBtn').onclick = updateProductStatus;
  document.getElementById('modalStatusSelect').value = product.status;
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

function updateProductStatus() {
  if (currentProductIndex === -1) return;

  const newStatus = document.getElementById('modalStatusSelect').value
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

  // Update modal display
  const statusSpan = document.getElementById("modalCurrentStatus");
  statusSpan.textContent = newStatus;
  statusSpan.className = "px-3 py-1 rounded-full text-sm font-medium";

  if (newStatus === "Ready") {
    statusSpan.classList.add("bg-green-200", "text-green-800");
  } else if (newStatus === "In Progress") {
    statusSpan.classList.add("bg-yellow-200", "text-yellow-800");
  } else if (newStatus === "Pending") {
    statusSpan.classList.add("bg-blue-200", "text-blue-800");
  }

  // Close modal
  closeProductModal();
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
      "https://images.pexels.com/photos/2061958/pexels-photo-2061958.jpeg?auto=compress&cs=tinysrgb&w=400",
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
  tableBody.innerHTML = ""; // Clear existing rows

  orderData.forEach((order) => {
    const row = document.createElement("tr");
    row.className = "border-b border-gray-200";

    row.innerHTML = `
      <td class="py-4 px-6 hidden lg:table-cell">
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
          <span class="text-left">${order.time.split("–")[0]}</span>
          <span>–</span>
          <span class="text-right">${order.time.split("–")[1]}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="text-center md:hidden mb-2">
          <span class="px-3 py-1 rounded-full text-xs font-medium truncate max-w-[80px] inline-block ${
            order.status === "Ready"
              ? "bg-green-200 text-green-800"
              : order.status === "In Progress"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-blue-200 text-blue-800"
          }">${order.status}</span>
        </div>
        <div class="text-center mb-2 md:mb-0 md:text-left">${order.product}</div>
        <div class="text-xs text-gray-500 lg:hidden mt-1 flex flex-col gap-2 md:block">
          <span class="mr-2"><i class="fas fa-clock mr-1"></i>${order.time}</span>
          <span class="mr-2"><i class="fas fa-tag mr-1"></i>${order.category}</span>
          <span class="mr-2"><i class="fas fa-users mr-1"></i>${order.guestType} (${order.quantity})</span>
          <span><i class="fas fa-map-marker-alt mr-1"></i>${order.space}</span>
        </div>
      </td>
      <td class="py-4 px-6 hidden lg:table-cell">${order.category}</td>
      <td class="py-4 px-6 hidden lg:table-cell">${order.quantity}</td>
      <td class="py-4 px-6 hidden lg:table-cell">${order.guestType}</td>
      <td class="py-4 px-6 hidden lg:table-cell">${order.space}</td>
      <td class="py-4 px-6 hidden md:table-cell">
        <span class="px-3 py-1 rounded-full text-xs font-medium truncate max-w-[100px] inline-block ${
          order.status === "Ready"
            ? "bg-green-200 text-green-800"
            : order.status === "In Progress"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-blue-200 text-blue-800"
        }">${order.status}</span>
      </td>
    `;

    tableBody.appendChild(row);
  });

  addTableRowListeners(); // Re-add row click listeners
}

initializeTableView(); // Call this function to populate the table on load

// View switching functions
function switchToTableView() {
  currentView = "table";
  tableView.classList.remove("hidden");
  kanbanView.classList.add("hidden");
  tableViewBtn.classList.add("bg-primary", "text-white");
  tableViewBtn.classList.remove(
    "text-gray-600",
    "hover:text-gray-800",
    "hover:bg-gray-300"
  );
  kanbanViewBtn.classList.remove("bg-primary", "text-white");
  kanbanViewBtn.classList.add(
    "text-gray-600",
    "hover:text-gray-800",
    "hover:bg-gray-300"
  );
  
  // Update kanban counts even when switching to table view
  updateKanbanCounts();
}

function switchToKanbanView() {
  currentView = "kanban";
  kanbanView.classList.remove("hidden");
  tableView.classList.add("hidden");
  kanbanViewBtn.classList.add("bg-primary", "text-white");
  kanbanViewBtn.classList.remove(
    "text-gray-600",
    "hover:text-gray-800",
    "hover:bg-gray-300"
  );
  tableViewBtn.classList.remove("bg-primary", "text-white");
  tableViewBtn.classList.add(
    "text-gray-600",
    "hover:text-gray-800",
    "hover:bg-gray-300"
  );
  populateKanbanView();
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
                <div class="mb-2">
                    <h4 class="font-semibold text-gray-800 text-base md:text-lg lg:text-xl">${order.product}</h4>
                    <p class="text-gray-500 text-xs md:text-sm">${order.time}</p>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span class="border border-gray-300 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs md:text-sm">${order.category}</span>
                    <span class="text-gray-800 font-bold text-base md:text-lg">×${order.quantity}</span>
                </div>
                <div class="flex justify-between items-center text-xs md:text-sm text-gray-600">
                    <span><i class="fas fa-users mr-1"></i>${order.guestType}</span>
                    <span><i class="fas fa-map-marker-alt mr-1"></i>${order.space}</span>
                </div>
            `;

  // Add click event listener for modal
  card.addEventListener("click", () => {
    openProductModal(index);
  });

  return card;
}

// Populate kanban view
function populateKanbanView() {
  const readyColumn = document.getElementById("readyColumn");
  const progressColumn = document.getElementById("progressColumn");
  const pendingColumn = document.getElementById("pendingColumn");

  // Clear columns
  readyColumn.innerHTML = "";
  progressColumn.innerHTML = "";
  pendingColumn.innerHTML = "";

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
      } else if (order.status === "In Progress") {
        progressColumn.appendChild(card);
      } else if (order.status === "Pending") {
        pendingColumn.appendChild(card);
      }
    }
  });

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
  const allRows = Array.from(tableBody.getElementsByTagName("tr"));
  const categoryValue = categoryFilter.value.toLowerCase();
  const guestTypeValue = guestTypeFilter.value.toLowerCase();
  const spaceValue = spaceFilter.value.toLowerCase();
  const statusValue = statusFilter.value.toLowerCase();

  allRows.forEach((row, index) => {
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
    row.style.display = isVisible ? "" : "none";
  });
}

// Handle filtering for both views
function handleFilter() {
  if (currentView === "table") {
    filterTable();
  } else {
    populateKanbanView();
  }
}

// Add click listeners to table rows
function addTableRowListeners() {
  const rows = tableBody.getElementsByTagName("tr");
  Array.from(rows).forEach((row, index) => {
    row.style.cursor = "pointer";
    row.classList.add("hover:bg-primary/5");
    row.addEventListener("click", () => {
      openProductModal(index);
    });
  });
}

// Update table row status
function updateTableRowStatus(orderIndex, newStatus) {
  const rows = tableBody.getElementsByTagName("tr");
  if (rows[orderIndex]) {
    const statusCell = rows[orderIndex].cells[6];
    const statusSpan = statusCell.querySelector("span");

    // Remove old classes
    statusSpan.className = "px-3 py-1 rounded-full text-xs font-medium truncate max-w-[100px] inline-block";

    // Add new class and update text
    if (newStatus === "Ready") {
      statusSpan.classList.add("bg-green-200", "text-green-800");
    } else if (newStatus === "In Progress") {
      statusSpan.classList.add("bg-yellow-200", "text-yellow-800");
    } else if (newStatus === "Pending") {
      statusSpan.classList.add("bg-blue-200", "text-blue-800");
    }

    statusSpan.textContent = newStatus;
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
