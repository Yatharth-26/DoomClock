// =============================================
// DOOMCLOCK — script.js
// Milestone 2: fetch API + loading states
// Milestone 3: search, filter, sort (HOFs),
//              dark mode, button interactions,
//              local storage, debouncing
// =============================================


// ============ DARK / LIGHT MODE ============
// Milestone 3: Dark Mode / Light Mode toggle

function toggleTheme() {
  var btn = document.getElementById("theme-btn");

  if (document.body.classList.contains("light")) {
    document.body.classList.remove("light");
    btn.textContent = "☀️ Light";
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.add("light");
    btn.textContent = "🌙 Dark";
    localStorage.setItem("theme", "light");
  }
}

// Load saved theme on page open
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  document.getElementById("theme-btn").textContent = "🌙 Dark";
}


// ============ LIFE CLOCK ============

var clockInterval;

function startClock() {
  var birthdateValue = document.getElementById("birthdate").value;

  if (!birthdateValue) {
    alert("Please enter your birthdate!");
    return;
  }

  var birthDate = new Date(birthdateValue);

  document.getElementById("clock-hint").style.display = "none";
  clearInterval(clockInterval);

  clockInterval = setInterval(function () {
    var now          = new Date();
    var diff         = now - birthDate;
    var totalSeconds = Math.floor(diff / 1000);
    var totalMinutes = Math.floor(totalSeconds / 60);
    var totalHours   = Math.floor(totalMinutes / 60);
    var totalDays    = Math.floor(totalHours / 24);
    var years        = Math.floor(totalDays / 365);

    document.getElementById("years").textContent   = years;
    document.getElementById("days").textContent    = totalDays % 365;
    document.getElementById("hours").textContent   = totalHours % 24;
    document.getElementById("seconds").textContent = totalSeconds % 60;
  }, 1000);
}


// ============ API HELPER FUNCTIONS ============
// These show/hide the loading spinner and text for each card

function showLoader(loaderId, textId) {
  document.getElementById(loaderId).style.display = "flex";
  document.getElementById(textId).style.display   = "none";
}

function hideLoader(loaderId, textId) {
  document.getElementById(loaderId).style.display = "none";
  document.getElementById(textId).style.display   = "block";
}


// ============ FETCH QUOTE ============
// Milestone 2: API call using fetch + loading state
// API: https://dummyjson.com/quotes/random
// Returns: { quote: "...", author: "..." }

async function getQuote() {
  showLoader("quote-loader", "quote");

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data     = await response.json();
    hideLoader("quote-loader", "quote");
    document.getElementById("quote").innerText = '"' + data.quote + '" — ' + data.author;
  } catch (error) {
    hideLoader("quote-loader", "quote");
    document.getElementById("quote").innerText = "Failed to load quote.";
  }
}


// ============ FETCH ACTIVITY ============
// API: https://www.themealdb.com/api/json/v1/1/random.php
// Returns: { meals: [{ strMeal: "...", strCategory: "..." }] }

async function getActivity() {
  showLoader("activity-loader", "activity");

  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data     = await response.json();
    const meal     = data.meals[0].strMeal;
    const category = data.meals[0].strCategory;
    hideLoader("activity-loader", "activity");
    document.getElementById("activity").innerText = "Try cooking: " + meal + " (" + category + ")";
  } catch (error) {
    hideLoader("activity-loader", "activity");
    document.getElementById("activity").innerText = "Failed to load activity.";
  }
}


// ============ FETCH ADVICE ============
// API: https://api.adviceslip.com/advice
// Returns: { slip: { advice: "..." } }
// Date.now() prevents browser from caching the same result

async function getAdvice() {
  showLoader("advice-loader", "advice");

  try {
    const response = await fetch("https://api.adviceslip.com/advice?t=" + Date.now());
    const data     = await response.json();
    hideLoader("advice-loader", "advice");
    document.getElementById("advice").innerText = data.slip.advice;
  } catch (error) {
    hideLoader("advice-loader", "advice");
    document.getElementById("advice").innerText = "Failed to load advice.";
  }
}

// Wire up the API buttons
document.getElementById("quoteBtn").addEventListener("click", getQuote);
document.getElementById("activityBtn").addEventListener("click", getActivity);
document.getElementById("adviceBtn").addEventListener("click", getAdvice);


// =============================================
// TASK MANAGER
// Milestone 3: search, filter, sort using HOFs
// =============================================

var tasks         = [];
var graveyard     = [];
var currentFilter = "All";
var streak        = 0;
var favorites     = [];   // stores IDs of favorited tasks


// ---- ADD TASK ----
function addTask() {
  var name     = document.getElementById("task-input").value.trim();
  var deadline = document.getElementById("task-deadline").value;
  var priority = document.getElementById("task-priority").value;

  if (name === "")    { alert("Please enter a task name!"); return; }
  if (deadline === "") { alert("Please select a deadline!"); return; }

  var newTask = {
    id:        Date.now(),
    name:      name,
    deadline:  deadline,
    priority:  priority,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();

  document.getElementById("task-input").value    = "";
  document.getElementById("task-deadline").value = "";

  renderTasks();
}


// ---- HELPER: Is a task overdue? ----
function isOverdue(task) {
  if (task.completed) return false;
  var today    = new Date();
  today.setHours(0, 0, 0, 0);
  var deadline = new Date(task.deadline);
  return deadline < today;
}


// ---- HELPER: Get task status ----
function getStatus(task) {
  if (task.completed) return "Completed";
  if (isOverdue(task)) return "Overdue";
  return "Pending";
}


// ---- COMPLETE A TASK ----
// Milestone 3: Button Interaction
// Uses HOF: map()

function completeTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) { task.completed = true; }
    return task;
  });

  streak++;
  document.getElementById("streak-count").textContent = streak;

  saveTasks();
  renderTasks();
  getQuote(); // show a new motivational quote on completion
}


