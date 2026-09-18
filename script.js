const STORAGE_KEY = "pantryboard-materials-v1";
const ELECTRONICS_STORAGE_KEY = "pantryboard-electronics-v1";
const defaultMaterials = [
	{ id: 1, name: "Corned beef", category: "Canned goods", quantity: 18, unit: "can", price: "₱48", icon: "🥫" },
	{ id: 2, name: "Sardines", category: "Canned goods", quantity: 12, unit: "can", price: "₱27", icon: "🐟" },
	{ id: 3, name: "Cola", category: "Soft drinks", quantity: 24, unit: "bottle", price: "₱35", icon: "🥤" },
	{ id: 4, name: "Bottled water", category: "Beverages", quantity: 30, unit: "bottle", price: "₱20", icon: "💧" },
	{ id: 5, name: "Instant noodles", category: "Dry goods", quantity: 8, unit: "pack", price: "₱18", icon: "🍜" },
	{ id: 6, name: "Rice", category: "Dry goods", quantity: 4, unit: "sack", price: "₱1,850", icon: "🌾" },
	{ id: 7, name: "Biscuits", category: "Snacks", quantity: 16, unit: "pack", price: "₱32", icon: "🍪" },
	{ id: 8, name: "Coffee", category: "Pantry", quantity: 3, unit: "jar", price: "₱165", icon: "☕" },
	{ id: 9, name: "Apples", category: "Fruits", quantity: 20, unit: "piece", price: "₱30", icon: "🍎" },
	{ id: 10, name: "Carrots", category: "Vegetables", quantity: 14, unit: "bundle", price: "₱45", icon: "🥕" },
	{ id: 11, name: "Chicken", category: "Meat", quantity: 10, unit: "pack", price: "₱180", icon: "🍗" },
	{ id: 12, name: "Eggs", category: "Dairy", quantity: 6, unit: "tray", price: "₱120", icon: "🥚" },
	{ id: 13, name: "Bread", category: "Bakery", quantity: 9, unit: "loaf", price: "₱55", icon: "🍞" },
	{ id: 14, name: "Milk", category: "Dairy", quantity: 11, unit: "bottle", price: "₱68", icon: "🥛" },
	{ id: 15, name: "Tilapia", category: "Seafood", quantity: 7, unit: "pack", price: "₱210", icon: "🐟" }
];

let materials = loadMaterials();
let electronicsItems = loadElectronics();

function loadElectronics() {
	try {
		const saved = JSON.parse(localStorage.getItem(ELECTRONICS_STORAGE_KEY));
		if (Array.isArray(saved) && saved.length) return saved;
	} catch (error) {
		console.warn("Unable to load saved electronics.", error);
	}
	return [
	{ id: 1, name: "ESP32", category: "microcontroller", type: "Microcontroller", stock: 8, unit: "pcs", price: "₱250", icon: "📡" },
	{ id: 2, name: "Arduino Uno", category: "microcontroller", type: "Microcontroller", stock: 5, unit: "pcs", price: "₱480", icon: "🔧" },
	{ id: 3, name: "IR Sensor", category: "sensor", type: "Sensor", stock: 12, unit: "pcs", price: "₱65", icon: "📡" },
	{ id: 4, name: "HC-05 Bluetooth", category: "connectivity", type: "Connectivity", stock: 4, unit: "pcs", price: "₱200", icon: "📶" },
	{ id: 5, name: "Breadboard", category: "prototype", type: "Prototype", stock: 17, unit: "pcs", price: "₱120", icon: "🧩" },
	{ id: 6, name: "Resistor Kit", category: "power", type: "Power", stock: 3, unit: "set", price: "₱180", icon: "⚙️" },
	{ id: 7, name: "LED Strip", category: "display", type: "Display", stock: 9, unit: "roll", price: "₱260", icon: "💡" },
	{ id: 8, name: "LM2596 Module", category: "power", type: "Power", stock: 6, unit: "pcs", price: "₱150", icon: "🔋" },
	{ id: 9, name: "LDR Sensor", category: "sensor", type: "Sensor", stock: 10, unit: "pcs", price: "₱70", icon: "🌗" },
	{ id: 10, name: "OLED Display", category: "display", type: "Display", stock: 7, unit: "pcs", price: "₱220", icon: "🖥️" },
	{ id: 11, name: "Jumper Wires", category: "connectivity", type: "Connectivity", stock: 14, unit: "pack", price: "₱55", icon: "🔌" },
	{ id: 12, name: "Servo Motor", category: "actuator", type: "Actuator", stock: 2, unit: "pcs", price: "₱310", icon: "🤖" }
];
}

