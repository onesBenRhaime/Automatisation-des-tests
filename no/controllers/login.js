const UserModel = require("../../backend/models/user");
const ValidateLogin = require("../validations/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Fonction : Login Usser
//si  user exist ===> Token else  return not found /

const Login = async (req, res) => {
	// body errors
	const { errors, isValid } = ValidateLogin(req.body);
	try {
		if (!isValid) {
			res.status(404).json(errors);
		} else {
			UserModel.findOne({ email: req.body.email }).then((user) => {
				if (!user) {
					errors.email = "not found user";
					res.status(404).json(errors);
				} else {
					//compare passwords (body/db)
					bcrypt.compare(req.body.password, user.password).then((match) => {
						// incorrect psw
						if (!match) {
							errors.password = "incorrect password";
							res.status(404).json(errors);
						} else if (req.user.verified == false) {
							res.status(200).json({
								message:
									"Welcome " + user.role + " " + user.nom + " " + user.prenom,
								token: "Token " + token,
							});
						} else {
							//Login Collaborateur && Admin
							//correct psw :  authorization  JSON WEB Token
							var token = jwt.sign(
								{
									//_payload
									id: user._id,
									nom: user.nom,
									prenom: user.prenom,
									email: user.email,
									role: user.role,
								},
								process.env.PRIVATE_KEY,
								{ expiresIn: "8h" } //date d'expération de token
							);

							res.status(200).json({
								message:
									"Welcome " + user.role + " " + user.nom + " " + user.prenom,
								token: "Token " + token,
							});
						}
					});
				}
			});
		}
	} catch (error) {
		res.status(404).json(error.message);
	}
};
// Verifiy  adresse mail
const Verifiy = async (req, res) => {
	const user = await UserModel.findOne({ email: req.body.email });
	console.log(user);
	if (!user.verified) {
		const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY, {
			expiresIn: "10m",
		});
		console.log(token);
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
			console.log(info);
		}
		return res.json({
			msg: "Please check your mail and click the verify link",
		});
	} else if (!user) {
		return res.json({
			msg: "This user not exist! Please Go to the Signup page.",
		});
	} else {
		return res.json({
			msg: "This user is already here! Go to the Login page.",
		});
	}
};
/* Decoded Token  with out passport
const Test = (req, res) => {
	jwt.verify(
		res.sendreq.rawHeaders[1].split("Bearer")[1],
		process.env.PRIVATE_KEY,
		function (err, decoded) {
			res.send(decoded);
		}
	);
}; */

const Test = (req, res) => {
	res.send("Welcome collaborateur");
};

const Admin = (req, res) => {
	res.send("Welcome Admin");
};
module.exports = {
	Login,
	Test,
	Admin,
	Verifiy,
};
