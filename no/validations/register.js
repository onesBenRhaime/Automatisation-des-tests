const isEmpty = require("./isEmpty");
const validator = require("validator");
//valider register
module.exports = function ValidateRegister(data) {
	let errors = {};
	data.nom = !isEmpty(data.fullName) ? data.fullName : "";
	data.role = !isEmpty(data.role) ? data.role : "";
	data.email = !isEmpty(data.email) ? data.email : "";
	data.password = !isEmpty(data.password) ? data.password : "";

	
	if (!validator.isEmpty(data.fullName)) {
		errors.prenom = "Required name ";
	}
	if (!validator.isEmail(data.email)) {
		errors.email = "Required format  email ";
	}
	if (validator.isEmpty(data.password)) {
		errors.password = "Required password";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
