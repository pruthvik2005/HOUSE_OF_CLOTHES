// Seed Data (Initial Inventory)
const SEED_INVENTORY = [
    {
        id: 'seed-1',
        name: 'Classic Crimson Banarasi Silk Saree',
        category: 'Premium Saree',
        price: 8500,
        fabric: 'Banarasi Silk',
        color: 'Crimson & Gold',
        desc: 'A stunning Banarasi silk saree featuring traditional hand-woven gold zari floral motifs, perfect for bridal wear and grand festive occasions.',
        image: 'assets/images/banarasi_silk_saree.png'
    },
    {
        id: 'seed-2',
        name: 'Peach & Gold Kanjeevaram Silk Saree',
        category: 'Premium Saree',
        price: 9200,
        fabric: 'Kanjeevaram Silk',
        color: 'Peach & Gold',
        desc: 'An elegant Kanjeevaram silk saree with rich traditional gold borders and delicate threadwork. A classic addition to your bridal trousseau.',
        image: 'assets/images/kanjeevaram_silk_saree.png'
    },
    {
        id: 'seed-3',
        name: 'Classic Indigo Block Print Cotton Saree',
        category: 'Daily Wear Saree',
        price: 1850,
        fabric: 'Cotton',
        color: 'Indigo Blue',
        desc: 'A comfortable, light cotton saree hand-printed with traditional indigo floral blocks. Perfect for daily wear and office elegance.',
        image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=600'
    },
    {
        id: 'seed-4',
        name: 'Lavender Floral Chikankari Kurthi',
        category: 'Kurthi',
        price: 2800,
        fabric: 'Georgette',
        color: 'Lavender',
        desc: 'Handcrafted with intricate Lucknow Chikankari embroidery, this georgette kurthi offers style and breezy comfort for everyday and festive gatherings.',
        image: 'assets/images/chikankari_kurti.png'
    },
    {
        id: 'seed-5',
        name: 'Elegant Teal Embroidered Anarkali Kurthi',
        category: 'Premium Kurthi',
        price: 4200,
        fabric: 'Silk-Blend',
        color: 'Teal Blue',
        desc: 'This flowing Anarkali kurthi showcases rich gold threadwork along the neckline and cuffs. A premium design that exudes grace and traditional charm.',
        image: 'assets/images/anarkali_kurti.png'
    },
    {
        id: 'seed-6',
        name: 'Royal Raw Silk Saree Bag',
        category: 'Saree Bag',
        price: 850,
        fabric: 'Raw Silk',
        color: 'Crimson & Gold',
        desc: 'An exquisite raw silk saree organizer bag handcrafted with traditional gold floral embroidery. Helps store your premium sarees safely and elegantly.',
        image: 'assets/images/saree_bag.png'
    }
];

// App State
let inventory = [];
let activeFilter = 'all';
let searchKeyword = '';
let activeSort = 'default';
let currentUploadedImageBase64 = ''; // Holds base64 for uploaded file

// DOM Elements
const productGrid = document.getElementById('product-grid');
const emptyState = document.getElementById('empty-state');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Modal Elements
const quickviewModal = document.getElementById('quickview-modal');
const quickviewContent = document.getElementById('quickview-content');
const btnCloseQuickview = document.getElementById('btn-close-quickview');

// Admin Elements
const adminDrawer = document.getElementById('admin-drawer');
const btnToggleAdmin = document.getElementById('btn-toggle-admin');
const btnCloseAdmin = document.getElementById('btn-close-admin');
const btnQuickAdmin = document.getElementById('btn-quick-admin');
const btnEmptyAdd = document.getElementById('btn-empty-add');
const addItemForm = document.getElementById('add-item-form');
const inventoryList = document.getElementById('inventory-list');
const inventoryCount = document.getElementById('inventory-count');

// Admin Image Source Toggles
const btnImgPreset = document.getElementById('btn-img-preset');
const btnImgUpload = document.getElementById('btn-img-upload');
const btnImgUrl = document.getElementById('btn-img-url');

