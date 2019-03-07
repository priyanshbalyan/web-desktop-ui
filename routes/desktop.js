'use strict';
const express = require('express');
var desktopRouter = express.Router();

let fileController = require('../controllers/filecontroller.js');

desktopRouter.get("/", (req, res) => {
    fileController.readContents((err, items, trashitems) => {
        if (err) console.log(err);
        // console.log(items);
        res.render('desktop', { items: items, trashitems: trashitems });
    });
});

desktopRouter.post("/newfile", (req, res) => {
    // console.log(req.body);
    fileController.createNewFile(req.body, (err, file) => {
        console.log(err);
        if (err) return res.send({ status: "error", error: err });
        return res.send({ "status": "ok", file: file });
    });
});

desktopRouter.post('/newfolder', (req, res) => {
    // console.log(req.body);
    fileController.createNewFolder(req.body, (err, file) => {
        console.log(err);
        if (err) return res.send({ status: "error", error: err });
        return res.send({ "status": "ok", file: file });
    });
});

desktopRouter.post('/deleteitem', (req, res) => {
    // console.log(req.body);
    fileController.moveToTrash(req.body, (err) => {
        console.log(err);
        if (err) return res.send({ status: "error" });
        return res.send({ status: "ok" });
    });
});

desktopRouter.post('/deletetrashitem', (req, res) => {
    // console.log(req.body);
    fileController.permaDelete(req.body, (err) => {
        console.log(err);
        if (err) return res.send({ status: "error" });
        return res.send({ status: "ok" });
    })
})



module.exports = desktopRouter;