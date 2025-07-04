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
let draggedElement = null;
let currentProductIndex = -1;

// Modal functionality
const productModal = document.getElementById("productModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModal");
// const updateStatusBtn = document.getElementById("updateStatusBtn");
const modalStatusSelect = document.getElementById("modalStatusSelect");

function openProductModal(productIndex) {
  currentProductIndex = productIndex;
  const product = orderData[productIndex];

  // Compose details grid (two columns)
  const [startTime, endTime] = product.time.split("–");
  // Calculate duration
  let duration = "-";
  try {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    duration = Math.round((end - start) / (1000 * 60)) + " minutes";
  } catch {}

  // Guest types as badges (if available)
  let guestTypesHtml = "";
  if (Array.isArray(product.guestTypes) && product.guestTypes.length) {
    guestTypesHtml = `<div class='flex flex-wrap gap-2 mb-4'>${product.guestTypes.map(gt => `<span class='inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20'>${gt.type}: <span class='ml-1 font-bold'>${gt.count}</span></span>`).join('')}</div>`;
  } else if (product.guestType) {
    guestTypesHtml = `<span class='inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20'>${product.guestType}</span>`;
  }

  // Notes as styled block
  let notesHtml = "";
  if (product.notes) {
    if (Array.isArray(product.notes)) {
      notesHtml = `<div class='mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 rounded'><div class='text-xs text-yellow-700 font-bold uppercase mb-1'>Notes</div><div class='text-gray-700 font-sans whitespace-pre-line'>${product.notes.map(note => `• ${note}`).join('<br>')}</div></div>`;
    } else {
      notesHtml = `<div class='mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 rounded'><div class='text-xs text-yellow-700 font-bold uppercase mb-1'>Notes</div><div class='text-gray-700 font-sans whitespace-pre-line'>${product.notes}</div></div>`;
    }
  }

  // Details grid
  const detailsGrid = `
    <div class="grid grid-cols-2 gap-4 mb-2">
      <div class="flex flex-col"><span class="text-xs text-gray-400 uppercase mb-1">Time</span><span class="text-gray-800 font-medium">${product.time || startTime || '-'}</span></div>
      <div class="flex flex-col"><span class="text-xs text-gray-400 uppercase mb-1">Amount</span><span class="text-gray-800 font-medium">${product.quantity || product.amount || '-'}</span></div>
      <div class="flex flex-col"><span class="text-xs text-gray-400 uppercase mb-1">Unit Price</span><span class="text-gray-800 font-medium">${product.unitPrice || '-'}</span></div>
      <div class="flex flex-col"><span class="text-xs text-gray-400 uppercase mb-1">Total</span><span class="text-gray-800 font-medium">${product.total || '-'}</span></div>
      <div class="flex flex-col"><span class="text-xs text-gray-400 uppercase mb-1">Category</span><span class="text-gray-800 font-medium">${product.category || '-'}</span></div>
      <div class="flex flex-col"><span class="text-xs text-gray-400 uppercase mb-1">Location</span><span class="text-gray-800 font-medium">${product.space || product.location || '-'}</span></div>
    </div>
  `;

  // Status control
  let statusClass = "px-3 py-1 rounded-full text-sm font-medium ";
  if (product.status === "Ready") {
    statusClass += "bg-green-200 text-green-800";
  } else if (product.status === "In Progress") {
    statusClass += "bg-yellow-200 text-yellow-800";
  } else if (product.status === "Pending") {
    statusClass += "bg-blue-200 text-blue-800";
  }

  const statusControl = `
    <div class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border-2 border-primary/20 mt-8">
      <h5 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <i class="fas fa-tasks mr-3 text-primary"></i>
        Status
      </h5>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <span class="text-gray-600 font-medium">Huidige Status:</span>
          <span id="modalCurrentStatus" class="${statusClass}">${product.status}</span>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">Status wijzigen:</label>
          <select id="modalStatusSelect"
                  class="w-full p-4 rounded-lg bg-white text-gray-900 border-2 border-gray-200 focus-primary font-medium">
            <option value="Pending"${product.status === "Pending" ? " selected" : ""}>Pending</option>
            <option value="In Progress"${product.status === "In Progress" ? " selected" : ""}>In Progress</option>
            <option value="Ready"${product.status === "Ready" ? " selected" : ""}>Ready</option>
          </select>
        </div>
        <button id="updateStatusBtn"
                class="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 rounded-lg transition-colors font-bold text-lg shadow-lg hover:shadow-xl">
          <i class="fas fa-save mr-2"></i>Status bijwerken
        </button>
      </div>
    </div>
  `;

  // Compose modal content
  document.getElementById('offcanvas-title').textContent = 'Product Details';
  document.getElementById('offcanvas-content').innerHTML = `
    <div class="mb-4">
      <img src="${product.image || ''}" alt="Product Cover" class="w-full h-40 object-cover rounded-t-xl mb-4">
      <h4 class="text-2xl font-serif font-bold mb-2 text-secondary">${product.product || product.name || ''}</h4>
      <p class="text-gray-600 font-sans mb-4">${product.description || ''}</p>
      ${detailsGrid}
      ${guestTypesHtml}
      ${notesHtml}
    </div>
    ${statusControl}
  `;

  // Show modal
  modalOverlay.classList.remove("pointer-events-none", "opacity-0");
  modalOverlay.classList.add("opacity-100");
  productModal.classList.remove("translate-x-full");
  productModal.classList.add("translate-x-0");

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  // Attach status update event
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

  const newStatus = modalStatusSelect.value;
  const product = orderData[currentProductIndex];

  // Update the product data
  product.status = newStatus;

  // Update table view
  updateTableRowStatus(currentProductIndex, newStatus);

  // Update kanban view if visible
  if (currentView === "kanban") {
    populateKanbanView();
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

// Drag and drop functionality
function handleDragStart(e) {
  draggedElement = this;
  this.style.opacity = "0.5";
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.outerHTML);

  // Add a small delay to prevent accidental modal opening
  setTimeout(() => {
    this.style.pointerEvents = "none";
  }, 100);
}

function handleDragEnd() {
  this.style.opacity = "1";
  this.style.pointerEvents = "";
  setTimeout(() => {
    draggedElement = null;
  }, 100);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDragEnter() {
  this.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
}

function handleDragLeave() {
  this.style.backgroundColor = "";
}

function handleDrop(e) {
  e.preventDefault();
  this.style.backgroundColor = "";

  if (draggedElement !== this) {
    const newStatus = this.closest("[data-status]").getAttribute("data-status");
    const orderIndex = parseInt(
      draggedElement.getAttribute("data-order-index")
    );

    // Update the order data
    const originalOrder = orderData.find(
      (_, index) => index === orderIndex
    );
    if (originalOrder) {
      originalOrder.status = newStatus;

      // Update the table row as well
      updateTableRowStatus(orderIndex, newStatus);

      // Refresh the kanban view
      populateKanbanView();
    }
  }

  return false;
}

// Update table row status
function updateTableRowStatus(orderIndex, newStatus) {
  const rows = tableBody.getElementsByTagName("tr");
  if (rows[orderIndex]) {
    const statusCell = rows[orderIndex].cells[6];
    const statusSpan = statusCell.querySelector("span");

    // Remove old classes
    statusSpan.className = "px-3 py-1 rounded-full text-sm font-medium";

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
          <span class="px-3 py-1 rounded-full text-xs font-medium ${
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
        <span class="px-3 py-1 rounded-full text-xs font-medium ${
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
  card.setAttribute("draggable", "true");

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

  // Add drag event listeners
  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);

  // Add click event listener for modal
  card.addEventListener("click", () => {
    // Only open modal if not dragging
    if (!draggedElement) {
      openProductModal(index);
    }
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
    
    // These variables are used in the filtering logic below

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

  // Update counts
  updateKanbanCounts(filteredOrders);
}

// Update kanban counts
function updateKanbanCounts(orders) {
  const readyCount = orders.filter((order) => order.status === "Ready").length;
  const progressCount = orders.filter(
    (order) => order.status === "In Progress"
  ).length;
  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

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

// Event listeners
tableViewBtn.addEventListener("click", switchToTableView);
kanbanViewBtn.addEventListener("click", switchToKanbanView);
categoryFilter.addEventListener("change", handleFilter);
guestTypeFilter.addEventListener("change", handleFilter);
spaceFilter.addEventListener("change", handleFilter);
statusFilter.addEventListener("change", handleFilter);

// Modal event listeners
closeModalBtn.addEventListener("click", closeProductModal);
modalOverlay.addEventListener("click", closeProductModal);
// updateStatusBtn.addEventListener("click", updateProductStatus);

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    !productModal.classList.contains("translate-x-full")
  ) {
    closeProductModal();
  }
});

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

// Add drag and drop listeners to columns
function initializeDragAndDrop() {
  const columns = ["pendingColumn", "progressColumn", "readyColumn"];
  columns.forEach((columnId) => {
    const column = document.getElementById(columnId);
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("dragenter", handleDragEnter);
    column.addEventListener("dragleave", handleDragLeave);
    column.addEventListener("drop", handleDrop);
  });
}

// Initialize with table view
switchToTableView();
initializeDragAndDrop();
addTableRowListeners();
