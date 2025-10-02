const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const deleteAllBtn = document.getElementById("delete-all-btn");
const filter = document.getElementById("filter");

// Load todos saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadTodos);

// Event Listener
form.addEventListener("submit", addTodo);
todoList.addEventListener("click", actionTodo);
deleteAllBtn.addEventListener("click", deleteAllTodos);
filter.addEventListener("change", filterTodos);

// Ambil data dari LocalStorage
function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

// Simpan ke LocalStorage
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Load data dari LocalStorage ke UI
function loadTodos() {
  const todos = getTodos();
  if (todos.length === 0) {
    deleteAllTodos();
    return;
  }

  todoList.innerHTML = "";
  todos.forEach((todo) => renderTodo(todo));
}

// Render satu todo ke tabel
function renderTodo(todo) {
  const row = document.createElement("tr");
  row.setAttribute("data-status", todo.status);

  const statusColor = todo.status === "done" ? "#4caf50" : "#c9d1d9";
  row.innerHTML = `
    <td>${todo.task}</td>
    <td>${todo.date}</td>
    <td><span class="status" style="color:${statusColor}">${capitalize(
    todo.status
  )}</span></td>
    <td>
      <button class="done-btn">Done</button>
      <button class="delete-btn">Delete</button>
    </td>
  `;
  todoList.appendChild(row);
}

// Tambah To-Do
function addTodo(e) {
  e.preventDefault();

  if (todoInput.value.trim() === "" || dateInput.value === "") {
    alert("Task dan tanggal tidak boleh kosong!");
    return;
  }

  const newTodo = {
    task: todoInput.value,
    date: dateInput.value,
    status: "pending",
  };

  const todos = getTodos();
  todos.push(newTodo);
  saveTodos(todos);

  renderTodo(newTodo);

  todoInput.value = "";
  dateInput.value = "";
}

// Action: Done / Delete
function actionTodo(e) {
  const row = e.target.closest("tr");
  const taskName = row.children[0].textContent;
  let todos = getTodos();

  if (e.target.classList.contains("delete-btn")) {
    row.remove();
    todos = todos.filter((todo) => todo.task !== taskName);
    saveTodos(todos);
    checkEmpty();
  }

  if (e.target.classList.contains("done-btn")) {
    const statusCell = row.querySelector(".status");
    statusCell.textContent = "Done";
    statusCell.style.color = "#4caf50";
    row.setAttribute("data-status", "done");

    // update LocalStorage
    todos = todos.map((todo) => {
      if (todo.task === taskName) todo.status = "done";
      return todo;
    });
    saveTodos(todos);
  }
}

// Delete All
function deleteAllTodos() {
  todoList.innerHTML = `
    <tr>
      <td colspan="4" class="empty-msg">No task found</td>
    </tr>
  `;
  saveTodos([]); // kosongkan localStorage
}

// Cek jika kosong
function checkEmpty() {
  if (todoList.querySelectorAll("tr").length === 0) {
    deleteAllTodos();
  }
}

// Filter Todos
function filterTodos() {
  const value = filter.value;
  const rows = todoList.querySelectorAll("tr");

  rows.forEach((row) => {
    if (row.classList.contains("empty-msg")) return;

    const status = row.getAttribute("data-status");
    if (value === "all") {
      row.style.display = "";
    } else if (status === value) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Helper: kapital huruf pertama
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
