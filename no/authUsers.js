const user = require("../backend/models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mailer = require("../controllers/mailler");
const UserModel = require("../backend/models/user");
//REGISTER
router.post("/register", async (req, res) => {
	try {
		//generate new password
		/*const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);*/

		await UserModel.create(req.body);
		res.status(200).json({ message: "success" });
		//res.status(200).json("New user saved ", userN._id);
	} catch (err) {
		console.log("problem ");
		res.status(500).json("err");
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		//find user
		const userI = await user.findOne({ email: req.body.email });
		!userI && res.status(400).json("nom d'utilisateur incorrect");

		//validate password
		const validPassword = await bcrypt.compare(
			req.body.password,
			userI.password
		);
		!validPassword && res.status(400).json("mot de passe incorrect");

		//send response
		res.status(200).json("Welcome ", { _id: userI._id, email: userI.email });
	} catch (err) {
		res.status(500).json("err");
	}
});

//SendEmail
router.post("/sendEmail", async (req, res) => {
	await mailer();
	res.send("work");
});
module.exports = router;
