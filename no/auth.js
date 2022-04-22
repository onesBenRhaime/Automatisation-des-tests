const express = require("express");
const routerAuth = express.Router();
const UserModel = require("../backend/models/user");
const ValidateLogin = require("./validations/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//Login User
//si  user exist ===> Token else  return not found /
routerAuth.post("/login", async (req, res) => {
	// test :  body errors
	const { errors, isValid } = ValidateLogin(req.body);
	try {
		if (!isValid) {
			res.status(404).json(errors);
		} else {
			UserModel.findOne({ email: req.body.email }).then((user) => {
				if (!user) {
					errors.email = " this user ins not found ";
					res.status(404).json(errors);
				} else {
					//compare passwords (body / db)
					bcrypt.compare(req.body.password, user.password).then((match) => {
						// incorrect psw
						if (!match) {
							errors.password = "incorrect password";
							res.status(404).json(errors);
						} else if (req.user.verified == true) {
							// verified or not
							var token = jwt.sign(
								{
									//_payload
									id: user._id,
									fullName: user.fullName,
									email: user.email,
									role: user.role,
								},
								process.env.PRIVATE_KEY,
								{ expiresIn: "8h" } //date d'expération de token
							);
							res.status(200).json({
								message: "Welcome " + user.fullName,
								token: "Token " + token,
							});
							//==>correct psw && verified :  authorization  JSON WEB Token
						} else {
							res.status(200).json({
								message:
									"This user is  not verified,  Please verify your email.",
								link: "http://localhost:3600/api/verifiy",
							});
						}
					});
				}
			});
		}
	} catch (error) {
		res.status(404).json(error.message);
	}
});

// Verifiy  adresse mail
routerAuth.post("/verifiy", async (req, res) => {
	const user = await UserModel.findOne({ email: req.body.email });

	if (!user.verified) {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PSW,
			},
		});
		let url = `http://localhost:3600/api/auth/verification/${user.email}`;
		let info = await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: req.body.email,
			subject: "Vérification  ",
			attachments: [
				{
					filename: "logo.png",
					path: __dirname + "/logo.png",
					cid: "logo@",
				},
			],
			html: `
            <p>
            <h5>Bonjour  ${req.body.fullName} </h5> <br/>
           Nous veneons  de créer un compte sur <h2>Orange test</h2>. Avant de pouvoir utiliser votre compte, 
           vous devez vérifier que cette adresse e-mail est bien la vôtre en cliquant ici :${url}
           </p>
           
           
           
           Cordialement
			`,
		});
		/*	if (info) {
			      console.log(info);
		  }*/
		return res.json({
			msg: "Please check your mail and click the verify link",
		});
	} else if (!user) {
		return res.json({
			msg: "This user not exist! ",
		});
	} else {
		return res.json({
			msg: "This user is already here and verified ! Go to the Login page.",
		});
	}
});

// verification de compte
routerAuth.post("/verification/:email", async (req, res) => {
	const email = req.params.email;
	UserModel.findOne(email)
		.then((user) => {
			user.verified = "true";
			user
				.save()
				.then(() => {
					res.send({ msg: "verified" });
				})
				.catch((error) => {
					res.send({ msg: error });
				});
		})
		.catch((err) => {
			res.send({ msg: error });
		});
});

//Edit user profile
routerAuth.post("editUser/:email", async (req, res) => {
	//get params
	const email = req.params.email;
	// find the user profile
	UserModel.findOne({ email })
		.then((user) => {
			user.fullName = req.body.fullName;
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
		})
		.catch((err) => {
			return res.send({ errors: err });
		});
});
//edit password
routerAuth.post("/editPassword/:email", async (req, res) => {
	//get params
	const email = req.params.email;
	// send and hashed the new psw
	const newPsw = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const hashedpassword = await bcrypt.hash(newPsw, salt);

	//  get  the old PSW && Compared to the new

	const similar = await bcrypt.compare(req.body.password, user.password);

	if (!similar) {
		return res.status(400).json("password disabled");
	} else {
		UserModel.find({ email })
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
//Forget Password
routerAuth.post("forgetPassword/:email", async (req, res) => {
	//get params
	const email = req.params.email;
	//hashed the psw
	const salt = await bcrypt.genSalt(10);
	const hashedpassword = await bcrypt.hash(req.body.password, salt);
	req.body.password = hashedpassword;
	// find  and edit the user profile
	UserModel.find(email)
		.then((user) => {
			if (user.resetPsw == true) {
				user
					.save()
					.then(() => {
						return res.send({ msg: "new password  edit with success " });
					})
					.catch((err) => {
						return res.send({ msg: err });
					});
			} else {
				return res.json({
					msg: " Please check your request .",
					link: "http://localhost:3600/api/auth/verifiyResetPsw/${token}",
				});
			}
		})
		.catch((err) => {
			return res.send({ msg: err });
		});
});

// Verifiy  adresse mail
routerAuth.post("/verifiyResetPsw", async (req, res) => {
	const user = await UserModel.findOne({ email: req.body.email });

	if (!user.verified) {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PSW,
			},
		});
		let url = `http://localhost:3600/api/auth/verificationRestPsw/${user.email}`;
		let info = await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: req.body.email,
			subject: "rénitialiser votre mot de passe",
			attachments: [
				{
					filename: "logo.png",
					path: __dirname + "/logo.png",
					cid: "logo@",
				},
			],
			html: `
            <p>
            <h5>Bonjour  ${req.body.fullName} </h5> <br/>
			confirmer pour  rénitialiser votre mot de passe en cliquant ici :${url}
           </p>
        
			`,
		});
		/*	if (info) {
			      console.log(info);
		  }*/
		return res.json({
			msg: "Please check your mail and click the verify link",
		});
	}
});

// verification de reset password
routerAuth.post("/verificationResetPsw/:email", async (req, res) => {
	const email = req.params.email;
	UserModel.findOne(email)
		.then((user) => {
			user.verified = "true";
			user
				.save()
				.then(() => {
					res.send({ msg: "verified" });
				})
				.catch((error) => {
					res.send({ msg: error });
				});
		})
		.catch((err) => {
			res.send({ msg: err });
		});
});

module.exports = routerAuth;
