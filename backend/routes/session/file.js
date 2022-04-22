const express = require("express");
const multer = require("multer");
const route = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./files/");
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(" ").join("-");
		cb(null, file.fieldname + "-" + fileName);
	},
});

var upload = multer({ storage: storage }).single("file");

route.post("/up", function (req, res) {
	upload(req, res, function (err) {
		if (err) {
			res.send("error uploading file");
		}
		if (req.file == null) {
			res.json({
				success: false,
				message: "not found !",
			});
		} else {
			res.json({
				success: true,
				message: "file uploaded successfully!",
				file: req.file,
			});
		}
	});
});

module.exports = route;
