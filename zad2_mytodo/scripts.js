import { Groq } from 'groq-sdk'
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

const GROQ_API_KEY = "GROQ-API-KEY"; // Replace with actual GROQ API key
const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

let fetchCategory = async function (title, description) {
    const categories = ["Work", "Home", "Hobby", "Health", "Finance", "University", "Shopping", "Travel", "Other", "Private"];

    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": "User will be sending title and description (with new line character in between) of his ToDo list item. Assign to his message a category choosing from: " + categories.toString() + ". Return only selected category. If item is related to family, friends or personal matters, choose Private. If item does not fit any category, choose Other."
            },
            {
                "role": "user",
                "content": title + "\n" + description
            }
        ],
        "model": "openai/gpt-oss-20b",
        "temperature": 1,
        "max_completion_tokens": 8192,
        "top_p": 1,
        "stream": false,
        "reasoning_effort": "medium",
        "stop": null
    });

    let category = chatCompletion.choices[0].message.content;
    if (category == null || !categories.includes(category)) {
        category = "Other";
    }
    
    console.log("Fetched category: " + category + " for todo: " + title);

    return category;
}

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
    let todoTable = document.getElementById("todoTableView");

    while (todoTable.firstChild) {
        todoTable.removeChild(todoTable.firstChild);
    }

    let searchInput = document.getElementById("inputSearch").value.toLowerCase();

    for (let todo in todoList) {
        if (searchInput.value == '' || todoList[todo].title.toLowerCase().includes(searchInput) || todoList[todo].description.toLowerCase().includes(searchInput)) {
            if (todoList.filter(checkTodoDateInRange).includes(todoList[todo])) {
                let newRow = document.createElement("tr");
                let headers = ["title", "description", "place", "dueDate", "category"];

                for (let h in headers) {
                    let newData = document.createElement("td");
                    let data = todoList[todo][headers[h]];
                    let newContent = document.createTextNode(data);
                    newData.appendChild(newContent);

                    if (headers[h] != "title" && headers[h] != "description") {
                        newData.classList.add("text-center");
                    }
                    newRow.appendChild(newData);
                }

                let newDeleteButton = document.createElement("input");
                newDeleteButton.setAttribute("type", "button");
                newDeleteButton.classList.add("btn-close");
                newDeleteButton.addEventListener("click", () => { deleteTodo(todo); });

                let newData = document.createElement("td");
                newData.classList.add("text-center");
                newData.appendChild(newDeleteButton);
                newRow.appendChild(newData);

                todoTable.appendChild(newRow);
            }
        }
    }
}

setInterval(updateTodoList, 1000);

let checkTodoDateInRange = function (todo) {
    let date = new Date(todo.dueDate);
    let startDate = new Date(document.getElementById("inputStartDate").value)
    let endDate = new Date(document.getElementById("inputEndDate").value);

    if (startDate == 'Invalid Date' && endDate == 'Invalid Date') {
        return true;
    } else if (startDate == 'Invalid Date') {
        return date <= endDate;
    } else if (endDate == 'Invalid Date') {
        return date >= startDate;
    } else {
        return date >= startDate && date <= endDate;
    }
}

let addTodo = async function () {
    let inputTitle = document.getElementById("inputTitle").value;
    let inputDescription = document.getElementById("inputDescription").value;
    let inputPlace = document.getElementById("inputPlace").value;
    let inputDate = new Date(document.getElementById("inputDate").value);

    let feedback = document.getElementById("feedback");

    let newTodo = {
        title: inputTitle,
        description: inputDescription,
        place: inputPlace,
        category: await fetchCategory(inputTitle, inputDescription),
        dueDate: inputDate.toISOString()
    };

    todoList.push(newTodo);

    updateJSONBin();

    // window.localStorage.setItem('todoList', JSON.stringify(todoList));

    if (todoList.includes(newTodo)) {
        feedback.innerText = "Success! Added new todo: \"" + inputTitle + "\"";
        setTimeout(() => { feedback.innerText = ""; }, 3000);
    }
}

document.getElementById("addButton").addEventListener("click", addTodo);

let deleteTodo = function (index) {
    todoList.splice(index, 1);
    updateJSONBin();

    // window.localStorage.setItem('todoList', JSON.stringify(todoList));
}