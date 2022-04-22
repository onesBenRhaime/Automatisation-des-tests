/* selon roles  passe ou non  */
const ROLES = {
	COLLABORATEUR: "collaborateur",
	ADMIN: "admin",
	CANDIDAT: "candidat",
};

const inRole =
	(...roles) =>
	(req, res, next) => {
		// req.user.role ===> Passport
		const role = roles.find((role) => req.user.role === role);
		if (!role) {
			return res.status(401).json({ message: "no access" });
		}
		next();
	};

module.exports = {
	inRole,
	ROLES,
};
