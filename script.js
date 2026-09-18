const STORAGE_KEY = "pantryboard-materials-v1";
const ELECTRONICS_STORAGE_KEY = "pantryboard-electronics-v1";
const SCHEDULE_STORAGE_KEY = "pantryboard-schedule-v1";
const TODO_STORAGE_KEY = "mydashboard-todos-v1";
const NOTES_STORAGE_KEY = "mydashboard-notes-v1";
const NAVIGATION_COLORS_STORAGE_KEY = "mydashboard-navigation-colors-v1";
const GREETING_STORAGE_KEY = "mydashboard-greeting-v1";
const NAVIGATION_STORAGE_KEY = "mydashboard-navigation-v1";
const pantryCategories = [
	"Beverages",
	"Canned goods",
	"Dry goods",
	"Snacks",
	"Fruits",
	"Vegetables",
	"Meat",
	"Seafood",
	"Dairy",
	"Bakery",
	"Frozen foods",
	"Condiments",
	"Spices",
	"Grains",
	"Pasta",
	"Cooking essentials",
	"Breakfast foods",
	"Sweets",
	"Household supplies",
	"Personal care"
];
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
let scheduleEntries = loadSchedule();
let todoEntries = loadStoredList(TODO_STORAGE_KEY);
let noteEntries = loadStoredList(NOTES_STORAGE_KEY);
let editingScheduleId = null;

function loadElectronics() {
	try {
		const saved = JSON.parse(localStorage.getItem(ELECTRONICS_STORAGE_KEY));
		if (Array.isArray(saved)) return saved;
	} catch (error) {
		console.warn("Unable to load saved electronics.", error);
	}
	return [];
}

function saveElectronics() {
	localStorage.setItem(ELECTRONICS_STORAGE_KEY, JSON.stringify(electronicsItems));
}

function loadSchedule() {
	try {
		const saved = JSON.parse(localStorage.getItem(SCHEDULE_STORAGE_KEY));
		if (Array.isArray(saved)) return saved;
	} catch (error) {
		console.warn("Unable to load saved schedule.", error);
	}
	return [];
}

function saveSchedule() {
	localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(scheduleEntries));
}

function loadStoredList(storageKey) {
	try {
		const saved = JSON.parse(localStorage.getItem(storageKey));
		return Array.isArray(saved) ? saved : [];
	} catch (error) {
		console.warn(`Unable to load ${storageKey}.`, error);
		return [];
	}
}

function saveStoredList(storageKey, entries) {
	localStorage.setItem(storageKey, JSON.stringify(entries));
}

function saveAllData() {
	try {
		saveMaterials();
		saveElectronics();
		saveSchedule();
		saveStoredList(TODO_STORAGE_KEY, todoEntries);
		saveStoredList(NOTES_STORAGE_KEY, noteEntries);
	} catch (error) {
		console.warn("Unable to save all dashboard data.", error);
	}
}
let activeElectronicsFilter = "all";

const overviewSection = document.getElementById("overviewSection");
const pantrySection = document.getElementById("pantrySection");
const allMaterialsPage = document.getElementById("allMaterialsPage");
const electronicsSection = document.getElementById("electronicsSection");
const sidebarButtons = document.querySelectorAll(".side-nav button");
const navHighlight = document.getElementById("navHighlight");
const grid = document.getElementById("itemsGrid");
const materialModal = document.getElementById("materialModal");
const addMaterialForm = document.getElementById("addMaterialForm");
const materialCategory = document.getElementById("materialCategory");
const categorySuggestions = document.getElementById("categorySuggestions");
const headerDate = document.getElementById("headerDate");
const liveClock = document.getElementById("liveClock");
const dayGreeting = document.getElementById("dayGreeting");
const greetingName = document.getElementById("greetingName");
const clockHours = document.getElementById("clockHours");
const clockMinutes = document.getElementById("clockMinutes");
const clockSeconds = document.getElementById("clockSeconds");
const clockPeriod = document.getElementById("clockPeriod");
const greetingText = document.getElementById("greetingText");
const electronicsGrid = document.getElementById("electronicsGrid");
const electronicsSearch = document.getElementById("electronicsSearch");
const electronicsCount = document.getElementById("electronicsCount");
const electronicsFilters = document.querySelectorAll(".electronics-filter");
const appShell = document.querySelector(".app-shell");
const pageDescription = document.querySelector(".date");
const electronicsModal = document.getElementById("electronicsModal");
const addElectronicsForm = document.getElementById("addElectronicsForm");
const addItemButton = document.getElementById("addItemButton");
const addElectronicsButton = document.getElementById("addElectronicsButton");
const mainContent = document.querySelector("main");
const savedGreeting = localStorage.getItem(GREETING_STORAGE_KEY);

