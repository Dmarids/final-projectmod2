const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const countTasks = document.getElementById('count-tasks');
const countCompleted = document.getElementById('count-completed');
const clearCompletedButton = document.getElementById('clear-completed');

todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const newTask = todoInput.value.trim();

  if (newTask === '') {
    alert('Please enter a task!');
    return;
  }

  todoInput.value = '';
  addTask(newTask);
});

function addTask(task) {
  const listItem = document.createElement('li');
  const taskText = document.createElement('span');
  taskText.textContent = task;
  listItem.appendChild(taskText);

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  listItem.appendChild(checkBox);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  listItem.appendChild(deleteButton);

  todoList.appendChild(listItem);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  listItem.appendChild(editButton);

  checkBox.addEventListener('change', function() {
    if (this.checked) {
      listItem.classList.add('completed');
    } else {
      listItem.classList.remove('completed');
    }
    updateTaskCount();
    saveTasksToLocalStorage();
  });

  deleteButton.addEventListener('click', function() {
    const deletedTask = listItem.cloneNode(true);
    deletedTask.classList.add('deleted-task');
    todoList.removeChild(listItem);
    updateTaskCount();
    saveTasksToLocalStorage();

    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo';
    undoButton.classList.add('undo-button');
    todoList.after(undoButton);

    undoButton.addEventListener('click', function() {
      todoList.appendChild(deletedTask);
      this.remove();
      updateTaskCount();
      saveTasksToLocalStorage();
    });

    setTimeout(() => {
      undoButton.remove();
    }, 5000);
  });

  editButton.addEventListener('click', function() {
    const isEditing = listItem.classList.contains('editing');

    if (isEditing) {
      taskText.textContent = this.previousSibling.value;
      listItem.classList.remove('editing');
      editButton.textContent = 'Edit';
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = taskText.textContent;
      listItem.insertBefore(input, taskText);
      listItem.removeChild(taskText);
      listItem.classList.add('editing');
      editButton.textContent = 'Save';
    }
    saveTasksToLocalStorage();
  });

  updateTaskCount();
  saveTasksToLocalStorage();
}

function updateTaskCount() {
  const totalTasks = document.querySelectorAll('#todo-list li').length;
  const completedTasks = document.querySelectorAll('#todo-list li.completed').length;
  countTasks.textContent = `Total Tasks: ${totalTasks}`;
  countCompleted.textContent = `Completed: ${completedTasks}`;
}

clearCompletedButton.addEventListener('click', function() {
  document.querySelectorAll('#todo-list li.completed').forEach(task => {
    task.remove();
  });
  updateTaskCount();
  saveTasksToLocalStorage();
});

document.addEventListener('DOMContentLoaded', function() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => {
    addTask(task.text);
  });
});

// Drag and drop functionality
let draggedItem = null;

todoList.addEventListener('dragstart', function(event) {
  draggedItem = event.target.closest('li');
});

todoList.addEventListener('dragover', function(event) {
  event.preventDefault();
  const overItem = event.target.closest('li');
  this.insertBefore(draggedItem, overItem);
});

todoList.addEventListener('dragend', function() {
  draggedItem = null;
});

function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll('#todo-list li').forEach(task => {
    const taskText = task.querySelector('span').textContent;
    const isCompleted = task.classList.contains('completed');
    tasks.push({ text: taskText, completed: isCompleted });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
