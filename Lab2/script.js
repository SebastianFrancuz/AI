class Task {
    constructor(name, date) {
        this.id = tasks.length;
        this.name = name;
        this.date = date;
        this.done = false;
    }

    createLi = function() {
        let li = document.createElement("li");
        li.setAttribute("id", this.id);

        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "done" + this.id);
        checkbox.addEventListener("click", function (event) {
            let parent = checkbox.parentElement;
            if (checkbox.checked) {
                tasks[parent.id].done = true;
                parent.setAttribute("class", "done");
            } else {
                tasks[parent.id].done = false;
                parent.removeAttribute("class");
            }

            saveData();
        });

        if (this.done) { // :D
            checkbox.checked = true;
            li.setAttribute("class", "done");
        }

        li.appendChild(checkbox);

        let labelName = document.createElement("label");
        labelName.setAttribute("id", "labelText" + this.id);
        labelName.setAttribute("class", "name");
        labelName.addEventListener("click", function(event) {
            if (editing) {
                return;
            }
            let parent = labelName.parentElement;
            removeAllChildren(parent);

            let input = document.createElement("input");
            input.setAttribute("id", "changeName");
            input.setAttribute("class", "changeName");
            input.setAttribute("type", "text");
            input.setAttribute("value", tasks[parent.id].name);
            input.setAttribute("maxlength", "20");
            parent.appendChild(input);

            let input2 = document.createElement("input");
            input2.setAttribute("id", "changeDate");
            input2.setAttribute("class", "changeDate");
            input2.setAttribute("type", "date");
            input2.setAttribute("value", tasks[parent.id].date);
            parent.appendChild(input2);

            let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.innerText = "Edytuj"
            button.addEventListener("click", function(event) {
                editing = false;
                let i1 = document.getElementById("changeName");
                let i2 = document.getElementById("changeDate");
                tasks[parent.id].name = i1.value;
                tasks[parent.id].date = i2.value;

                saveData();

                draw();
            });
            parent.appendChild(button);

            editing = true;
        });
        labelName.innerText = this.name;
        li.appendChild(labelName);

        let labelDate = document.createElement("label");
        labelDate.innerText = this.date;
        li.appendChild(labelDate);

        return li;
    }
}

const DATA_KEY = "TASKS";
let tasks = null;
getData();
let editing = false;

draw();

function getData() {
    let data = localStorage.getItem(DATA_KEY);
    if (data == null || data === "") {
        return;
    }

    tasks = [];
    for (let task of JSON.parse(data)) {
        tasks.push(new Task(task["name"], task["date"]));
    }
}

function saveData() {
    if (tasks == null || tasks.length <= 0) {
        return;
    }

    let data = JSON.stringify(tasks);
    localStorage.setItem(DATA_KEY, data);
}

function draw(searchValue="") {
    if (tasks == null || tasks.length <= 0) {
        return;
    }

    let parent = document.getElementById("todo_list");
    removeAllChildren(parent);

    for (let task of tasks) {
        if (searchValue === "" || task.name.search(searchValue) !== -1) {
            parent.appendChild(task.createLi());
        }
    }
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

function search() {
    let searchValue = document.getElementById("search").value;

    if (searchValue.length > 10) {
        return;
    }

    draw(searchValue);

    for (let task of tasks) {
        let item = document.getElementById("labelText" + task.id);
        if (item == null) {
            continue;
        }

        if (task.name.search(searchValue) !== -1) {
            item.innerHTML = task.name.replaceAll(searchValue, "<B>" + searchValue + "</B>");
        } else {
            item.innerText = task.name;
        }
    }
}

function add() {
    let input1 = document.getElementById("newName");
    let input2 = document.getElementById("newDate");

    if (new Date(input2.value) <= Date.now()) {
        alert("NIE");
        return;
    }

    tasks.push(new Task(input1.value, input2.value));

    saveData();

    input1.value = "";
    input2.value = "";

    draw();
}