const PUZZLE_X_MAX = 4;
const PUZZLE_Y_MAX = 4;

let permission = Notification.permission;

let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

let puzzles = document.getElementById("puzzles");

puzzles.addEventListener("dragover", function (event) {
    event.preventDefault();
});

puzzles.addEventListener("drop", function (event) {
    let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
    this.appendChild(myElement);
}, false);

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        const w = 600 / PUZZLE_X_MAX; //150
        const h = 300 / PUZZLE_Y_MAX; //75

        while(puzzles.firstChild) {
            puzzles.removeChild(puzzles.firstChild);
        }

        const imgData = canvas.toDataURL();

        let img = new Image();
        img.src = imgData;
        img.addEventListener("load", function () {
            let imgs = [];
            let id = 0;
            for (let y = 0; y < PUZZLE_Y_MAX; y++) {
                for (let x = 0; x < PUZZLE_X_MAX; x++) {
                    let c = document.createElement("canvas");
                    c.setAttribute("class", "puzzle");
                    c.setAttribute("id", "puzzle" + id);
                    c.setAttribute("draggable", "true");

                    c.addEventListener("dragstart", function(event) {
                        c.style.border = "5px dashed #D8D8FF";
                        event.dataTransfer.setData("text", c.id);
                    });

                    c.addEventListener("dragend", function(event) {
                        this.style.border = "none";
                    });


                    let ctx = c.getContext("2d");
                    ctx.drawImage(img, x * w, y * h, w, h, 0, 0, w * 2, h * 2);

                    imgs.push(c);

                    id++;
                }
            }

            shuffle(imgs);

            for(let img of imgs) {
                puzzles.appendChild(img);
            }

            let dragTarget = document.getElementById("drag-target");
            while (dragTarget.firstChild) {
                dragTarget.removeChild(dragTarget.firstChild);
            }

            for(let i = 0; i < PUZZLE_X_MAX * PUZZLE_Y_MAX; i++) {
                let dragTargetCell = document.createElement("div");
                dragTargetCell.setAttribute("class", "drag-target-cell");
                dragTargetCell.setAttribute("id", "drag-target" + i);
                dragTargetCell.style.left = (i % 4) * w + "px";
                dragTargetCell.style.top = Math.floor(i / 4) * h + "px";

                dragTargetCell.addEventListener("dragover", function (event) {
                    event.preventDefault();
                });

                dragTargetCell.addEventListener("drop", function (event) {
                    if (dragTargetCell.firstChild != null) {
                        return;
                    }
                    let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
                    this.appendChild(myElement);

                    win();
                }, false);

                dragTarget.appendChild(dragTargetCell);
            }
        });
    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon], 18);
    }, positionError => {
        console.error(positionError);
    });
});

function shuffle(arr) {
    for(let i = 0; i < 100; i++) {
        let id1 = Math.floor(Math.random() * arr.length);
        let id2 = Math.floor(Math.random() * arr.length);

        let temp = arr[id1];
        arr[id1] = arr[id2];
        arr[id2] = temp;
    }
}

function win() {
    let dragTarget = document.getElementById("drag-target");
    for (let dragTargetCell of dragTarget.children) {
        if (dragTargetCell.firstChild == null) {
            console.log("Brak zwycięstwa!");
            return; //brak zwycięstwa
        }
        let puzzle = dragTargetCell.firstChild;
        let id1 = parseInt(dragTargetCell.id.substring(("drag-target").length, dragTargetCell.id.length));
        let id2 = parseInt(puzzle.id.substring(("puzzle").length, puzzle.id.length));

        if (id1 !== id2) {
            console.log("Brak zwycięstwa!");
            return; // brak zwycięstwa
        }
    }

    //dragTarget.style.border = "3px solid green";
    console.log("Zwycięstwo!");
    if (permission === "granted") {
        winNotification();
    } else if (permission === "default") {
        Notification.requestPermission().then((permission) => {
            if (permission !== "granted") {
                winNotification();
            }
        });
    } else {
        alert("Wygrałeś/-aś!");
    }
}

function winNotification() {
    const notification = new Notification("Wygrałeś/-aś!", {
        body: "Brawo udało Ci się ułożyć puzzle!"
    });
}