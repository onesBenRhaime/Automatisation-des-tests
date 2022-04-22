const router = require("express").Router();
const { AddCollaborateur, Verifiy } = require("../backend/controllers/adminController");

const passport = require("passport");
const { Login, Test } = require("../backend/controllers/login");
const { ROLES, inRole } = require("../backend/security/Rolemiddleware");

const {
	AddUser,
	FindAllUsers,
	FindSingleUser,
	DeleteUser,
} = require("../backend/controllers/compte");

const {
	AddQuestion,
	DeleteQuestion,
	GetQuestion,
} = require("../backend/controllers/question");

/*Admin  Routes*/
router.post("/addUser", AddUser);
router.post("/register", AddCollaborateur);
router.get("/findAllUsers", FindAllUsers);
router.post("/findSingelUser/:email", FindSingleUser);
router.delete("/deleteUser/:email", DeleteUser);

/* Router Question  */
router.post("/addQuestion", AddQuestion);
router.delete("/deleteQuestion", DeleteQuestion);
router.get("/getQuestion", GetQuestion);

/*Authentification*/
router.post("/login", Login);
router.post("/Verifiy", Verifiy);

/*  Collaborateur Router  */

/****route sécurisée par role *****/
router.get(
	"/test",
	passport.authenticate("jwt", { session: false }),
	inRole(ROLES.ADMIN),
	Test
);

module.exports = router;
