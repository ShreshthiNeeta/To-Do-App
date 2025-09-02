document.addEventListener("DOMContentLoaded", () => {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  const todoForm = document.getElementById("todoForm");
  const todoInput = document.getElementById("todoInput");
  const todoDate = document.getElementById("todoDate");
  const todoList = document.getElementById("todoList");
  const todoCount = document.getElementById("todoCount");
  const deleteButton = document.getElementById("deleteButton");
  const themeToggle = document.getElementById("themeToggle");
  const errorMsg = document.getElementById("errorMsg");

  // -------------------------------
  // Utility functions
  // -------------------------------
  const todayISO = () => new Date().toISOString().split("T")[0];

  const saveToLocalStorage = () =>
    localStorage.setItem("todos", JSON.stringify(todos));

  const updateCount = () => (todoCount.textContent = todos.length);

  // -------------------------------
  // Theme Handling
  // -------------------------------
  const initTheme = () => {
    const theme = localStorage.getItem("theme") || "light";
    if (theme === "dark") document.body.classList.add("dark");
    document.body.setAttribute("data-theme", theme);
    themeToggle.textContent =
      theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    themeToggle.setAttribute("aria-pressed", theme === "dark");
  };

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark");
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    themeToggle.setAttribute("aria-pressed", isDark);
  };

  // -------------------------------
  // Task Rendering
  // -------------------------------
  const renderTask = (task, index) => {
    const li = document.createElement("li");
    li.classList.add("fade-in");
    if (new Date(task.date) < new Date() && !task.disabled)
      li.classList.add("overdue");

    li.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      task.disabled ? "checked" : ""
    } aria-checked="${task.disabled}">
        <span id="todo-${index}" class="${task.disabled ? "disabled" : ""}">${
      task.text
    }</span>
        <span class="task-date">${task.date}</span>
      </div>
      <button class="delete-task" aria-label="Delete task">❌</button>
    `;

    li.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );
    li.querySelector(`#todo-${index}`).addEventListener("click", () =>
      editTask(index)
    );
    li.querySelector(".delete-task").addEventListener("click", () =>
      deleteTask(index, li)
    );

    todoList.appendChild(li);
  };

  const displayTasks = () => {
    todoList.innerHTML = "";
    todos.forEach((task, index) => renderTask(task, index));
    updateCount();
  };

  // -------------------------------
  // Task Operations
  // -------------------------------
  const addTask = (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const text = todoInput.value.trim();
    const date = todoDate.value;

    if (!text || !date) {
      errorMsg.textContent = "Please enter a task and select a date.";
      return;
    }

    if (
      todos.some(
        (t) =>
          t.text.trim().toLowerCase() === text.toLowerCase() && t.date === date
      )
    ) {
      errorMsg.textContent = "Task already exists on this date!";
      return;
    }

    const newTask = { text, date, disabled: false };
    todos.push(newTask);
    saveToLocalStorage();
    renderTask(newTask, todos.length - 1);

    todoInput.value = "";
    todoDate.value = "";
    updateCount();
  };

  const toggleTask = (index) => {
    todos[index].disabled = !todos[index].disabled;
    saveToLocalStorage();
    displayTasks();
  };

  const editTask = (index) => {
    const todoItem = document.getElementById(`todo-${index}`);
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.value = todos[index].text;
    inputEl.className = "input-field";

    todoItem.replaceWith(inputEl);
    inputEl.focus();

    inputEl.addEventListener("blur", () =>
      saveEditedTask(index, inputEl.value)
    );
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") inputEl.blur();
      if (e.key === "Escape") displayTasks();
    });
  };

  const saveEditedTask = (index, newText) => {
    const trimmed = newText.trim();
    if (trimmed && trimmed !== todos[index].text) {
      todos[index].text = trimmed;
      saveToLocalStorage();
    }
    displayTasks();
  };

  const deleteTask = (index, li) => {
    li.classList.add("fade-out");
    li.addEventListener("animationend", () => {
      todos.splice(index, 1);
      saveToLocalStorage();
      displayTasks();
    });
  };

  const deleteAllTasks = () => {
    if (!todos.length) return;
    if (!confirm("⚠️ Are you sure you want to delete all tasks?")) return;
    todos = [];
    saveToLocalStorage();
    displayTasks();
  };

  // -------------------------------
  // Init App
  // -------------------------------
  initTheme();
  displayTasks();

  // -------------------------------
  // Event Listeners
  // -------------------------------
  todoForm.addEventListener("submit", addTask);
  deleteButton.addEventListener("click", deleteAllTasks);
  themeToggle.addEventListener("click", toggleTheme);

  // How It Works toggle with smooth animation
  const howToggle = document.getElementById("howToggle");
  const howContent = document.querySelector(".how-content");

  howToggle.addEventListener("click", () => {
    const expanded = howToggle.getAttribute("aria-expanded") === "true";
    howToggle.setAttribute("aria-expanded", !expanded);
    howContent.classList.toggle("open");
    e;
  });
});