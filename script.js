const quoteBtn    = document.getElementById("quoteBtn");
const activityBtn = document.getElementById("activityBtn");
const adviceBtn   = document.getElementById("adviceBtn");

const quoteEl    = document.getElementById("quote");
const activityEl = document.getElementById("activity");
const adviceEl   = document.getElementById("advice");

quoteBtn.addEventListener("click", getQuote);
activityBtn.addEventListener("click", getActivity);
adviceBtn.addEventListener("click", getAdvice);

async function getQuote() {
    quoteEl.innerText = "Loading...";
    try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        quoteEl.innerText = '"' + data.quote + '" — ' + data.author;
    } catch (error) {
        quoteEl.innerText = "Failed to load quote.";
    }
}

async function getActivity() {
    activityEl.innerText = "Loading...";
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await response.json();
        const meal     = data.meals[0].strMeal;
        const category = data.meals[0].strCategory;
        activityEl.innerText = "Try cooking: " + meal + " (" + category + ")";
    } catch (error) {
        activityEl.innerText = "Failed to load activity.";
    }
}

async function getAdvice() {
    adviceEl.innerText = "Loading...";
    try {
        const response = await fetch("https://api.adviceslip.com/advice?t=" + Date.now());
        const data = await response.json();
        adviceEl.innerText = data.slip.advice;
    } catch (error) {
        adviceEl.innerText = "Failed to load advice.";
    }
}


// ===== LIFE CLOCK =====
var clockInterval;

function startClock() {
    var birthdateValue = document.getElementById("birthdate").value;
    if (!birthdateValue) {
        alert("Please enter your birthdate!");
        return;
    }

    var birthDate = new Date(birthdateValue);
    document.querySelector(".clock-hint").style.display = "none";
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


// ===== DARK / LIGHT MODE =====
function toggleTheme() {
    var btn = document.querySelector(".theme-btn");
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        btn.textContent = "☀️ Light";
        localStorage.setItem("theme", "dark");
    } else {
        btn.textContent = "🌙 Dark";
        localStorage.setItem("theme", "light");
    }
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    document.querySelector(".theme-btn").textContent = "☀️ Light";
}


// ===== TASK MANAGER =====
var tasks         = [];
var graveyard     = [];
var currentFilter = "All";
var streak        = 0;

function addTask() {
    var name     = document.getElementById("task-input").value.trim();
    var deadline = document.getElementById("task-deadline").value;
    var priority = document.getElementById("task-priority").value;

    if (name === "") { alert("Please enter a task name!"); return; }
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

function isOverdue(task) {
    if (task.completed) return false;
    var today    = new Date();
    today.setHours(0, 0, 0, 0);
    var deadline = new Date(task.deadline);
    return deadline < today;
}

function getStatus(task) {
    if (task.completed) return "Completed";
    if (isOverdue(task)) return "Overdue";
    return "Pending";
}

function completeTask(id) {
    tasks = tasks.map(function (task) {
        if (task.id === id) { task.completed = true; }
        return task;
    });
    streak++;
    document.getElementById("streak-count").textContent = streak;
    saveTasks();
    renderTasks();
    getQuote();
}

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

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
        btn.classList.remove("active");
    });
    document.getElementById("btn-" + filter).classList.add("active");
    renderTasks();
}

function renderTasks() {
    var searchValue = document.getElementById("search-input").value.toLowerCase();
    var sortBy      = document.getElementById("sort-select").value;
    var taskList    = document.getElementById("task-list");

    var result = tasks.filter(function (task) {
        return task.name.toLowerCase().includes(searchValue);
    });

    result = result.filter(function (task) {
        if (currentFilter === "All")       return true;
        if (currentFilter === "Completed") return task.completed === true;
        if (currentFilter === "Overdue")   return isOverdue(task);
        if (currentFilter === "Pending")   return !task.completed && !isOverdue(task);
        return true;
    });

    result = result.sort(function (a, b) {
        if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
        if (sortBy === "priority") {
            var order = { High: 1, Medium: 2, Low: 3 };
            return order[a.priority] - order[b.priority];
        }
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    if (result.length === 0) {
        taskList.innerHTML = '<p class="empty-msg">No tasks found.</p>';
        return;
    }

    taskList.innerHTML = result.map(function (task) {
        var status   = getStatus(task);
        var priority = task.priority;
        return (
            '<div class="task-card ' + status.toLowerCase() + '">' +
              '<div class="task-info">' +
                '<p class="task-name">' + task.name + '</p>' +
                '<div class="task-meta">' +
                  '<span>📅 ' + task.deadline + '</span>' +
                  '<span class="badge badge-' + priority + '">' + priority + '</span>' +
                  '<span class="badge badge-' + status + '">' + status + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="task-actions">' +
                (!task.completed ? '<button class="btn-done" onclick="completeTask(' + task.id + ')">✅ Done</button>' : '') +
                '<button class="btn-delete" onclick="deleteTask(' + task.id + ')">🗑️ Delete</button>' +
              '</div>' +
            '</div>'
        );
    }).join("");
}

function renderGraveyard() {
    var el = document.getElementById("graveyard-grid");
    if (graveyard.length === 0) {
        el.innerHTML = '<p class="empty-msg">No casualties yet. Keep it that way 🫡</p>';
        return;
    }
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

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadData() {
    var savedTasks     = localStorage.getItem("tasks");
    var savedGraveyard = localStorage.getItem("graveyard");
    if (savedTasks)     tasks     = JSON.parse(savedTasks);
    if (savedGraveyard) graveyard = JSON.parse(savedGraveyard);
}


// ===== INIT =====
loadData();
renderTasks();
renderGraveyard();
getQuote();
getActivity();
getAdvice();