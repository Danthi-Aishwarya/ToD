const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = "";

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter !== todo.status) {
    return "";
  }
  let checked = todo.status === "completed" ? "checked" : "";
  return `
    <li class="todo">
      <label for="${todo.id}">
        <input id="${todo.id}" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}">
        <i class="fa fa-times"></i>
      </button>
    </li>
  `;
}

function showTodos() {
  const visibleTodos = todosJson.filter(
    (todo) => !filter || todo.status === filter
  );
  if (visibleTodos.length === 0) {
    todosHtml.innerHTML = "";
    emptyImage.style.display = "block";
  } else {
    todosHtml.innerHTML = visibleTodos.map(getTodoHtml).join("");
    emptyImage.style.display = "none";
  }

  document
    .querySelectorAll(".delete-btn")
    .forEach((btn) => btn.addEventListener("click", () => remove(btn)));
  document
    .querySelectorAll(".todo input[type='checkbox']")
    .forEach((checkbox) =>
      checkbox.addEventListener("click", () => updateStatus(checkbox))
    );
}

function addTodo() {
  let todo = input.value.trim();
  if (!todo) return;

  todosJson.unshift({ id: Date.now(), name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  input.value = "";
  showTodos();
}

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addTodo();
});

addButton.addEventListener("click", addTodo);

function updateStatus(todoCheckbox) {
  const todoId = todoCheckbox.id;
  const todoIndex = todosJson.findIndex((t) => t.id == todoId);
  if (todoIndex > -1) {
    todosJson[todoIndex].status = todoCheckbox.checked
      ? "completed"
      : "pending";
    localStorage.setItem("todos", JSON.stringify(todosJson));
  }
  showTodos();
}

function remove(todoButton) {
  const index = todoButton.dataset.index;
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

filters.forEach((filterElement) => {
  filterElement.addEventListener("click", () => {
    filter = filterElement.dataset.filter;
    filters.forEach((filter) => filter.classList.remove("active"));
    filterElement.classList.add("active");
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
