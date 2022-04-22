const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

//Register User
router.post("/register", async (req, res) => {
	//crypt password
	//const psw = Math.random().toString(36).slice(-8);
	try {
		let user = await userModel.findOne({ email: req.body.email });
		if (user) {
			return res.status(404).json({ error: "User already exists" });
		}
		const hash = await bcrypt.hash(req.body.password, 10);

		//user model
		const newUser = new userModel({
			nom: req.body.nom,
			prenom: req.body.prenom,
			email: req.body.email,
			password: hash,
			role: "collaborateur",
		});

		// Url
		var url = `http://localhost:3000/api/user/verification`;
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
			subject: "Verification de compte",
			html: `
				<p>
				<b>Bonjour </b> <br/>
			     vérifier votre  adresse mail en cliquant ici :${url}
			   </p>
				`,
		});

		const saveUser = await newUser.save();
		return res.status(200).json({
			msg: "Collaborateur added ",
			verified: saveUser.verified,
		});
	} catch (err) {
		// console.log(err);
		return res.status(404).json({ error: err.message });
	}
});

// verification de compte user
router.get("/verification", async (req, res) => {
	/*const email = req.body.email;

	userModel
		.findOne(email)
		.then((user) => {
			user.verified = "true";
			user
				.save()
				.then(() => {
					res.status(200).json({ msg: " user verified" });
				})
				.catch((err) => {
					res.status(404).json({ msg: err });
				});
		})
		.catch((err) => {
			res.status(500).json({ msg: err });
		});*/
	const user = await userModel.findOne({ email: req.body.email });
	if (user) {
		user.verified = "true";
		await user.save();
		res.status(200).json({ msg: " user verified" });
	} else {
		res.status(200).json({ msg: " user not found " });
	}
});

//Login User
/*si  user exist ===>  generate Token else  return not found*/

router.post("/login", async (req, res) => {
	try {
		const user = await userModel.findOne({ email: req.body.email });
		if (!user) {
			return res.status(404).json({ error: " This user not exist! " });
		}
		//compare passwords (body / db)
		const isMatch = await bcrypt.compare(req.body.password, user.password);
		console.log(isMatch);
		if (isMatch == false) {
			return res.status(400).json({ error: "Incorrect password" });
		}
		if (user.verified) {
			//token
			var token = jwt.sign(
				{
					//_payload
					id: user._id,
				},
				process.env.PRIVATE_KEY,
				{ expiresIn: "8h" } //date d'expération de token
			);

			return res.status(200).json({
				token,
				user: {
					_id: user._id,
					nom: user.nom,
					prenom: user.prenom,
					email: user.email,
				},
			});
			//==>correct psw && verified :  authorization  JSON WEB Token
		} else {
			return res.status(404).json({
				error: "This user is  not verified,  Please verify your email.",
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: err.message });
	}
});

//Edit user profile
router.post("editUser", async (req, res) => {
	// find the user profile
	userModel
		.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				user.nom = req.body.nom;
				user.prenom = req.body.prenom;
				user.adresse = req.body.adresse;
				user.tel = req.body.tel;
				user.bio = req.body.bio;

				user
					.save()
					.then(() => {
						return res.send({ msg: "user profile edit with success" });
					})
					.catch((error) => {
						return res.send({ msg: error });
					});
			} else {
				return res.send({ msg: "not found " });
			}
		})
		.catch((err) => {
			return res.send({ err });
		});
});

//change password
router.post("/editPassword", async (req, res) => {
	// send and hashed the new psw
	const newPsw = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const hashedpassword = await bcrypt.hash(newPsw, salt);
	//  get  the old PSW && Compared to the new

	const similar = await bcrypt.compare(req.body.password, user.password);

	if (!similar) {
		return res.status(400).json("not matched!");
	} else {
		userModel
			.find({ email: req.body.email })
			.then((user) => {
				user.password = hashedpassword;
				user
					.save()
					.then(() => {
						return res.send({ msg: " your password changed successfully " });
					})
					.catch((error) => {
						return res.send({ msg: error });
					});
			})
			.catch((err) => {
				return res.send({ errors: err });
			});
	}
});
//forget password
router.post("/forgetPssword", async (req, res) => {
	try {
		const user = await userModel.find({ email: req.body.email });
		if (!user) {
			return res.status(400).json("This user not exist!");
		} else {
			const psw = Math.random().toString(36).slice(-8); // gvenerate Random password
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(psw, salt); //hashed password
			user.password = hash;
			/**Send Email */
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
				subject: "Rénitialiser votre mot de passe",
				html: `
					<p>
					<h5>Bonjour  ${user.nom}  ${user.prenom}  </h5> <br/>
					votre mot de passe a été modifié avec succeés , <br/>
					volà votre nouveau mot de passe ::${psw}
				    </p>
				   Cordialement
					`,
			});
			if (info) {
				console.log(info);
			} else {
				console.log(error);
			}
			//save
			user
				.save()
				.then(() => {
					return res.send({
						msg: "password changed successfully  , check your email !!",
					});
				})
				.catch((error) => {
					return res.send({ msg: error });
				});
		}
	} catch (err) {
		return res.status(500).json(err);
	}
});

// get all user
router.get("/findAllUsers", async (req, res) => {
	try {
		const data = await userModel.find();
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});

// get one user
router.get("/findSingleUser", async (req, res) => {
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

// delete one user
router.delete("/deleteUser", async (req, res) => {
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

module.exports = router;