if (savedGreeting && !/^Good (morning|afternoon|evening),?\s*Engr\.?$/i.test(savedGreeting)) {
	greetingName.textContent = savedGreeting;
} else if (savedGreeting) {
	localStorage.removeItem(GREETING_STORAGE_KEY);
}
const scheduleSection = document.getElementById("scheduleSection");
const scheduleWeek = document.getElementById("scheduleWeek");
const scheduleModal = document.getElementById("scheduleModal");
const scheduleForm = document.getElementById("scheduleForm");
const scheduleModalTitle = document.getElementById("scheduleModalTitle");
const saveScheduleButton = document.getElementById("saveScheduleButton");
const todoSection = document.getElementById("todoSection");
const notesSection = document.getElementById("notesSection");
const todoList = document.getElementById("todoList");
const notesList = document.getElementById("notesList");
const navigationManagerButton = document.getElementById("navigationManagerButton");
const navigationModal = document.getElementById("navigationModal");
const navigationOptions = document.getElementById("navigationOptions");
const navigationPages = [
	{ id: "overview", label: "Overview", icon: "▦" },
	{ id: "all", label: "All materials", icon: "▤" },
	{ id: "pantry", label: "Pantry", icon: "▥" },
	{ id: "electronics", label: "Electronics", icon: "⚡" },
	{ id: "schedule", label: "Schedule", icon: "▣" },
	{ id: "todo", label: "To-do list", icon: "☑" },
	{ id: "notes", label: "Notes", icon: "▰" }
];

let visibleNavigationPages = loadVisibleNavigationPages();
let navigationColors = loadNavigationColors();

function loadVisibleNavigationPages() {
	try {
		const saved = JSON.parse(localStorage.getItem(NAVIGATION_STORAGE_KEY));
		if (Array.isArray(saved)) return navigationPages.map(page => page.id).filter(id => saved.includes(id));
	} catch (error) {
		console.warn("Unable to load navigation settings.", error);
	}
	return navigationPages.map(page => page.id);
}

function saveVisibleNavigationPages() {
	localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(visibleNavigationPages));
}

function loadNavigationColors() {
	const defaults = {
		overview: "#2e7048",
		all: "#4d7560",
		pantry: "#2e7048",
		electronics: "#1f5de8",
		schedule: "#e67e35",
		todo: "#7a5bb5",
		notes: "#c56836"
	};
	try {
		const saved = JSON.parse(localStorage.getItem(NAVIGATION_COLORS_STORAGE_KEY));
		return { ...defaults, ...(saved && typeof saved === "object" ? saved : {}) };
	} catch (error) {
		console.warn("Unable to load navigation colors.", error);
		return defaults;
	}
}

function saveNavigationColors() {
	localStorage.setItem(NAVIGATION_COLORS_STORAGE_KEY, JSON.stringify(navigationColors));
}

function renderNavigationOptions() {
	navigationOptions.innerHTML = navigationPages.map(page => `<label class="navigation-option"><input type="checkbox" data-navigation-page="${page.id}" ${visibleNavigationPages.includes(page.id) ? "checked" : ""}><span>${page.icon}</span><strong>${page.label}</strong><input class="navigation-color" type="color" value="${navigationColors[page.id]}" data-navigation-color="${page.id}" aria-label="Choose ${page.label} color"></label>`).join("");
}

function applyNavigationVisibility() {
	sidebarButtons.forEach(button => {
		button.hidden = !visibleNavigationPages.includes(button.dataset.page);
	});
}