const presetSelectContainer = document.getElementById('preset-select-container');
const fileUploadContainer = document.getElementById('file-upload-container');
const urlInputContainer = document.getElementById('url-input-container');

const presetSelect = document.getElementById('product-preset-img');
const fileInput = document.getElementById('product-file-img');
const urlInput = document.getElementById('product-url-img');
const filePreviewName = document.getElementById('file-preview-name');

// Toast Element
const toast = document.getElementById('toast');

// Passcode Elements
const passcodeModal = document.getElementById('passcode-modal');
const passcodeForm = document.getElementById('passcode-form');
const adminPasscodeInput = document.getElementById('admin-passcode');
const passcodeError = document.getElementById('passcode-error');
const btnClosePasscode = document.getElementById('btn-close-passcode');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Load inventory from local storage or set seed data
    const localData = localStorage.getItem('house_of_clothes_v2_inventory');
    if (localData) {
        inventory = JSON.parse(localData);
    } else {
        inventory = [...SEED_INVENTORY];
        saveInventoryToLocalStorage();
    }

    // Set up event listeners
    initEventListeners();

    // Render initial catalog and admin inventory list
    renderApp();
});

// Save to localStorage
function saveInventoryToLocalStorage() {
    localStorage.setItem('house_of_clothes_v2_inventory', JSON.stringify(inventory));
}

// --- Event Listeners ---
function initEventListeners() {
    // Filter click handler
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            activeFilter = e.currentTarget.dataset.filter;
            renderCatalog();
        });
    });

    // Search input handler
    searchInput.addEventListener('input', (e) => {
        searchKeyword = e.target.value.toLowerCase().trim();
        renderCatalog();
    });

    // Sort select handler
    sortSelect.addEventListener('change', (e) => {
        activeSort = e.target.value;
        renderCatalog();
    });

    // Toggle Admin Drawer (Authorization Check)
    btnToggleAdmin.addEventListener('click', () => requestAdminAccess());
    btnCloseAdmin.addEventListener('click', () => toggleAdminDrawer(false));
    if (btnQuickAdmin) btnQuickAdmin.addEventListener('click', () => requestAdminAccess());
    if (btnEmptyAdd) btnEmptyAdd.addEventListener('click', () => requestAdminAccess());

    // Passcode events
    btnClosePasscode.addEventListener('click', closePasscodeModal);
    passcodeModal.addEventListener('click', (e) => {
        if (e.target === passcodeModal) closePasscodeModal();
    });
    passcodeForm.addEventListener('submit', handlePasscodeSubmit);

    // Close Modals on click outside
    quickviewModal.addEventListener('click', (e) => {
        if (e.target === quickviewModal) closeQuickview();
    });
    btnCloseQuickview.addEventListener('click', closeQuickview);

    // Image source toggle buttons
    btnImgPreset.addEventListener('click', () => switchImageSource('preset'));
    btnImgUpload.addEventListener('click', () => switchImageSource('upload'));
    btnImgUrl.addEventListener('click', () => switchImageSource('url'));

    // Handle File Upload Change (Convert to base64)
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            filePreviewName.textContent = `Selected: ${file.name}`;
            const reader = new FileReader();
            reader.onload = function(evt) {
                currentUploadedImageBase64 = evt.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            currentUploadedImageBase64 = '';
            filePreviewName.textContent = '';
        }
    });

    // Form Submit (Add Item)
    addItemForm.addEventListener('submit', handleAddItemSubmit);
}

// --- Admin Controls ---
function toggleAdminDrawer(forceOpen = false) {
    if (forceOpen === true) {
        adminDrawer.classList.remove('hidden');
    } else {
        adminDrawer.classList.toggle('hidden');
    }
    
    // If opened, populate the inventory lists
    if (!adminDrawer.classList.contains('hidden')) {
        renderAdminInventory();
    }
}

