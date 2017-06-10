/**
 * Created by iters on 6/10/17.
 */
var tasksLeft = 0;
var filterMode = 'all';

var addDefaultEvents = {
    handleEvent: function() {
        var addButton = document.getElementsByClassName('todo-add-task-button')[0];
        var addField = document.getElementsByClassName('todo-add_input')[0];
        var clearCompletedBtn = document.getElementsByClassName('todos-actions-bar_clear-completed')[0];

        var allBtn = document.querySelector("[data-filter='all']");
        var activeBtn = document.querySelector("[data-filter='active']");
        var completedBtn = document.querySelector("[data-filter='completed']");


        addButton.addEventListener('click', addNewTask);
        addField.addEventListener('keydown', addNewTask);
        clearCompletedBtn.addEventListener('click', clearCompleted);

        allBtn.addEventListener('click', allBtnEvent);
        activeBtn.addEventListener('click', activeBtnEvent);
        completedBtn.addEventListener('click', completedBtnEvent);

        initOldTasksWithEvents.init();
    }
};

var allBtnEvent = {
    handleEvent: function () {
        filterMode = 'all';
        clearStyleOnButtons();
        var allBtn = document.querySelector("[data-filter='all']");
        allBtn.classList.add('__active');

        var listOfTasks = document.getElementsByClassName('todo-item');
        var parent = document.getElementsByClassName('todos-list')[0];
        for (var i = listOfTasks.length - 1; i >= 0; i--) {
            var slide = listOfTasks.item(i);
            var myCheckbox = slide.querySelector('.input-checkbox_target');
            slide.style.display = '';
        }
    }
};

var activeBtnEvent = {
    handleEvent: function () {
        filterMode = 'active';
        clearStyleOnButtons();
        var activeBtn = document.querySelector("[data-filter='active']");
        activeBtn.classList.add('__active');

        var listOfTasks = document.getElementsByClassName('todo-item');
        var parent = document.getElementsByClassName('todos-list')[0];
        for (var i = listOfTasks.length - 1; i >= 0; i--) {
            var slide = listOfTasks.item(i);
            var myCheckbox = slide.querySelector('.input-checkbox_target');
            if (myCheckbox.checked) {
                slide.style.display = 'none';
            } else {
                slide.style.display = '';
            }
        }
    }
};

var completedBtnEvent = {
    handleEvent: function () {
        filterMode = 'completed';
        clearStyleOnButtons();
        var completedBtn = document.querySelector("[data-filter='completed']");
        completedBtn.classList.add('__active');

        var listOfTasks = document.getElementsByClassName('todo-item');
        var parent = document.getElementsByClassName('todos-list')[0];
        for (var i = listOfTasks.length - 1; i >= 0; i--) {
            var slide = listOfTasks.item(i);
            var myCheckbox = slide.querySelector('.input-checkbox_target');
            if (!myCheckbox.checked) {
                slide.style.display = 'none';
            } else {
                slide.style.display = '';
            }
        }
    }
};

function clearStyleOnButtons() {
    var allBtn = document.querySelector("[data-filter='all']");
    var activeBtn = document.querySelector("[data-filter='active']");
    var completedBtn = document.querySelector("[data-filter='completed']");

    allBtn.classList.remove('__active');
    activeBtn.classList.remove('__active');
    completedBtn.classList.remove('__active');
}

var clearCompleted = {
    handleEvent: function () {
        var listOfTasks = document.getElementsByClassName('todo-item');
        var parent = document.getElementsByClassName('todos-list')[0];
        for (var i = listOfTasks.length - 1; i >= 0; i--) {
            var slide = listOfTasks.item(i);
            var myCheckbox = slide.querySelector('.input-checkbox_target');
            if (myCheckbox.checked) {
                parent.removeChild(slide);
            }
        }
    }
};

