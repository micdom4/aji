"use strict"
let todoList = [];

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

// initList();

let getJSONBin = function () {

    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            todoList = JSON.parse(req.responseText).record;
        }
    };

    req.open("GET", "https://api.jsonbin.io/v3/b/68f6c31dae596e708f203292", true);
    req.setRequestHeader("X-Master-Key", "$2a$10$AJECd0NyYhaDbn4mS1sCCez4GQ.b41TMGk5wwn3DhV6Ff6ID97FFK");
    req.send();
}

getJSONBin();

let updateJSONBin = function () {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
    };

    req.open("PUT", "https://api.jsonbin.io/v3/b/68f6c31dae596e708f203292", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", "$2a$10$AJECd0NyYhaDbn4mS1sCCez4GQ.b41TMGk5wwn3DhV6Ff6ID97FFK");
    req.send(JSON.stringify(todoList));
}

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

    let feedback = document.getElementById("feedback");

    let newTodo = {
        title: inputTitle,
        description: inputDescription,
        place: inputPlace,
        category: '',
        dueDate: inputDate
    };

    todoList.push(newTodo);

    updateJSONBin();

    // window.localStorage.setItem('todoList', JSON.stringify(todoList));

    if (todoList.includes(newTodo)) {
        feedback.innerText = "Success! Added new todo: " + inputTitle;
        setTimeout(() => { feedback.innerText = ""; }, 3000);
    }
}

let deleteTodo = function (index) {
    todoList.splice(index, 1);
    updateJSONBin();

    // window.localStorage.setItem('todoList', JSON.stringify(todoList));
}