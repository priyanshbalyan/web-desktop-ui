const fs = require('fs');
const sanitize = require('sanitize-filename');

module.exports.readContents = function(callback) {
    let arr = [];
    fs.readdir('./desktop', (err, items) => {
        if (err) return callback(err, null);
        for (var i = 0; i < items.length; i++) {
            var file = './desktop/' + items[i];

            arr.push({ folder: fs.statSync(file).isDirectory(), name: items[i] });
        }

        let arr2 = [];
        fs.readdir('./trash', (err, trashitems) => {
            for (var i = 0; i < trashitems.length; i++) {
                let file = "./trash/" + trashitems[i];
                arr2.push({ folder: fs.statSync(file).isDirectory(), name: trashitems[i] });
            }
            if (err) return callback(err, null);
            return callback(null, arr, arr2);
        });
        // console.log(arr);
    });
}

module.exports.createNewFile = function(data, callback) {
    let name = sanitize(data.name);
    let file = "./desktop/" + name;
    fs.open(file, 'w', (err, file) => {
        if (err) return callback(err, null);
        console.log("file saved");
        return callback(null, name);
    });
}

module.exports.createNewFolder = function(data, callback) {

    let name = sanitize(data.name);
    let dir = "./desktop/" + name;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("folder created");
        return callback(null, name);
    }
    return callback(new Error("Folder already exists"), null);
}

module.exports.moveToTrash = function(data, callback) {
    let name = data.name;
    let oldpath = "./desktop/" + name;
    let newpath = "./trash/" + name;
    fs.rename(oldpath, newpath, err => {
        if (err) return callback(err);
        return callback(null);
    })
}

module.exports.permaDelete = function(data, callback) {
    let name = data.name;
    let path = "./trash/" + name;
    if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
        fs.rmdir(path, err => {
            if (err) return callback(err);
            return callback(null);
        });
    } else
        fs.unlink(path, err => {
            if (err) return callback(err);
            return callback(null);
        })
}