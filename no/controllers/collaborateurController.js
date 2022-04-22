/*const candidatModel = require("../models/candidat");
const ValidateRegister = require("../validations/register");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

//Function :Add question
const listerCandidat = async (req, res) => {
	const candidat = await QuestionModel.findOne({ id: req.body.id });
	if (!candidat) {
		//o n i //
	} else {
		return res.json({
			msg: "This  candidats already here!",
		});
	}
};

//Export Methodes
module.exports = {
	listerCandidat,
};
*/

/************************* */
var express = require("express");
var multer = require("multer");
var route = express.Router();
/*
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null,  "../files/");
	},

	filename: function (req, file, cb) {
		console.log(file);
		let extArray = file.mimetype.split("/");
		let extension = extArray[extArray.length - 1];
		 cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
		cb(null, file.originalname + "-" + Date.now() + "." + extension);
	},
});
*/
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, " ../../files/");
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
		res.json({
			success: true,
			message: "File uploaded!",
			file: req.file,
		});
	});
});
module.exports = route;