function applyNavigationColors() {
	const activePage = document.querySelector(".side-nav button.active")?.dataset.page || "overview";
	const activeColor = navigationColors[activePage] || "#2e7048";
	appShell.classList.add("custom-theme");
	appShell.style.setProperty("--tab-color", activeColor);
	navHighlight.style.setProperty("--highlight-color", activeColor);
	requestAnimationFrame(() => {
		const activeButton = document.querySelector(".side-nav button.active");
		if (!activeButton) return;
		navHighlight.style.height = `${activeButton.offsetHeight}px`;
		navHighlight.style.transform = `translateY(${activeButton.offsetTop}px)`;
	});
}

function loadMaterials() {
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
		if (Array.isArray(saved)) return saved;
	} catch (error) {
		console.warn("Unable to load saved materials.", error);
	}
	return [];
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
	headerDate.textContent = dateFormatter.format(now);
	updateClockSegment(clockHours, String((now.getHours() % 12) || 12).padStart(2, "0"));
	updateClockSegment(clockMinutes, String(now.getMinutes()).padStart(2, "0"));
	updateClockSegment(clockSeconds, String(now.getSeconds()).padStart(2, "0"));
	updateClockSegment(clockPeriod, now.getHours() < 12 ? "AM" : "PM");
	dayGreeting.textContent = now.getHours() < 12 ? "Good morning," : now.getHours() < 18 ? "Good afternoon," : "Good evening,";

}

function updateClockSegment(segment, value) {
	if (segment.textContent === value) return;
	segment.textContent = value;
	segment.classList.remove("clock-tick");
	void segment.offsetWidth;
	segment.classList.add("clock-tick");
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
	const savedCategories = [...new Set(materials.map(item => item.category).filter(Boolean))];
	const standardCategories = [...new Set(pantryCategories)].sort();
	const extraCategories = savedCategories.filter(category => !standardCategories.includes(category)).sort();
	const currentFormValue = materialCategory.value;
	categorySuggestions.dataset.categories = JSON.stringify([...standardCategories, ...extraCategories]);
	materialCategory.value = currentFormValue;
}

