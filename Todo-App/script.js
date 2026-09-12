const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";

/* =========================
   SAVE TO LOCAL STORAGE
========================= */

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

/* =========================
   RENDER TODOS
========================= */

function renderTodos() {

    todoList.innerHTML = "";

    let filteredTodos = todos;

    if (currentFilter === "active") {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (currentFilter === "completed") {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {

        const li = document.createElement("li");

        li.className = `todo-item ${todo.completed ? "completed" : ""}`;

        li.innerHTML = `
            <span>${todo.text}</span>

            <div class="actions">

                <button class="complete-btn" data-id="${todo.id}">
                    ${todo.completed ? "Undo" : "Complete"}
                </button>

                <button class="edit-btn" data-id="${todo.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${todo.id}">
                    Delete
                </button>

            </div>
        `;

        todoList.appendChild(li);
    });
}

/* =========================
   ADD TODO
========================= */

function addTodo() {

    const text = todoInput.value.trim();

    if (text === "") return;

    const todo = {
        id: Date.now(),
        text,
        completed: false
    };

    todos.push(todo);

    saveTodos();

    renderTodos();

    todoInput.value = "";
}

/* =========================
   EVENT LISTENERS
========================= */

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        addTodo();
    }
});

/* =========================
   EVENT DELEGATION
========================= */

todoList.addEventListener("click", (e) => {

    const id = Number(e.target.dataset.id);

    /* COMPLETE */

    if (e.target.classList.contains("complete-btn")) {

        todos = todos.map(todo => {

            if (todo.id === id) {
                todo.completed = !todo.completed;
            }

            return todo;
        });

        saveTodos();
        renderTodos();
    }

    /* DELETE */

    if (e.target.classList.contains("delete-btn")) {

        todos = todos.filter(todo => todo.id !== id);

        saveTodos();
        renderTodos();
    }

    /* EDIT */

    if (e.target.classList.contains("edit-btn")) {

        const newText = prompt("Edit task:");

        if (newText !== null && newText.trim() !== "") {

            todos = todos.map(todo => {

                if (todo.id === id) {
                    todo.text = newText.trim();
                }

                return todo;
            });

            saveTodos();
            renderTodos();
        }
    }
});

/* =========================
   FILTERS
========================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelector(".filter-btn.active")
            .classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTodos();
    });
});

/* =========================
   INITIAL RENDER
========================= */

renderTodos();