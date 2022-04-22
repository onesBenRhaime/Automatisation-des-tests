// model data form shema
const mongoose = require("mongoose");

const candidatModel = new mongoose.Schema({
	nom: {
		type: String,
		require: true,
	},
	prenom: {
		type: String,
		require: true,
	},
	adresse: {
		type: String,
		require: false,
	},
	tel: {
		type: String,
		require: true,
	},
	profil: {
		type: String,
		required: true,
	},
	cv: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		//unique: true,
		trim: true,
	},
	password: {
		type: String,
		require: false,
	},
});

module.exports = mongoose.model("candidats", candidatModel);