function renderCategorySuggestions() {
	const categories = JSON.parse(categorySuggestions.dataset.categories || "[]");
	const query = materialCategory.value.trim().toLowerCase();
	const matches = categories.filter(category => category.toLowerCase().includes(query));
	categorySuggestions.innerHTML = matches.map(category => `<button type="button" role="option" data-category-value="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");
	categorySuggestions.classList.toggle("open", matches.length > 0);
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

function getWeekDates() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const monday = new Date(today);
	const dayOffset = (today.getDay() + 6) % 7;
	monday.setDate(today.getDate() - dayOffset);
	return Array.from({ length: 7 }, (_, index) => {
		const date = new Date(monday);
		date.setDate(monday.getDate() + index);
		return date;
	});
}

function formatScheduleDate(date, options) {
	return new Intl.DateTimeFormat("en-US", options).format(date);
}

function toLocalDateValue(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function formatScheduleTime(time) {
	if (!time) return "";
	const [hours, minutes] = time.split(":").map(Number);
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;
	const period = hours >= 12 ? "PM" : "AM";
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function renderSchedule() {
	const weekDates = getWeekDates();
	scheduleWeek.innerHTML = weekDates.map((date, dayIndex) => {
		const entries = scheduleEntries.filter(entry => entry.dayIndex === dayIndex).sort((first, second) => (first.startTime || first.time).localeCompare(second.startTime || second.time));
		return `<article class="schedule-day ${date.toDateString() === new Date().toDateString() ? "today" : ""}">
			<header><span>${formatScheduleDate(date, { weekday: "long" })}</span><strong>${formatScheduleDate(date, { month: "short", day: "numeric" })}</strong></header>
			<div class="schedule-day-items">${entries.map(entry => `<div class="schedule-entry">
				<div class="schedule-entry-time">${formatScheduleTime(entry.startTime || entry.time)} - ${formatScheduleTime(entry.endTime || entry.startTime || entry.time)}</div><strong>${escapeHtml(entry.subject)}</strong>${entry.details ? `<span>${escapeHtml(entry.details)}</span>` : ""}
				<div class="schedule-entry-actions"><button type="button" data-schedule-edit-id="${entry.id}">Edit</button><button type="button" data-schedule-remove-id="${entry.id}">Remove</button></div>
			</div>`).join("") || '<p class="schedule-empty">No subjects</p>'}</div>
		</article>`;
	}).join("");
}

function openScheduleModal(entry) {
	editingScheduleId = entry ? entry.id : null;
	scheduleModalTitle.textContent = entry ? "Edit subject" : "Add subject";
	saveScheduleButton.textContent = entry ? "Update subject" : "Save subject";
	scheduleForm.reset();
	const dates = getWeekDates();
	document.getElementById("scheduleDate").value = entry ? toLocalDateValue(dates[entry.dayIndex]) : toLocalDateValue(dates[0]);
	if (entry) {
		document.getElementById("scheduleSubject").value = entry.subject;
		document.getElementById("scheduleStartTime").value = entry.startTime || entry.time;
		document.getElementById("scheduleEndTime").value = entry.endTime || entry.time;
		document.getElementById("scheduleRoom").value = entry.details || "";
	}
	scheduleModal.classList.add("open");
	scheduleModal.setAttribute("aria-hidden", "false");
	setTimeout(() => document.getElementById("scheduleSubject").focus(), 50);
}

function closeScheduleModal() {
	scheduleModal.classList.remove("open");
	scheduleModal.setAttribute("aria-hidden", "true");
	scheduleForm.reset();
	editingScheduleId = null;
}

function openNavigationModal() {
	renderNavigationOptions();
	navigationModal.classList.add("open");
	navigationModal.setAttribute("aria-hidden", "false");
}

function closeNavigationModal() {
	navigationModal.classList.remove("open", "closing");
	navigationModal.setAttribute("aria-hidden", "true");
}

function renderTodoList() {
	todoList.innerHTML = todoEntries.map(entry => `<div class="todo-entry ${entry.done ? "done" : ""}"><label><input type="checkbox" data-todo-toggle="${entry.id}" ${entry.done ? "checked" : ""}><span>${escapeHtml(entry.text)}</span></label><button type="button" data-todo-remove="${entry.id}" aria-label="Remove task">Remove</button></div>`).join("") || '<div class="empty-state">No tasks yet.</div>';
}

function renderNotes() {
	notesList.innerHTML = noteEntries.map(entry => `<article class="note-entry"><div><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.text)}</p></div><button type="button" data-note-remove="${entry.id}" aria-label="Remove note">Remove</button></article>`).join("") || '<div class="empty-state">No notes yet.</div>';
}

function renderTableView() {
	const tableBody = document.getElementById("materialsTableBody");
	if (!materials.length) {
		tableBody.innerHTML = '<tr><td colspan="5" class="table-empty-state">No consumables yet. Add your first item from the Pantry tab.</td></tr>';
		return;
	}
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
		</article>`).join("") || '<div class="empty-state">No consumables yet. Use Add material to create your first item.</div>';

	document.getElementById("totalMaterials").textContent = materials.reduce((sum, item) => sum + item.quantity, 0);
	document.getElementById("lowStock").textContent = materials.filter(item => item.quantity <= 5).length;
	document.getElementById("electronicsTotal").textContent = electronicsItems.length;
	document.getElementById("electronicsLowStock").textContent = electronicsItems.filter(item => item.stock <= 5).length;
	renderTableView();
}