var initOldTasksWithEvents = {
    init: function () {
        var listOfTasks = document.getElementsByClassName('todo-item');
        Array.prototype.forEach.call(listOfTasks, function(slide) {
            var myCheckbox = slide.querySelector('.input-checkbox_target');
            myCheckbox.addEventListener('click', function (e) {
                var textElement = this.parentNode.parentNode.querySelector('.todo-item_text');
                if (this.checked) {
                    textElement.classList.add('__ready');
                    tasksLeft--;

                    if(filterMode === 'active') {
                        slide.style.display = 'none';
                    }
                } else {
                    textElement.classList.remove('__ready');
                    tasksLeft++;

                    if(filterMode === 'completed') {
                        slide.style.display = 'none';
                    }
                }
                updateTasksLeftCounter();
            });

            if (!myCheckbox.checked) {
                tasksLeft++;
            }

            var deleteBtn = slide.querySelector('.todo-item_remove');
            deleteBtn.addEventListener('click', function () {
                var item = this.closest('.todo-item');
                var list = item.parentNode;

                var deletedCheckbox = item.querySelector('.input-checkbox_target');
                if (!deletedCheckbox.checked) {
                    tasksLeft--;
                    updateTasksLeftCounter();
                }

                list.removeChild(item);
            });
        });

        updateTasksLeftCounter();
    }
};

var addNewTask = {
    handleEvent: function(e) {
        var addField = document.getElementsByClassName('todo-add_input')[0];
        switch (e.type) {
            case 'click':
                this.addTask(addField);
                break;
            case 'keydown':
                if (e.keyCode === 13)
                    this.addTask(addField);
                break;
        }
    },

    addTask: function(field) {
        var text = field.value.trim();
        if (text.length === 0)
            return;

        var toDoList = document.getElementsByClassName('todos-list')[0];
        var newElement = this.getTemplate(text);
        toDoList.appendChild(newElement);
        field.value = '';
        tasksLeft++;
        updateTasksLeftCounter();

        if (filterMode === 'completed') {
            newElement.style.display = 'none';
        }
    },
    
    getTemplate: function (textValue) {
        var item = document.createElement('div');
        item.className = 'todo-item';

        var divCheckBox = document.createElement('div');
        divCheckBox.className = 'input-checkbox';
        divCheckBox.classList.add('todo-item_add-checkbox');

        var checkbox = document.createElement('input');
        checkbox.className = 'input-checkbox_target';
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('aria-label', 'Mark as completed');
        checkbox.addEventListener('click', function (e) {
            var textElement = this.parentNode.parentNode.querySelector('.todo-item_text');
            if (this.checked) {
                textElement.classList.add('__ready');
                tasksLeft--;

                if(filterMode === 'active') {
                    item.style.display = 'none';
                }
            } else {
                textElement.classList.remove('__ready');
                tasksLeft++;

                if(filterMode === 'completed') {
                    item.style.display = 'none';
                }
            }
            updateTasksLeftCounter();
        });

        var checkboxVisual = document.createElement('div');
        checkboxVisual.className = 'input-checkbox_visual';

        // combine checkbox
        divCheckBox.appendChild(checkbox);
        divCheckBox.appendChild(checkboxVisual);

        var divText = document.createElement('div');
        divText.className = 'todo-item_text';

        var text = document.createElement('div');
        text.className = 'todo-item_add-text';
        text.setAttribute('contenteditable', 'true');
        text.appendChild(document.createTextNode(textValue || ''));

        //combine text div
        divText.appendChild(text);

        var removeBtn = document.createElement('button');
        removeBtn.className = 'todo-item_remove';
        removeBtn.setAttribute('aria-label', 'remove toDo');
        removeBtn.addEventListener('click', function () {
            var item = this.closest('.todo-item');
            var list = item.parentNode;

            var deletedCheckbox = item.querySelector('.input-checkbox_target');
            if (!deletedCheckbox.checked) {
                tasksLeft--;
                updateTasksLeftCounter();
            }

            list.removeChild(item);
        });

        //combite result node
        item.appendChild(divCheckBox);
        item.appendChild(divText);
        item.appendChild(removeBtn);

        return item;
    }
};

function updateTasksLeftCounter() {
    var divCount = document.getElementsByClassName('todos-actions-bar_counter')[0];
    divCount.innerHTML = tasksLeft + ' tasks left';
}

document.addEventListener('DOMContentLoaded', addDefaultEvents);