// ---- TOGGLE FAVORITE ----
// Milestone 3: Button Interaction (like/favorite)

function toggleFavorite(id) {
  var isFaved = favorites.includes(id);

  if (isFaved) {
    // HOF: filter() — remove from favorites
    favorites = favorites.filter(function (favId) { return favId !== id; });
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderTasks();
}


// ---- DELETE A TASK ----
// Uses HOF: filter()

function deleteTask(id) {
  var task = tasks.find(function (t) { return t.id === id; });

  if (task && isOverdue(task) && !task.completed) {
    graveyard.push(task);
    localStorage.setItem("graveyard", JSON.stringify(graveyard));
    renderGraveyard();
  }

  tasks = tasks.filter(function (task) { return task.id !== id; });
  saveTasks();
  renderTasks();
}


// ---- SET ACTIVE FILTER ----
// Milestone 3: Filtering

function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.classList.remove("active");
  });

  document.getElementById("btn-" + filter).classList.add("active");
  renderTasks();
}


// ---- DEBOUNCED SEARCH ----
// Bonus: Debouncing — waits 300ms after user stops typing before searching
// This prevents calling renderTasks on every single keystroke

var searchTimeout;

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(function () {
    renderTasks();
  }, 300);
}


// ---- RENDER TASKS ----
// Main display function
// Milestone 3: Uses HOFs — filter(), sort(), map()

function renderTasks() {
  var searchValue = document.getElementById("search-input").value.toLowerCase();
  var sortBy      = document.getElementById("sort-select").value;
  var taskList    = document.getElementById("task-list");

  // HOF 1: filter() — Search by keyword
  var result = tasks.filter(function (task) {
    return task.name.toLowerCase().includes(searchValue);
  });

  // HOF 2: filter() — Filter by status
  result = result.filter(function (task) {
    if (currentFilter === "All")       return true;
    if (currentFilter === "Completed") return task.completed === true;
    if (currentFilter === "Overdue")   return isOverdue(task);
    if (currentFilter === "Pending")   return !task.completed && !isOverdue(task);
    return true;
  });

  // HOF 3: sort() — Sort by chosen option
  result = result.sort(function (a, b) {
    if (sortBy === "deadline") {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === "priority") {
      var order = { High: 1, Medium: 2, Low: 3 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  if (result.length === 0) {
    taskList.innerHTML = '<p class="empty-msg">No tasks found.</p>';
    return;
  }

  // HOF 4: map() — Build a card for each task
  taskList.innerHTML = result.map(function (task) {
    var status   = getStatus(task);
    var isFaved  = favorites.includes(task.id);
    var favClass = isFaved ? "btn-fav faved" : "btn-fav";
    var favLabel = isFaved ? "⭐" : "☆";

    return (
      '<div class="task-card ' + status.toLowerCase() + '">' +
        '<div class="task-info">' +
          '<p class="task-name">' + task.name + '</p>' +
          '<div class="task-meta">' +
            '<span>📅 ' + task.deadline + '</span>' +
            '<span class="badge badge-' + task.priority + '">' + task.priority + '</span>' +
            '<span class="badge badge-' + status + '">' + status + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="task-actions">' +
          '<button class="' + favClass + '" onclick="toggleFavorite(' + task.id + ')" title="Favourite">' + favLabel + '</button>' +
          (!task.completed
            ? '<button class="btn-done"   onclick="completeTask(' + task.id + ')">✅ Done</button>'
            : '') +
          '<button class="btn-delete" onclick="deleteTask(' + task.id + ')">🗑️ Delete</button>' +
        '</div>' +
      '</div>'
    );
  }).join("");
}


// ---- GRAVEYARD ----
function renderGraveyard() {
  var el = document.getElementById("graveyard-grid");

  if (graveyard.length === 0) {
    el.innerHTML = '<p class="empty-msg">No casualties yet. Keep it that way 🫡</p>';
    return;
  }

  // HOF: map() — build a tombstone for each dead task
  el.innerHTML = graveyard.map(function (task) {
    return (
      '<div class="tombstone">' +
        '<p class="tombstone-rip">R.I.P</p>' +
        '<p class="tombstone-name">' + task.name + '</p>' +
        '<p class="tombstone-date">' + task.deadline + '</p>' +
      '</div>'
    );
  }).join("");
}


// ---- LOCAL STORAGE ----
// Bonus: Local Storage — saves tasks and graveyard across sessions

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadData() {
  var savedTasks     = localStorage.getItem("tasks");
  var savedGraveyard = localStorage.getItem("graveyard");
  var savedFavorites = localStorage.getItem("favorites");

  if (savedTasks)     tasks     = JSON.parse(savedTasks);
  if (savedGraveyard) graveyard = JSON.parse(savedGraveyard);
  if (savedFavorites) favorites = JSON.parse(savedFavorites);
}


// ============ INIT — runs on page load ============
loadData();
renderTasks();
renderGraveyard();
getQuote();
getActivity();
getAdvice();