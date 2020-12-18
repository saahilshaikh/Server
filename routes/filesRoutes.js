const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const keys = require('../config/keys');
const requireLogin = require("../middlewares/requireLogin");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const axios = require('axios');
var FormData = require('form-data');
const conn = mongoose.connection;



let gfs;
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const storage = new GridFsStorage({
    url: keys.mongoURI,
    file: (req, file) => {
        console.log("EXPRESS APP 50", file);
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});


module.exports = (app) => {

    app.post('/api/uploads', upload.single("upload"), async (req, res) => {
        console.log(req.file.filename);
        var data = {
            "uploaded": true,
            "url": '/api/file/show/' + req.file.filename,
        };
        var myJSON = JSON.stringify(data);
        res.send(myJSON);
    })

    app.post("/api/file/upload", upload.single("file"), (req, res) => {
        console.log("FU 46", req);
        res.send(req.file)
    });

    app.get("/api/file/show/:filename", requireLogin, (req, res) => {
        const file = gfs
            .find({
                filename: req.params.filename
            })
            .toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: "no files exist"
                    });
                }
                gfs.openDownloadStreamByName(req.params.filename).pipe(res);
            });
    });

    app.post("/api/file/delete", requireLogin, (req, res) => {
        gfs.delete(new mongoose.Types.ObjectId(req.body.fileId), (err, data) => {
            if (err) return res.status(404).json({ err: err.message });
            res.send(true);
        });
    });
}
