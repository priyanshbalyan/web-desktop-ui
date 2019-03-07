let menuVisible = false;
let trashVisible = false;

window.addEventListener("click", e => {
    if (menuVisible) {
        let menu = document.querySelector(".menu");
        menu.style.display = "none";
        menuVisible = true;
    }
});

window.addEventListener("contextmenu", e => {
    e.preventDefault();

    if (document.querySelector('.trashview').style.display == "block")
        showTrashContextMenuItems();
    else
        showSimpleContextMenuItems();

    // console.log(e.srcElement.id);
    let menu = document.querySelector(".menu");
    menu.style.left = e.pageX;
    menu.style.top = e.pageY;
    menu.style.display = "block";
    if (e.srcElement.id || e.target.id) {
        let deloption = document.querySelector('.delete-option');
        deloption.style.display = "block";
        delelement = e.srcElement.id || e.target.id;
    }
    menuVisible = true;
    return false;
});

function showSimpleContextMenuItems() {
    document.querySelector('.new-file-option').style.display = "block";
    document.querySelector('.new-folder-option').style.display = "block";
    let deloption = document.querySelector('.delete-option');
    deloption.style.display = "none";
}

function showTrashContextMenuItems() {
    document.querySelector('.new-file-option').style.display = "none";
    document.querySelector('.new-folder-option').style.display = "none";

}

function createnewfile() {
    // let name = document.querySelector(".filename");
    let name = prompt("Enter name of the file");
    if (!name) return;
    let obj = { name: name };

    fetch("/desktop/newfile", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            console.log(data);
            if (data.status == "ok") {
                let box = document.querySelector(".box");
                box.innerHTML += addItem(data.file);
            }
        })
        .catch((err) => console.log("An error occured while performing that operation", err));
}

function createnewfolder() {
    // let name = document.querySelector(".foldername");
    let name = prompt("Enter name of folder");
    if (!name) return;
    let obj = { name: name };

    fetch("/desktop/newfolder", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            console.log(data);
            if (data.status == "ok") {
                let box = document.querySelector(".box");
                box.innerHTML += addItem(data.file, true);
            }
        })
        .catch((err) => console.log("An error occured while performing that operation", err));
}

function addItem(name, folder = false) {
    return `<div class="folder" id="` + name + `">
                <center>
                <img src="/img/` + (folder ? "folder" : "file") + `.png" id="` + name + `"/>
                <p style="text-align:center" id="` + name + `">` + name + `</p>
                </center>
            </div>`;
}

let delelement = null;

function deleteitem() {

    if (!delelement) return;
    let obj = { name: delelement };

    let url = "/desktop/deleteitem";
    if (trashVisible)
        url = "desktop/deletetrashitem";
    fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            console.log(data);
            if (data.status == "ok") {
                trashVisible ? alert("Item deleted permanently") : alert("Item moved to trash.");
                let ele = document.getElementById(delelement);
                if (!trashVisible)
                    document.querySelector('.trashview').appendChild(ele);
                else
                    ele.parentNode.removeChild(ele);
            }
        })
        .catch((err) => console.log("An error occured while performing that operation", err));
}


function closetrashview() {
    let ele = document.querySelector('.trashview');
    ele.style.display = "none";
    trashVisible = false;
}

function showtrashview() {
    let ele = document.querySelector('.trashview');
    ele.style.display = "block";
    trashVisible = true;
}