function switchImageSource(source) {
    // Reset inputs
    presetSelectContainer.classList.add('hidden');
    fileUploadContainer.classList.add('hidden');
    urlInputContainer.classList.add('hidden');
    
    btnImgPreset.classList.remove('active');
    btnImgUpload.classList.remove('active');
    btnImgUrl.classList.remove('active');

    if (source === 'preset') {
        presetSelectContainer.classList.remove('hidden');
        btnImgPreset.classList.add('active');
        fileInput.value = '';
        currentUploadedImageBase64 = '';
        filePreviewName.textContent = '';
    } else if (source === 'upload') {
        fileUploadContainer.classList.remove('hidden');
        btnImgUpload.classList.add('active');
        urlInput.value = '';
    } else if (source === 'url') {
        urlInputContainer.classList.remove('hidden');
        btnImgUrl.classList.add('active');
        fileInput.value = '';
        currentUploadedImageBase64 = '';
        filePreviewName.textContent = '';
    }
}

function handleAddItemSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const fabric = document.getElementById('product-fabric').value;
    const color = document.getElementById('product-color').value;
    const desc = document.getElementById('product-desc').value;

    let imageUrl = '';
    
    // Check which image source is active
    if (btnImgPreset.classList.contains('active')) {
        imageUrl = presetSelect.value;
    } else if (btnImgUpload.classList.contains('active')) {
        if (!currentUploadedImageBase64) {
            alert('Please select a file to upload or switch to Presets/URL.');
            return;
        }
        imageUrl = currentUploadedImageBase64;
    } else if (btnImgUrl.classList.contains('active')) {
        imageUrl = urlInput.value.trim();
        if (!imageUrl) {
            alert('Please paste a valid image URL.');
            return;
        }
    }

    // Create new product
    const newProduct = {
        id: 'user-' + Date.now(),
        name,
        category,
        price,
        fabric,
        color,
        desc,
        image: imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'
    };

    // Update state
    inventory.unshift(newProduct);
    saveInventoryToLocalStorage();

    // Reset Form
    addItemForm.reset();
    currentUploadedImageBase64 = '';
    filePreviewName.textContent = '';
    switchImageSource('preset'); // reset to default tab

    // Notify User
    showToast('New apparel added successfully!');
    
    // Refresh GUI
    renderApp();
}

function deleteItem(id) {
    if (confirm('Are you sure you want to remove this item from your collection?')) {
        inventory = inventory.filter(item => item.id !== id);
        saveInventoryToLocalStorage();
        showToast('Apparel removed from collection.');
        renderApp();
    }
}

// --- Notification Toast ---
function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// --- Render Core Functions ---
function renderApp() {
    renderCatalog();
    renderAdminInventory();
}

// Filter, Sort, and Search
function getFilteredAndSortedCatalog() {
    let items = [...inventory];

    // Filter by Category
    if (activeFilter !== 'all') {
        items = items.filter(item => item.category === activeFilter);
    }

    // Filter by Search Keyword
    if (searchKeyword) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(searchKeyword) ||
            item.fabric.toLowerCase().includes(searchKeyword) ||
            item.color.toLowerCase().includes(searchKeyword) ||
            item.desc.toLowerCase().includes(searchKeyword)
        );
    }

    // Sort items
    if (activeSort === 'price-low') {
        items.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
        items.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'name-asc') {
        items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
}