function saveElectronics() {
	localStorage.setItem(ELECTRONICS_STORAGE_KEY, JSON.stringify(electronicsItems));
}
let activeElectronicsFilter = "all";

const overviewSection = document.getElementById("overviewSection");
const pantrySection = document.getElementById("pantrySection");
const allMaterialsPage = document.getElementById("allMaterialsPage");
const electronicsSection = document.getElementById("electronicsSection");
const sidebarButtons = document.querySelectorAll(".side-nav button");
const grid = document.getElementById("itemsGrid");
const materialModal = document.getElementById("materialModal");
const addMaterialForm = document.getElementById("addMaterialForm");
const materialCategory = document.getElementById("materialCategory");
const headerDate = document.getElementById("headerDate");
const liveClock = document.getElementById("liveClock");
const greetingText = document.getElementById("greetingText");
const electronicsGrid = document.getElementById("electronicsGrid");
const electronicsSearch = document.getElementById("electronicsSearch");
const electronicsCount = document.getElementById("electronicsCount");
const electronicsFilters = document.querySelectorAll(".electronics-filter");
const appShell = document.querySelector(".app-shell");
const electronicsDashboardList = document.getElementById("electronicsDashboardList");
const pageDescription = document.querySelector(".date");
const electronicsModal = document.getElementById("electronicsModal");
const addElectronicsForm = document.getElementById("addElectronicsForm");
const addItemButton = document.getElementById("addItemButton");
const addElectronicsButton = document.getElementById("addElectronicsButton");

function loadMaterials() {
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
		if (Array.isArray(saved) && saved.length) return saved;
	} catch (error) {
		console.warn("Unable to load saved materials.", error);
	}
	return [...defaultMaterials];
}

function saveMaterials() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
}

function updateHeaderClock() {
	const now = new Date();
	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	const timeFormatter = new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true
	});

	headerDate.textContent = dateFormatter.format(now);
	liveClock.textContent = timeFormatter.format(now);

	const hour = now.getHours();
	if (hour < 12) {
		greetingText.textContent = "Good morning, Engr.";
	} else if (hour < 18) {
		greetingText.textContent = "Good afternoon, Engr.";
	} else {
		greetingText.textContent = "Good evening, Engr.";
	}
}

