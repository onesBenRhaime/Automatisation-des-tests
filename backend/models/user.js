// model data form shema
const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
	nom: {
		type: String,
		require: true,
	},
	prenom: {
		type: String,
		require: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	role: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		require: true,
	},
	adresse: "string",
	tel: "string",
	bio: "string",
});

module.exports = mongoose.model("users", userModel);