// Render Products Grid
function renderCatalog() {
    const displayItems = getFilteredAndSortedCatalog();

    if (displayItems.length === 0) {
        productGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    productGrid.classList.remove('hidden');

    productGrid.innerHTML = displayItems.map(item => {
        return `
            <div class="product-card">
                <span class="product-tag">${item.category}</span>
                <div class="product-image-container">
                    <img class="product-image" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'">
                    <div class="product-badge-quick" onclick="openQuickview('${item.id}')">
                        <i class="fa-regular fa-eye"></i> Quick View
                    </div>
                </div>
                <div class="product-details">
                    <div class="product-meta">
                        <span class="product-fabric">${item.fabric}</span>
                        <span class="product-price">₹${item.price.toLocaleString('en-IN')}</span>
                    </div>
                    <h3 class="product-title" onclick="openQuickview('${item.id}')" style="cursor: pointer;">${item.name}</h3>
                    <p class="product-desc">${item.desc}</p>
                    <div class="product-card-actions">
                        <button class="btn btn-whatsapp" onclick="sendWhatsAppInquiry('${item.id}')">
                            <i class="fa-brands fa-whatsapp"></i> Inquire via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Admin inventory item checklist (with delete options)
function renderAdminInventory() {
    inventoryCount.textContent = inventory.length;

    if (inventory.length === 0) {
        inventoryList.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem;">Your inventory is empty.</p>`;
        return;
    }

    inventoryList.innerHTML = inventory.map(item => {
        return `
            <div class="inventory-item">
                <img class="inventory-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=150'">
                <div class="inventory-item-info">
                    <h5>${item.name}</h5>
                    <span>₹${item.price.toLocaleString('en-IN')} | ${item.category}</span>
                </div>
                <div class="inventory-item-actions">
                    <button class="btn-icon-delete" onclick="deleteItem('${item.id}')" title="Delete apparel from shop">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// --- Quick View Modal Actions ---
window.openQuickview = function(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    quickviewContent.innerHTML = `
        <div class="quickview-layout">
            <div class="quickview-img-wrapper">
                <img class="quickview-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'">
            </div>
            <div class="quickview-details">
                <span class="quickview-category">${item.category}</span>
                <h3 class="quickview-title">${item.name}</h3>
                <div class="quickview-price-tag">₹${item.price.toLocaleString('en-IN')}</div>
                
                <div class="quickview-specs">
                    <div class="spec-item">
                        <span class="spec-label">Fabric</span>
                        <span class="spec-val">${item.fabric}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Color</span>
                        <span class="spec-val">${item.color}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Availability</span>
                        <span class="spec-val" style="color: var(--success-color); font-weight: 600;">In Stock</span>
                    </div>
                </div>

                <p class="quickview-desc">${item.desc}</p>
                
                <button class="btn btn-whatsapp btn-large" style="margin-top: auto;" onclick="sendWhatsAppInquiry('${item.id}')">
                    <i class="fa-brands fa-whatsapp"></i> Inquire via WhatsApp
                </button>
            </div>
        </div>
    `;

    quickviewModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
};

function closeQuickview() {
    quickviewModal.classList.add('hidden');
    document.body.style.overflow = ''; // restore scrolling
}

// --- WhatsApp Messaging ---
window.sendWhatsAppInquiry = function(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    // Contact number configured for the business (can be configured)
    const whatsappNum = '919663975672';
    
    // Construct message body
    const msg = `Hi House of Clothes, I am interested in inquiring about this product:

*Name:* ${item.name}
*Category:* ${item.category}
*Fabric:* ${item.fabric}
*Price:* ₹${item.price.toLocaleString('en-IN')}

Please let me know if this is available. Thank you!`;

    // Encode string for URI
    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedMsg}`;

    // Open WhatsApp link
    window.open(whatsappUrl, '_blank');
};

// --- Passcode / Authentication Controls ---
function requestAdminAccess() {
    // Check if already authenticated in this session
    if (sessionStorage.getItem('hoc_authenticated') === 'true') {
        toggleAdminDrawer(true);
    } else {
        openPasscodeModal();
    }
}

function openPasscodeModal() {
    passcodeError.classList.add('hidden');
    adminPasscodeInput.value = '';
    passcodeModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
    adminPasscodeInput.focus();
}

function closePasscodeModal() {
    passcodeModal.classList.add('hidden');
    document.body.style.overflow = ''; // restore scrolling
}

function handlePasscodeSubmit(e) {
    e.preventDefault();
    const enteredCode = adminPasscodeInput.value.trim();

    // Passcode is '1984'
    if (enteredCode === '1984') {
        sessionStorage.setItem('hoc_authenticated', 'true');
        closePasscodeModal();
        toggleAdminDrawer(true);
        showToast('Owner access authorized.');
    } else {
        passcodeError.classList.remove('hidden');
        adminPasscodeInput.value = '';
        adminPasscodeInput.focus();
    }
}
