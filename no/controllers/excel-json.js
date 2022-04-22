const express = require("express");
const routerC = express.Router();
const candidatModel = require("../../backend/models/candidat");
const password = require("secure-random-password");
const reader = require("xlsx");
const file = reader.readFile(
	"D:/PFEBackend/backend/controllers/SessionPFE2022.xlsx"
);

routerC.post("/addcandidat", async (req, res) => {
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
			// Random Password
			password.randomPassword({
				characters: password.lower + password.upper + password.digits,
			});
			//password.randomPassword();
			req.body.password = Math.random().toString(36).slice(-8);
			const candidat = await candidatModel.create(req.body);
			console.log("candidat added : info :");
			console.log(candidat);
		}
		return res.status(201).json("succes");
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});

module.exports = routerC;
