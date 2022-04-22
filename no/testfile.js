const express = require("express");
const multer = require("multer");
const uuidv4 = require("uuidv4");
const router = express.Router();

const DIR = "../../files/";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(" ").join("-");
		cb(null, uuidv4() + "-" + fileName);
	},
});

var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "file/json" ||
			file.mimetype == "file/xlsx" ||
			file.mimetype == "file/csv"
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error("Only .xlsx, .csv and .json format allowed!"));
		}
	},
});

// User model

//const Session = require("../models/session");

router.post("/uploadFile", upload.single("file"), (req, res, next) => {
	const url = req.protocol + "://" + req.get("host");
	const session = new Session({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		year: req.body.year,
		file: url + "../../files/" + req.file.filename,
	});

	session
		.save()
		.then((result) => {
			res.status(201).json({
				message: "file uploaded successfully!",
				fileUploaded: {
					_id: result._id,
					file: result.file,
				},
			});
		})
		.catch((err) => {
			console.log(err),
				res.status(500).json({
					error: err,
				});
		});
});
module.exports = router;
