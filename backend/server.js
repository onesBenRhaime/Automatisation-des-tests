const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const file = require("./routes/session/file");
const user = require("./routes/user");
const question = require("./routes/question");
const candidat = require("./routes/candidat");
const collaborateur = require("./routes/collaborateur");
const uploadFile = require("./routes/session/file");
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to db
mongoose
	.connect(process.env.DB_CONX, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());
app.use("/api/user", file);
app.use("/api/user", user);

app.use("/api/candidat", candidat);
app.use("/api/admin", question);
app.use("/api/admin", collaborateur);
app.use("/upload", uploadFile);

app.listen(process.env.PORT, () => {
	console.log(" Good Nosnos, backend server is runing!!!");
});
