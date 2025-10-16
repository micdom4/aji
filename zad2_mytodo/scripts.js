"use strict"
let todoList = []; //declares a new array for Your todo list

let initList = function () {
    let savedList = window.localStorage.getItem('todoList');
    if (savedList) {
        todoList = JSON.parse(savedList);
        return;
    } else {
        todoList.push(
            {
                title: "Initial docs",
                description: "Make initial documentation for the first exercise from the subject ISRP",
                place: "home",
                category: '',
                dueDate: new Date(2025, 10, 20)
            },
            {
                title: "Mock project",
                description: "Prepare a mock project for the subject MOBI",
                place: "CTI",
                category: '',
                dueDate: new Date(2025, 10, 30)
            }
        );
    }
}

initList();

let updateTodoList = function () {
    let todoListDiv = document.getElementById("todoListView");

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    let filterInput = document.getElementById("inputSearch").value.toLowerCase();

    for (let todo in todoList) {
        if (filterInput.value == '' || todoList[todo].title.toLowerCase().includes(filterInput) || todoList[todo].description.toLowerCase().includes(filterInput)) {
            let newElement = document.createElement("p");
            let newContent = document.createTextNode(todoList[todo].title + " " + todoList[todo].description);
            newElement.appendChild(newContent);

            let newDeleteButton = document.createElement("input");
            newDeleteButton.setAttribute("type", "button");
            newDeleteButton.setAttribute("value", "x");
            newDeleteButton.addEventListener("click", () => { deleteTodo(todo); });

            newElement.appendChild(newDeleteButton);
            todoListDiv.appendChild(newElement);
        }
    }
}

setInterval(updateTodoList, 1000);

let addTodo = function () {
    let inputTitle = document.getElementById("inputTitle").value;
    let inputDescription = document.getElementById("inputDescription").value;
    let inputPlace = document.getElementById("inputPlace").value;
    let inputDate = new Date(document.getElementById("inputDate").value);

    let newTodo = {
        title: inputTitle,
        description: inputDescription,
        place: inputPlace,
        category: '',
        dueDate: inputDate
    };

    todoList.push(newTodo);

    window.localStorage.setItem('todoList', JSON.stringify(todoList));
}

let deleteTodo = function (index) {
    todoList.splice(index, 1);
    window.localStorage.setItem('todoList', JSON.stringify(todoList));
}