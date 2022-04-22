const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

/*************  CRUD Collaborateur par Admin   *************/

// Add  New Collaborateur
router.post("/AddUser", async (req, res) => {
	try {
		// test  if existe  email or not
		const user = await userModel.findOne({ email: req.body.email });
		if (!user) {
			bcrypt.genSalt(10, (err, salt) => {
				const psw = Math.random().toString(36).slice(-8); // gvenerate Random password
				req.body.password = psw;
				bcrypt.hash(psw, salt).then(async (hash) => {
					psw = hash;
					req.body.role = "Collaborateur ";
					const userS = await userModel.create(req.body);
					console.log("user added ");
					let url = `http://localhost:3000/login`;
					const transporter = nodemailer.createTransport({
						service: "gmail",
						auth: {
							user: process.env.GMAIL_USER,
							pass: process.env.GMAIL_PSW,
						},
					});
					let info = await transporter.sendMail({
						from: process.env.GMAIL_USER,
						to: userS.email,
						subject: "Bienvennue -Orange Test",
						html: `
                             <p> Cher collaborateur ,   ${userS.nom} ${userS.prenom} ,
							    </br> Nous avons   le créer une compte sur Orange Test ,
							      Pour pouvoir accéder à la plateforme ,veuillez connecter sur se lien:   ${url}
							 </p>
                                `,
					});
					if (info) {
						console.log(" Email sended");
					}
					return res.json("user added and email sended");
				});
			});
		} else if (!user.verified) {
			return res.json({
				msg: "This user is already Signup. Please verify your email.",
				link: "http://localhost:3600/api/verify",
			});
		} else {
			return res.json({
				msg: "This user is already here! Otherwise try another email.",
			});
		}
	} catch (error) {
		res.status(404).json(error.message);
	}
});

router.post("/Add", async (req, res) => {
	try {
		let user = await userModel.findOne({ email: req.body.email });
		if (user) {
			return res.json({
				msg: "This user is already here! Otherwise try another email.",
			});
		}
		//crypt password
		const psw = Math.random().toString(36).slice(-8);
		console.log(psw);
		const hash = await bcrypt.hash(psw, 10);
		req.body.role = "Collaborateur ";
		//user model
		const newUser = new userModel({
			nom: req.body.nom,
			prenom: req.body.prenom,
			email: req.body.email,
			password: hash,
			verified: req.body.verified,
		});

		// Url
		let url = `http://localhost:3000/login`;
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PSW,
			},
		});
		let info = await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: newUser.email,
			subject: "Bienvennue ",
			html: `
				 <p> Cher collaborateur ,   ${newUser.nom} ${newUser.prenom} ,
					</br> Nous avons   le créer une compte sur Orange Test ,
					  Pour pouvoir accéder à la plateforme ,veuillez connecter sur se lien:   ${url} <br/>
					  avec : <br/>
                            adresse e-mail : ${newUser.email} <br/>
                            mot de passe :  ${psw}<br/>
				 </p>
					`,
		});
		if (info) {
			console.log(info);
		} else {
			console.log("err");
		}
		const saveUser = await newUser.save();
		return res.status(200).json({
			msg: "Collaborateur added ",
			verified: saveUser.verified,
		});
	} catch (err) {
		return res.status(404).json({ error: err.message });
	}
});

// get all collaborateur
router.get("/findAllUsers", async (req, res) => {
	try {
		const role = req.body.role;
		if (role == "collaborateur") {
			const users = await userModel.find({ role: role });
			return res.status(200).json({
				msg: "list collaborateur",
				users,
			});
		} else {
			return res.status(404).json({ message: "err" });
		}
	} catch (errors) {
		return res.status(500).json({ message: errors.message });
	}
});

// get one collaborateur
router.get("/findSingleUser/email", async (req, res) => {
	try {
		const data = await userModel.findOne({ email: req.body.email });
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({ msg: "user not found " });
		}
	} catch (error) {
		res.status(404).json({ error: error });
	}
});

// delete one collaborateur
router.delete("/deleteUser/:email", async (req, res) => {
	try {
		const data = await userModel.findOneAndDelete({ email: req.body.email });

		if (!data) {
			res.status(200).json({ message: "deleted" });
		} else {
			res.status(404).json({ msg: "user not found " });
		}
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

// Send Mail to   collaborateur with excel file
router.post("/SendMailToUser", async (req, res) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PSW,
			},
		});
		let info = await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: req.body.email,
			subject: "Candidatures PFE2022",

			attachments: [
				{
					filename: "SessionPFE2022.xlsx",
					path: __dirname + "../file/SessionPFE2022.xlsx",
					contentType: "application/xlsx",
				},
			],

			html: `
            <h1> Bonjour  </h1>
                `,
		});
		res.status(200).json({ msg: " sented " });
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

module.exports = router;
