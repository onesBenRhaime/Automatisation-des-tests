const QuestionModel = require("../models/question");

//Function :Add question
const AddQuestion = async (req, res) => {
	const question = await QuestionModel.findOne({ idQ: req.body.idQ });
	if (!question) {
		const result = await QuestionModel.create(req.body);
		return res.json({
			msg: result,
		});
	} else {
		return res.json({
			msg: "This  question already here!",
		});
	}
};
//Function :Add question
const DeleteQuestion = async (req, res) => {
	await QuestionModel.findOneAndDelete({ idQ: req.body.idQ })
		.then(() => {
			return res.send({ message: "deleted" });
		})
		.catch((err) => {
			return res.send({ message: err.message });
		});
};
//Function :Add question
const GetQuestion = async (req, res) => {
	const question = await QuestionModel.findOne({ idQ: req.body.idQ });
};

//Export Methodes
module.exports = {
	AddQuestion,
	DeleteQuestion,
	GetQuestion,
};
