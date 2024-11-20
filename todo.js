const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category-select");
const dueDateInput = document.getElementById("due-date");
const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");
const progressBar = document.getElementById("progress-bar");
const badges = document.getElementById("badges");
const toggleTheme = document.getElementById("toggle-theme");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedCount = 0;
let isDarkMode = false; // Tracks current theme state

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  pendingTasks.innerHTML = "";
  completedTasks.innerHTML = "";
  completedCount = 0;

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text} (${task.category})</span>
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
        <button data-index="${index}">Delete</button>
      </div>
    `;

    li.querySelector("input").addEventListener("change", (e) => {
      task.completed = e.target.checked;
      renderTasks();
      saveTasks();
    });

    li.querySelector("button").addEventListener("click", () => {
      tasks.splice(index, 1);
      renderTasks();
      saveTasks();
    });

    if (task.completed) {
      completedTasks.appendChild(li);
      completedCount++;
    } else {
      pendingTasks.appendChild(li);
    }
  });

  updateProgress();
}

function updateProgress() {
  const totalTasks = tasks.length;
  const progress = totalTasks ? (completedCount / totalTasks) * 100 : 0;
  progressBar.style.width = `${progress}%`;

  if (progress === 100 && !document.querySelector(".badge")) {
    const badge = document.createElement("li");
    badge.className = "badge";
    badge.innerText = "🎉 All Tasks Completed!";
    badges.appendChild(badge);
  }
}

// Theme toggle functionality
function toggleThemeHandler() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-mode"); // Toggle dark mode class

  // Update button text
  toggleTheme.innerText = isDark ? "Switch to Light Theme" : "Switch to Dark Theme";

  // Apply theme-specific styles
  const textColor = isDark ? "#ffffff" : "#333333";
  const backgroundColor = isDark ? "#333333" : "#f0f4f8";

  body.style.backgroundColor = backgroundColor;
  body.style.color = textColor;

  const taskItems = document.querySelectorAll("li");
  taskItems.forEach((item) => {
    item.style.color = textColor;
  });

  // Save theme state
  isDarkMode = isDark;
  localStorage.setItem("isDarkMode", isDarkMode);
}

function restoreTheme() {
  const savedTheme = JSON.parse(localStorage.getItem("isDarkMode"));
  if (savedTheme) {
    isDarkMode = savedTheme;
    toggleThemeHandler(); // Apply dark mode on load if previously enabled
  }
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = {
    text: taskInput.value,
    category: categorySelect.value,
    dueDate: dueDateInput.value,
    completed: false,
  };

  tasks.push(task);
  renderTasks();
  saveTasks();
  taskForm.reset();
});

toggleTheme.addEventListener("click", toggleThemeHandler);

// Initialize app
restoreTheme();
renderTasks();
