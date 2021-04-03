
addFromStorage("do");

let doDiv = document.getElementById("do");
let doneDiv = document.getElementById("done");

let onDo = true
let mainBth = document.getElementById("mainBth");

doDiv.addEventListener("click", () => {
    if (!onDo) {
        onDo = true;
        let container = document.getElementById("container");
        container.innerHTML = '';
        doneDiv.style.backgroundColor = "#d6d6d6";
        doneDiv.style.borderBottom = "2px solid #b8b8b8";
        doDiv.style.backgroundColor = "#fff";
        doDiv.style.borderBottom = "0";
        mainBth.classList.remove("trash");
        mainBth.classList.add("plus");

        addFromStorage("do");
    }
});

doneDiv.addEventListener("click", () => {
    if (onDo) {
        onDo = false;
        let container = document.getElementById("container");
        container.innerHTML = '';
        doDiv.style.backgroundColor = "#d6d6d6";
        doDiv.style.borderBottom = "2px solid #b8b8b8";
        doneDiv.style.backgroundColor = "#fff";
        doneDiv.style.borderBottom = "0";
        mainBth.classList.remove("plus");
        mainBth.classList.add("trash");

        addFromStorage("done");
    }
});






let form = document.getElementById("form");

async function addFromStorage(storage) {
    let stored = await readStorage(storage);

    if (stored !== null && storage.length !== 0) {
        switch (storage) {
            case "do":
                stored.forEach((element) => {
                    if (Object.keys(element).length !== 0) {
                        createElmnt(element.text, element.date, element.id);
                    }
                })
                break;
            case "done":
                stored.forEach((element) => {
                    if (Object.keys(element).length !== 0) {
                        createElmntDone(element.text, element.date);
                    }
                })
                break;
            default:
                break;
        }

    }
}

async function readStorage(storage) {
    let stored = null;
    try {
        stored = await localStorage.getItem(storage);
        stored = Array.from(JSON.parse(stored))
    } catch (err) {
        console.error("Error while read storage. Crate new storage" + err);
        localStorage.setItem(storage, JSON.stringify([]));
    }
    return stored;
}

function main() {
    if (onDo) {
        form.classList.add("f-show");
    } else {
        let container = document.getElementById("container");
        container.innerHTML = '';
        localStorage.setItem("done", JSON.stringify([]));
    }

}

function hideForm() {
    form.classList.remove("f-show");
}

function submit() {
    let task = document.getElementById("newTodo");
    let text = task.value;
    task.value = "";
    let id = Date.now();
    createElmnt(text, dateNow(), id);
    save(text, id);
    hideForm();
}

function createElmnt(text, date, id) {
    let div = document.createElement("div");
    div.classList.add("taskItem");

    div.appendChild(createInput(id));
    div.appendChild(createStrike());
    div.appendChild(createText(text));
    div.appendChild(createDate(date));

    let container = document.getElementById("container");
    container.insertBefore(div, container.firstChild);
}

function createElmntDone(text, date) {
    let div = document.createElement("div");
    div.classList.add("taskItem");
    let strike = createStrike();
    strike.classList.add("striked");
    div.appendChild(strike);
    let task = createText(text)
    task.style.color = "#b8b8b8";
    div.appendChild(task);
    div.appendChild(createDate(date));

    let container = document.getElementById("container");
    container.insertBefore(div, container.firstChild);
}

function createInput(id) {
    let input = document.createElement("input");
    input.type = "checkbox";
    input.value = id;
    input.addEventListener('change', (event) => {
        event.target.disabled = true;
        removeTask(event.target.value);
    });
    return input;
}

function createStrike() {
    let strike = document.createElement("span");
    strike.classList.add("strike");
    return strike;
}

function createText(task) {
    let text = document.createElement("span");
    text.innerText = task;
    return text;
}

function createDate(date) {
    let spanDate = document.createElement("span");
    spanDate.classList.add("date");
    spanDate.innerText = date;
    return spanDate;
}

function dateNow() {
    let date = new Date();
    let strDate = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/" + date.getFullYear();
    return strDate;
}

async function save(text, id) {
    let stored = await readStorage("do");

    if (stored !== null) {
        let date = dateNow();
        let obj = {
            id: id,
            text: text,
            date: date
        }
        stored.push(obj);
        localStorage.setItem("do", JSON.stringify(stored));
    }
}

async function removeTask(id) {
    let stored = await readStorage("do");
    let newStored = [];
    if (stored !== null) {
        stored.forEach(async (obj) => {
            if (obj.id == id) {
                let storedDone = await readStorage("done");
                storedDone.push(obj);
                localStorage.setItem("done", JSON.stringify(storedDone));
            } else {
                newStored.push(obj);
            }

        });
        localStorage.setItem("do", JSON.stringify(newStored));
    }
}
