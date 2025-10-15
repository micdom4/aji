"use strict"
let todoList = []; //declares a new array for Your todo list

let initList = function () {
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

initList();