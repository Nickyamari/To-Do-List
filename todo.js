document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("todo-form");
    const input = document.getElementById("todo-input");
    const dueDateInput = document.getElementById("due-date");
    const categorySelect = document.getElementById("category-select");
    const searchBar = document.getElementById("search-bar");
    const filterSelect = document.getElementById("filter-select");
    const pendingTasks = document.getElementById("pending-tasks");
    const completedTasks = document.getElementById("completed-tasks");
    const exportButton = document.getElementById("export-tasks");
    const importInput = document.getElementById("import-tasks");
    const progressText = document.getElementById("progress-text");
    const progressFill = document.getElementById("progress-fill");
  
    // Task storage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    // Save to local storage
    const saveTasks = () => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateProgress();
    };
  
    // Add a task
    const addTask = (task) => {
      tasks.push(task);
      renderTasks();
      saveTasks();
    };
  
    // Render tasks
    const renderTasks = () => {
      pendingTasks.innerHTML = "";
      completedTasks.innerHTML = "";
  
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${task.text} (${task.category}) - ${task.dueDate}</span>
          <div>
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <button class="delete">X</button>
          </div>
        `;
  
        // Checkbox logic
        li.querySelector("input[type='checkbox']").addEventListener("change", () => {
          task.completed = !task.completed;
          saveTasks();
        });
  
        // Delete logic
        li.querySelector(".delete").addEventListener("click", () => {
          tasks.splice(index, 1);
          saveTasks();
        });
  
        if (task.completed) {
          completedTasks.appendChild(li);
        } else {
          pendingTasks.appendChild(li);
        }
      });
    };
  
    // Event listeners
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskText = input.value.trim();
      const dueDate = dueDateInput.value;
      const category = categorySelect.value;
  
      if (taskText) {
        addTask({ text: taskText, dueDate, category, completed: false });
        input.value = "";
        dueDateInput.value = "";
      }
    });
  
    // Export tasks
    exportButton.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(tasks)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasks.json";
      a.click();
    });
  
    // Import tasks
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const importedTasks = JSON.parse(reader.result);
        tasks.push(...importedTasks);
        saveTasks();
      };
      reader.readAsText(file);
    });
  
    // Update progress
    const updateProgress = () => {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task) => task.completed).length;
      const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
      progressText.textContent = `${progress}%`;
      progressFill.style.width = `${progress}%`;
    };
  
    renderTasks();
  });
  