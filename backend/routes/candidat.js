const express = require("express");
const router = express.Router();
const candidatModel = require("../models/candidat");
const reader = require("xlsx");
const nodemailer = require("nodemailer");

const file = reader.readFile(
	"D:/PFEBackend/backend/routes/session/files/SessionPFE2022.xlsx"
);

//Get data from Excel File to db
router.post("/export", async (req, res) => {
	try {
		let data = [];
		const sheets = file.SheetNames;
		for (let i = 0; i < sheets.length; i++) {
			const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
			temp.forEach((res) => {
				data.push(res);
			});
		}
		console.log(data);
		// Parcour data
		for (let i = 0; i < data.length; i++) {
			req.body.nom = data[i].nom;
			req.body.prenom = data[i].prenom;
			req.body.adresse = data[i].adresse;
			req.body.tel = data[i].tel;
			req.body.profil = data[i].profile;
			req.body.cv = data[i].cv;
			req.body.email = data[i].email;
			req.body.password = Math.random().toString(36).slice(-8);
			const cand = await candidatModel.findOne({ email: req.body.email });
			if (cand) {
				return res.status(404).json({ error: "candidat already exists" });
			}
			const candidat = await candidatModel.create(req.body);
			console.log("candidat added : info :");
			//console.log(candidat);
		}
		return res.status(201).json("File uploaded and  send to db ");
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
});

// get all  users
router.get("/allCandidat", async (req, res) => {
	try {
		const candidats = await candidatModel.find();
		return res.status(200).json({
			msg: "success",
			candidats,
		});
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
});

// get one user
router.get("/findOneCandidat", async (req, res) => {
	try {
		const data = await candidatModel.findOne({ email: req.body.email });
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({ msg: "user not found " });
		}
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
});

// send Email to selected user
router.post("/sendMail", async (req, res) => {
	try {
		for (let i = 0; i < req.body.emails.length; i++) {
			const candidat = await candidatModel.findOne({
				email: req.body.emails[i].email,
			});
			console.log(candidat);
			// Url
			var url = `http://localhost:3000/candidat/login`;
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.GMAIL_USER,
					pass: process.env.GMAIL_PSW,
				},
			});
			let info = await transporter.sendMail({
				from: process.env.GMAIL_USER,
				to: candidat.email,
				subject: "Invitation pour un  Test d'evalution ",
				html: `
				<p>
				<b>Bonjour ${candidat.nom} ${candidat.prenom} </b> <br/>
			     :${url}
			   </p>
				`,
			});
			if (info) {
				console.log(info);
			} else {
				console.log("err");
			}
		}
		return res.status(201).json({ msg: "success" });
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
});

module.exports = router;
