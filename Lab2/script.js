class Task {
    constructor(id, name, date) {
        this.id = id;
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
            button.setAttribute("id", "edit");
            button.setAttribute("type", "button");
            button.innerText = "Edytuj"
            button.addEventListener("click", function(event) {
                editing = false;
                let i1 = document.getElementById("changeName");
                let i2 = document.getElementById("changeDate");
                tasks[parent.id].name = i1.value;
                tasks[parent.id].date = i2.value;

                saveData();

                search();
            });
            parent.appendChild(button);

            editing = true; // mam nadzieję że to działa synchronicznie
        });
        labelName.innerText = this.name;
        li.appendChild(labelName);

        let labelDate = document.createElement("label");
        labelDate.setAttribute("class", "date")
        labelDate.innerText = this.date;
        li.appendChild(labelDate);

        let removeButton = document.createElement("button");
        removeButton.setAttribute("class", "remove-button");
        removeButton.innerText = "Usuń";
        removeButton.addEventListener("click", function(event) {
            if (editing) {
                return;
            }

            let parent = removeButton.parentElement;
            delete tasks[parent.id];

            saveData();

            search();
        });
        li.appendChild(removeButton);

        return li;
    }
}

const DATA_KEY = "TASKS";
let globalId = 0;
let tasks = null;
getData();
let editing = false;

draw();

function getData() {
    let data = localStorage.getItem(DATA_KEY);
    if (data == null || data === "") {
        return;
    }

    tasks = {};
    let jsonParsed = JSON.parse(data);
    for (let key in jsonParsed) {
        let task = jsonParsed[key];
        addTask(task["name"], task["date"]);
    }
}

function addTask(name, date) {
    tasks[globalId] = new Task(globalId, name, date);
    globalId++;
}

function saveData() {
    if (tasks == null || tasks.length <= 0) {
        return;
    }

    let data = JSON.stringify(tasks); // można by było wyczyścić żeby nie używać id, bo i tak nie jest istotne przy pobieraniu
    localStorage.setItem(DATA_KEY, data);
}

function draw(searchValue="") {
    if (tasks == null || tasks.length <= 0) {
        return;
    }

    let parent = document.getElementById("todo_list");
    removeAllChildren(parent);

    for (let key in tasks) {
        let task = tasks[key];
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

function search() { // używane tez do "rysowania" żeby zgadzało się z wyszukiwanym tekstem
    let searchValue = document.getElementById("search").value;

    if (searchValue.length >= 2) {
        draw(searchValue);
    } else {
        draw();
    }

    for (let key in tasks) {
        let task = tasks[key];

        let item = document.getElementById("labelText" + task.id);
        if (item == null) {
            continue;
        }

        if (task.name.search(searchValue) !== -1 && searchValue.length >= 2) {
            item.innerHTML = task.name.replaceAll(searchValue, "<B><font color='green'>" + searchValue + "</font></B>");
        } else {
            item.innerText = task.name;
        }
    }
}

function add() {
    let input1 = document.getElementById("newName");
    let input2 = document.getElementById("newDate");

    if (input1.value.length < 3 || input1.value.length > 255) {
        alert("Zadanie musi zawierać co najmniej 3 znaki i mniej niż 255 znaków!")
        return;
    }

    if (new Date(input2.value).toDateString() === "Invalid Date") { // :D
        alert("Niepoprawna data!");
        return;
    }

    if (new Date(input2.value) <= Date.now()) {
        alert("Już za późno! :(");
        return;
    }

    addTask(input1.value, input2.value);

    saveData();

    input1.value = "";
    input2.value = "";

    search();
}

window.addEventListener("keydown", function (event) {
   switch(event.key.toLowerCase()) {
       case "enter":
           if (editing) {
               let button = document.getElementById("edit");
               button.click();
           }
           break;
       case "escape": //nie działa w evencie "keypress" '-'
           if (editing) {
               editing = false;
               search();
           }
           break;
       case "shift":
           console.log("LOCAL STORAGE: " + localStorage.getItem(DATA_KEY));
           break;
       default:
           //console.debug("Key" + event.key);
           break;
   }
});