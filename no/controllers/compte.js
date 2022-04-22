const UserModel = require("../../backend/models/user");
const ValidateRegister = require("../validations/register");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Add  New Collaborateur
const AddUser = async (req, res) => {
	const { errors, isValid } = ValidateRegister(req.body);
	try {
		if (!isValid) {
			res.status(404).json(errors);
		} else {
			// test  if existe  email or not
			const user = await UserModel.findOne({ email: req.body.email });
			if (!user) {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(req.body.password, salt).then(async (hash) => {
						req.body.password = hash;
						req.body.role = "Collaborateur ";
						const result = await UserModel.create(req.body);
						console.log("user added ");

						const token = jwt.sign(
							{ id: result._id },
							process.env.PRIVATE_KEY,
							{
								expiresIn: "8h",
							}
						);
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
							subject: "Verify your email -Orange Test-",
							attachments: [
								{
									filename: "logo.png",
									path: __dirname + "/logo.png",
									cid: "logo@",
								},
							],
							html: `
						<div style="height: 50% ;width: 80%;background-color: #d8d8d8;">

                         <div style=" background-color: #010101; font-family: Arial, Helvetica "> 
                          <img alt="logo ODC" height="70"src="cid:logo@" alt="Orange" style="margin-left: 20;" >
                          <h1 style="margin-left: 90; color: #ffffff;">Orange Digital Centre </h1>
                         </div>
                         <hr>
                         <p><b> Bonjour ${req.body.nom} ${req.body.prenom} ,</br> Merci d’avoir créé un compte sur Orange Test , Pour pouvoir accéder à notre site web,veuillez confirmer votre adresse e-mail en cliquant sur le boutton suivant:</b> </p>
                        <a href="http://localhost:3600/api/verify/${token}"> <input type="submit" value="Connection" style="width: 20%;padding: 10px; margin-left:200px;background-color: #E67E22;color:white;"></a>
                        <p><b>Passé ce délai, vous devrez recommencer la procédure de création de compte.</b> </p></br>
                        </div> 
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
					msg: "This user is already here! Go to the login page. Otherwise try another email.",
				});
			}
		} //EndIF
	} catch (error) {
		res.status(404).json(error.message);
	}
};
// get all collaborateur
const FindAllUsers = async (req, res) => {
	try {
		const data = await UserModel.find();
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};
// get one collaborateur
const FindSingleUser = async (req, res) => {
	try {
		const data = await UserModel.findOne({ email: req.body.email });
		if (!data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({ msg: "user not found " });
		}
	} catch (error) {
		res.status(404).json({ error: error });
	}
};
// delete one collaborateur
const DeleteUser = async (req, res) => {
	try {
		const data = await UserModel.findOneAndDelete({ email: req.body.email });

		if (!data) {
			res.status(200).json({ message: "deleted" });
		} else {
			res.status(404).json({ msg: "user not found " });
		}
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

// Send Mail to  one collaborateur
const SendMailToUser = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

//Export Methodes
module.exports = {
	AddUser,
	FindAllUsers,
	FindSingleUser,
	DeleteUser,
	SendMailToUser,
};