function formatPeso(value) {
	const numericValue = Number(String(value).replace(/[^\d.-]/g, ""));
	if (Number.isNaN(numericValue)) return "₱0";
	return `₱${numericValue.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function escapeHtml(value) {
	return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function itemVisual(item, className) {
	if (item.image && (/^https?:\/\//i.test(item.image) || /^data:image\/png;base64,/i.test(item.image))) {
		return `<img class="${className}-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">`;
	}
	return `<span aria-hidden="true">${item.icon || "📦"}</span>`;
}

function readPngFile(file) {
	return new Promise((resolve, reject) => {
		if (!file || file.size === 0) {
			resolve("");
			return;
		}
		if (file.type !== "image/png") {
			reject(new Error("Please choose a PNG image."));
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			reject(new Error("Please choose a PNG smaller than 2 MB."));
			return;
		}
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(new Error("Unable to read the selected image."));
		reader.readAsDataURL(file);
	});
}

function previewImage(input, preview) {
	const file = input.files[0];
	if (!file) {
		preview.hidden = true;
		preview.removeAttribute("src");
		return;
	}
	readPngFile(file).then(imageData => {
		preview.src = imageData;
		preview.hidden = false;
	}).catch(error => {
		input.value = "";
		preview.hidden = true;
		alert(error.message);
	});
}

function populateCategoryOptions() {
	const categories = [...new Set(materials.map(item => item.category))].sort();
	const currentFormValue = materialCategory.value;
	materialCategory.innerHTML = '<option value="">Select</option>' + categories.map(category => `<option value="${category}">${category}</option>`).join("") + '<option value="custom">Custom category</option>';
	materialCategory.value = categories.includes(currentFormValue) ? currentFormValue : "";
}

function fillCustomCategory() {
	if (materialCategory.value !== "custom") return;
	const customCategory = window.prompt("Enter a new category name:", "");
	if (!customCategory) {
		materialCategory.value = "";
		return;
	}
	const trimmed = customCategory.trim();
	if (!trimmed) {
		materialCategory.value = "";
		return;
	}
	const option = document.createElement("option");
	option.value = trimmed;
	option.textContent = trimmed;
	materialCategory.add(option);
	materialCategory.value = trimmed;
}

function openMaterialModal() {
	materialModal.classList.add("open");
	materialModal.setAttribute("aria-hidden", "false");
	setTimeout(() => document.getElementById("materialName").focus(), 50);
}

function closeMaterialModal() {
	materialModal.classList.remove("open");
	materialModal.setAttribute("aria-hidden", "true");
	addMaterialForm.reset();
	document.getElementById("materialQuantity").value = 1;
	materialCategory.value = "";
	document.getElementById("materialImagePreview").hidden = true;
}

function openElectronicsModal() {
	electronicsModal.classList.add("open");
	electronicsModal.setAttribute("aria-hidden", "false");
	setTimeout(() => document.getElementById("electronicsName").focus(), 50);
}

function closeElectronicsModal() {
	electronicsModal.classList.remove("open");
	electronicsModal.setAttribute("aria-hidden", "true");
	addElectronicsForm.reset();
	document.getElementById("electronicsStock").value = 1;
	document.getElementById("electronicsImagePreview").hidden = true;
}

function renderTableView() {
	const tableBody = document.getElementById("materialsTableBody");
	tableBody.innerHTML = materials.map(item => `
		<tr>
			<td><span class="list-badge">${itemVisual(item, "list-badge")}<strong>${item.name}</strong></span></td>
			<td>${item.category}</td>
			<td>${item.quantity} ${item.unit}</td>
			<td>${item.price}</td>
			<td><span class="material-row-tag">${item.quantity <= 5 ? "Low stock" : "In stock"}</span></td>
		</tr>
	`).join("");
}

function render() {
	grid.innerHTML = materials.map(item => `
		<article class="item-card">
			<div class="item-top"><div class="item-icon">${itemVisual(item, "item-icon")}</div><span class="status ${item.quantity <= 5 ? "low" : ""}">${item.quantity <= 5 ? "Low stock" : "In stock"}</span></div>
			<h3>${item.name}</h3><span class="item-category">${item.category}</span>
			<div class="item-footer"><div class="quantity" aria-label="${item.name} quantity"><button type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name}">−</button><strong>${item.quantity}</strong><button type="button" data-action="increase" data-id="${item.id}" aria-label="Increase ${item.name}">+</button></div><span class="unit-price">${formatPeso(item.price)} / ${item.unit}</span></div>
			<button type="button" class="remove-item-btn" data-remove-id="${item.id}" aria-label="Remove ${item.name}">Remove</button>
		</article>`).join("");

	document.getElementById("totalMaterials").textContent = materials.reduce((sum, item) => sum + item.quantity, 0);
	document.getElementById("totalCategories").textContent = new Set(materials.map(item => item.category)).size;
	document.getElementById("lowStock").textContent = materials.filter(item => item.quantity <= 5).length;
	document.getElementById("electronicsTotal").textContent = electronicsItems.length;
	document.getElementById("electronicsLowStock").textContent = electronicsItems.filter(item => item.stock <= 5).length;
	electronicsDashboardList.innerHTML = electronicsItems.map(item => `
		<div class="dashboard-electronics-item">
			<span class="dashboard-electronics-name">${itemVisual(item, "dashboard-electronics-name")}<strong>${item.name}</strong></span>
			<span class="dashboard-electronics-stock ${item.stock <= 5 ? "low" : ""}">${item.stock} ${item.unit}</span>
		</div>
	`).join("") || '<div class="empty-state">No electronics saved.</div>';
	renderTableView();
}

function showPage(pageName) {
	appShell.classList.toggle("electronics-mode", pageName === "electronics");
	overviewSection.hidden = pageName !== "overview";
	pantrySection.classList.toggle("visible", pageName === "pantry");
	allMaterialsPage.classList.toggle("visible", pageName === "all");
	electronicsSection.classList.toggle("visible", pageName === "electronics");
	addItemButton.hidden = pageName !== "pantry";
	addElectronicsButton.hidden = pageName !== "electronics";
	pageDescription.textContent = pageName === "electronics"
		? "Manage your boards, modules, sensors, and accessories."
		: pageName === "pantry"
			? "Adjust your pantry stock count with the controls on each item."
			: pageName === "all"
				? "Review every pantry item in your inventory."
				: "See the current status of your pantry and electronics.";
	sidebarButtons.forEach(button => {
		button.classList.toggle("active", button.dataset.page === pageName);
	});
	document.querySelector(".summary-grid").style.display = pageName === "overview" ? "grid" : "none";
}

function renderElectronics() {
	const searchQuery = electronicsSearch.value.trim().toLowerCase();
	const filtered = electronicsItems.filter(item => {
		const matchesCategory = activeElectronicsFilter === "all" || item.category === activeElectronicsFilter;
		const matchesSearch = item.name.toLowerCase().includes(searchQuery) || item.type.toLowerCase().includes(searchQuery);
		return matchesCategory && matchesSearch;
	});

	electronicsGrid.innerHTML = filtered.map(item => `
		<article class="electronics-card">
			<div class="electronics-card-top">
				<div class="electronics-icon">${itemVisual(item, "electronics-icon")}</div>
				<span class="electronics-status ${item.stock <= 5 ? "low" : ""}">${item.stock <= 5 ? "Low stock" : "Ready"}</span>
			</div>
			<h3>${item.name}</h3>
			<span class="electronics-type">${item.type}</span>
			<div class="electronics-card-meta">
				<span>${item.stock} ${item.unit}</span>
				<span class="electronics-price">${item.price}</span>
			</div>
			<div class="electronics-controls">
				<div class="electronics-qty" aria-label="${item.name} stock count">
					<button type="button" data-electronics-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name}">−</button>
					<strong>${item.stock}</strong>
					<button type="button" data-electronics-action="increase" data-id="${item.id}" aria-label="Increase ${item.name}">+</button>
				</div>
			</div>
			<button type="button" class="electronics-remove-btn" data-electronics-remove-id="${item.id}">Remove</button>
		</article>
	`).join("") || '<div class="empty-state">No electronics match your search.</div>';

	electronicsCount.textContent = `${filtered.length} items`;
}

grid.addEventListener("click", event => {
	const removeButton = event.target.closest("button[data-remove-id]");
	if (removeButton) {
		const itemId = Number(removeButton.dataset.removeId);
		materials = materials.filter(material => material.id !== itemId);
		saveMaterials();
		render();
		return;
	}

	const button = event.target.closest("button[data-action]");
	if (!button) return;
	const item = materials.find(material => material.id === Number(button.dataset.id));
	if (!item) return;
	if (button.dataset.action === "increase") item.quantity += 1;
	if (button.dataset.action === "decrease" && item.quantity > 0) item.quantity -= 1;
	saveMaterials();
	render();
});

document.querySelectorAll(".view-btn").forEach(button => {
	button.addEventListener("click", () => {
		document.querySelectorAll(".view-btn").forEach(item => item.classList.toggle("active", item === button));
		allMaterialsPage.classList.toggle("list-view", button.dataset.view === "list");
	});
});

sidebarButtons.forEach(button => {
	button.addEventListener("click", () => {
		showPage(button.dataset.page);
	});
});

electronicsSearch.addEventListener("input", renderElectronics);

document.querySelectorAll(".electronics-filter").forEach(button => {
	button.addEventListener("click", () => {
		document.querySelectorAll(".electronics-filter").forEach(item => item.classList.toggle("active", item === button));
		activeElectronicsFilter = button.dataset.category;
		renderElectronics();
	});
});

electronicsGrid.addEventListener("click", event => {
	const removeButton = event.target.closest("button[data-electronics-remove-id]");
	if (removeButton) {
		const itemId = Number(removeButton.dataset.electronicsRemoveId);
		electronicsItems = electronicsItems.filter(item => item.id !== itemId);
		saveElectronics();
		renderElectronics();
		render();
		return;
	}

	const target = event.target.closest("[data-electronics-action]");
	if (!target) return;
	const item = electronicsItems.find(component => component.id === Number(target.dataset.id));
	if (!item) return;
	if (target.dataset.electronicsAction === "increase") item.stock += 1;
	if (target.dataset.electronicsAction === "decrease" && item.stock > 0) item.stock -= 1;
	saveElectronics();
	renderElectronics();
});

document.getElementById("addElectronicsButton").addEventListener("click", openElectronicsModal);
document.getElementById("closeElectronicsModalButton").addEventListener("click", closeElectronicsModal);
document.getElementById("cancelElectronicsButton").addEventListener("click", closeElectronicsModal);
electronicsModal.addEventListener("click", event => {
	if (event.target === electronicsModal) closeElectronicsModal();
});

document.getElementById("materialImage").addEventListener("change", event => previewImage(event.target, document.getElementById("materialImagePreview")));
document.getElementById("electronicsImage").addEventListener("change", event => previewImage(event.target, document.getElementById("electronicsImagePreview")));

addElectronicsForm.addEventListener("submit", async event => {
	event.preventDefault();
	const formData = new FormData(addElectronicsForm);
	const name = String(formData.get("name") || "").trim().replace(/\s+/g, " ");
	const category = String(formData.get("category") || "").trim();
	const type = String(formData.get("type") || "").trim();
	const stock = Number(formData.get("stock"));
	const unit = String(formData.get("unit") || "").trim();
	const price = formatPeso(String(formData.get("price") || "").trim());
	let image;
	try {
		image = await readPngFile(formData.get("image"));
	} catch (error) {
		alert(error.message);
		return;
	}

	if (!name || !category || !type || Number.isNaN(stock) || stock < 0 || !unit) {
		alert("Please fill in all required component fields with valid values.");
		return;
	}

	const existingItem = electronicsItems.find(item => item.name.toLowerCase() === name.toLowerCase());
	if (existingItem) {
		existingItem.stock += stock;
		existingItem.category = category;
		existingItem.type = type;
		existingItem.unit = unit;
		existingItem.price = price;
		existingItem.image = image;
	} else {
		electronicsItems.push({ id: Date.now(), name, category, type, stock, unit, price, icon: "🔩", image });
	}

	saveElectronics();
	closeElectronicsModal();
	renderElectronics();
	render();
});

materialCategory.addEventListener("change", fillCustomCategory);

document.getElementById("addItemButton").addEventListener("click", openMaterialModal);
document.getElementById("closeModalButton").addEventListener("click", closeMaterialModal);
document.getElementById("cancelMaterialButton").addEventListener("click", closeMaterialModal);
materialModal.addEventListener("click", event => {
	if (event.target === materialModal) closeMaterialModal();
});

addMaterialForm.addEventListener("submit", async event => {
	event.preventDefault();
	const formData = new FormData(addMaterialForm);
	const rawName = String(formData.get("name") || "").trim();
	const category = String(formData.get("category") || "").trim();
	const quantity = Number(formData.get("quantity"));
	const unit = String(formData.get("unit") || "").trim();
	const price = formatPeso(String(formData.get("price") || "").trim());
	const icon = "📦";
	const name = rawName.replace(/\s+/g, " ").replace(/\b\w/g, ch => ch.toUpperCase());
	let image;
	try {
		image = await readPngFile(formData.get("image"));
	} catch (error) {
		alert(error.message);
		return;
	}

	if (!name || !category || !unit || Number.isNaN(quantity) || quantity < 0) {
		alert("Please fill in all required fields with valid values.");
		return;
	}

	const existingItem = materials.find(item => item.name.toLowerCase() === name.toLowerCase());
	if (existingItem) {
		existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
		existingItem.category = category;
		existingItem.unit = unit;
		existingItem.price = price;
		existingItem.icon = icon;
		existingItem.image = image;
		saveMaterials();
		populateCategoryOptions();
		closeMaterialModal();
		render();
		return;
	}

	materials.push({
		id: Date.now(),
		name,
		category,
		quantity,
		unit,
		price,
		icon,
		image
	});

	saveMaterials();
	populateCategoryOptions();
	closeMaterialModal();
	render();
});

showPage("overview");
populateCategoryOptions();
updateHeaderClock();
setInterval(updateHeaderClock, 1000);
renderElectronics();
render();
