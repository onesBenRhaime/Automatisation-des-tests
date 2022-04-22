// model data form shema
const mongoose = require("mongoose");

const testModel = new mongoose.Schema({
	domaine: {
		options: ["Développement Web ", "Développement Mobile", "web design "],
	},
	categorie: [{ options: ["Backend", " Frontend"] }],
	technologies: {
		type: String,
		required: true,
	},
	nbQuestion: {
		type: Number,
		require: true,
	},
	niveau: { options: ["moyen", "avancer", "concept de base"] },
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: Date,
		required: true,
	},
	dure: {
		type: Date,
		required: true,
	},
});

module.exports = mongoose.model("Tests", testModel);