function showPage(pageName) {
	mainContent.classList.remove("page-transition");
	void mainContent.offsetWidth;
	mainContent.classList.add("page-transition");
	appShell.classList.toggle("electronics-mode", pageName === "electronics");
	appShell.classList.toggle("schedule-mode", pageName === "schedule");
	overviewSection.hidden = pageName !== "overview";
	pantrySection.classList.toggle("visible", pageName === "pantry");
	allMaterialsPage.classList.toggle("visible", pageName === "all");
	electronicsSection.classList.toggle("visible", pageName === "electronics");
	scheduleSection.classList.toggle("visible", pageName === "schedule");
	todoSection.classList.toggle("visible", pageName === "todo");
	notesSection.classList.toggle("visible", pageName === "notes");
	addItemButton.hidden = pageName !== "pantry";
	addElectronicsButton.hidden = pageName !== "electronics";
	pageDescription.textContent = pageName === "electronics"
		? "Manage your boards, modules, sensors, and accessories."
		: pageName === "pantry"
			? "Adjust your pantry stock count with the controls on each item."
			: pageName === "all"
				? "Review every pantry item in your inventory."
				: pageName === "schedule"
					? "Keep your weekly subjects, times, and class details in one place."
					: pageName === "todo"
						? "Organize the tasks you need to finish."
						: pageName === "notes"
							? "Keep your important thoughts and reminders nearby."
							: "See the current status of your pantry and electronics.";
	sidebarButtons.forEach(button => {
		button.classList.toggle("active", button.dataset.page === pageName);
	});
	applyNavigationColors();
	document.querySelector(".summary-grid").style.display = pageName === "overview" ? "grid" : "none";
	if (pageName === "schedule") renderSchedule();
	if (pageName === "todo") renderTodoList();
	if (pageName === "notes") renderNotes();
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

sidebarButtons.forEach(button => {
	button.addEventListener("click", () => {
		showPage(button.dataset.page);
	});
});

navigationManagerButton.addEventListener("click", openNavigationModal);
document.getElementById("closeNavigationModalButton").addEventListener("click", closeNavigationModal);
document.getElementById("closeNavigationDoneButton").addEventListener("click", closeNavigationModal);
navigationModal.addEventListener("click", event => {
	if (event.target === navigationModal) closeNavigationModal();
});
navigationOptions.addEventListener("change", event => {
	const colorInput = event.target.closest("[data-navigation-color]");
	if (colorInput) {
		navigationColors[colorInput.dataset.navigationColor] = colorInput.value;
		saveNavigationColors();
		applyNavigationColors();
		return;
	}
	const checkbox = event.target.closest("[data-navigation-page]");
	if (!checkbox) return;
	const pageId = checkbox.dataset.navigationPage;
	if (!checkbox.checked && visibleNavigationPages.length === 1) {
		checkbox.checked = true;
		return;
	}
	visibleNavigationPages = checkbox.checked
		? [...visibleNavigationPages, pageId]
		: visibleNavigationPages.filter(id => id !== pageId);
	saveVisibleNavigationPages();
	applyNavigationVisibility();
	const activePage = document.querySelector(".side-nav button.active")?.dataset.page;
	if (!visibleNavigationPages.includes(activePage)) {
		if (!visibleNavigationPages.includes("overview")) visibleNavigationPages.unshift("overview");
		saveVisibleNavigationPages();
		applyNavigationVisibility();
		showPage("overview");
	}
});

greetingName.addEventListener("keydown", event => {
	if (event.key === "Enter") {
		event.preventDefault();
		greetingName.blur();
	}
});

greetingName.addEventListener("blur", () => {
	const customName = greetingName.textContent.trim().replace(/\s+/g, " ");
	if (customName) {
		greetingName.textContent = customName;
		localStorage.setItem(GREETING_STORAGE_KEY, customName);
	} else {
		localStorage.removeItem(GREETING_STORAGE_KEY);
		greetingName.textContent = "Engr.";
	}
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

document.getElementById("addScheduleButton").addEventListener("click", () => openScheduleModal());
document.getElementById("closeScheduleModalButton").addEventListener("click", closeScheduleModal);
document.getElementById("cancelScheduleButton").addEventListener("click", closeScheduleModal);
scheduleModal.addEventListener("click", event => {
	if (event.target === scheduleModal) closeScheduleModal();
});

scheduleWeek.addEventListener("click", event => {
	const editButton = event.target.closest("[data-schedule-edit-id]");
	if (editButton) {
		const entry = scheduleEntries.find(item => item.id === Number(editButton.dataset.scheduleEditId));
		if (entry) openScheduleModal(entry);
		return;
	}
	const removeButton = event.target.closest("[data-schedule-remove-id]");
	if (removeButton) {
		scheduleEntries = scheduleEntries.filter(item => item.id !== Number(removeButton.dataset.scheduleRemoveId));
		saveSchedule();
		renderSchedule();
	}
});

scheduleForm.addEventListener("submit", event => {
	event.preventDefault();
	const formData = new FormData(scheduleForm);
	const subject = String(formData.get("subject") || "").trim();
	const dateValue = String(formData.get("date") || "");
	const startTime = String(formData.get("startTime") || "");
	const endTime = String(formData.get("endTime") || "");
	const details = String(formData.get("details") || "").trim();
	const selectedDate = new Date(`${dateValue}T00:00:00`);
	const dayIndex = (selectedDate.getDay() + 6) % 7;

	if (!subject || !dateValue || !startTime || !endTime || endTime <= startTime || Number.isNaN(selectedDate.getTime())) {
		alert("Please enter a valid time-in and time-out. Time out must be later than time in.");
		return;
	}

	if (editingScheduleId) {
		const entry = scheduleEntries.find(item => item.id === editingScheduleId);
		if (entry) Object.assign(entry, { subject, dayIndex, startTime, endTime, details });
	} else {
		scheduleEntries.push({ id: Date.now(), subject, dayIndex, startTime, endTime, details });
	}
	saveSchedule();
	closeScheduleModal();
	renderSchedule();
});

document.getElementById("todoForm").addEventListener("submit", event => {
	event.preventDefault();
	const input = document.getElementById("todoInput");
	const text = input.value.trim();
	if (!text) return;
	todoEntries.push({ id: Date.now(), text, done: false });
	saveStoredList(TODO_STORAGE_KEY, todoEntries);
	input.value = "";
	renderTodoList();
});

todoList.addEventListener("click", event => {
	const toggle = event.target.closest("[data-todo-toggle]");
	if (toggle) {
		const entry = todoEntries.find(item => item.id === Number(toggle.dataset.todoToggle));
		if (entry) entry.done = toggle.checked;
		saveStoredList(TODO_STORAGE_KEY, todoEntries);
		renderTodoList();
		return;
	}
	const remove = event.target.closest("[data-todo-remove]");
	if (remove) {
		todoEntries = todoEntries.filter(item => item.id !== Number(remove.dataset.todoRemove));
		saveStoredList(TODO_STORAGE_KEY, todoEntries);
		renderTodoList();
	}
});

document.getElementById("noteForm").addEventListener("submit", event => {
	event.preventDefault();
	const titleInput = document.getElementById("noteTitle");
	const textInput = document.getElementById("noteText");
	const title = titleInput.value.trim();
	const text = textInput.value.trim();
	if (!title || !text) return;
	noteEntries.unshift({ id: Date.now(), title, text });
	saveStoredList(NOTES_STORAGE_KEY, noteEntries);
	titleInput.value = "";
	textInput.value = "";
	renderNotes();
});

notesList.addEventListener("click", event => {
	const remove = event.target.closest("[data-note-remove]");
	if (!remove) return;
	noteEntries = noteEntries.filter(item => item.id !== Number(remove.dataset.noteRemove));
	saveStoredList(NOTES_STORAGE_KEY, noteEntries);
	renderNotes();
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

materialCategory.addEventListener("input", renderCategorySuggestions);
materialCategory.addEventListener("focus", renderCategorySuggestions);
categorySuggestions.addEventListener("click", event => {
	const option = event.target.closest("[data-category-value]");
	if (!option) return;
	materialCategory.value = option.dataset.categoryValue;
	categorySuggestions.classList.remove("open");
});
document.addEventListener("click", event => {
	if (!event.target.closest(".category-picker")) categorySuggestions.classList.remove("open");
});

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
applyNavigationVisibility();
applyNavigationColors();
populateCategoryOptions();
updateHeaderClock();
setInterval(updateHeaderClock, 1000);
setInterval(renderSchedule, 60 * 1000);
renderElectronics();
render();

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("service-worker.js").catch(error => {
		console.warn("Service worker registration failed.", error);
	});
}

window.addEventListener("pagehide", saveAllData);
document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "hidden") saveAllData();
});
