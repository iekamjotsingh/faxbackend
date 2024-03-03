const express = require("express");
require('dotenv').config()
const app = express();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const cors = require('cors');
const multer  = require('multer');
const bodyParser = require('body-parser');

const upload = multer({ dest: 'uploads/' }); // specify the folder to store uploaded files

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // parse non-file form fields
app.use(express.static("public"));

app.post("/sendFax", upload.single('attachments'), (req, res) => {
    const data = new FormData();
    data.append("faxNumber", req.body.faxNumber);
    data.append("attachments", fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
    }); // use multer's req.file.path
    data.append("coverPage", "false");
    data.append("recipientName", req.body.recipientName);
    data.append("senderName", req.body.senderName);
    data.append("subject", req.body.subject);
    data.append("callerId", "18888342194");
    data.append("scheduledDate", "2029-02-29T12:45:00.000Z");
    data.append("webhookId", "d1077489-5ea1-4db1-9760-853f175e8288");

    const config = {
        method: "post",
        url: "https://api.documo.com/v1/faxes",
        headers: {
            Authorization: process.env.AUTH,
            "Content-Type": "multipart/form-data",
            ...data.getHeaders(),
        },
        data: data,
    };

    axios(config)
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});