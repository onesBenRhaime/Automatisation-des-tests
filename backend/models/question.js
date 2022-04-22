const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
	tag: {
		type: String,
		required: true,
	},
	titre: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	categorie: {
		type: String,
		required: true,
	},
	niveau: {
		type: String,
		required: true,
	},
	technologie: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		required: true,
		default: 0,
	},
	alternatives: [
		{
			option: {
				type: String,
				required: true,
			},
			isCorrect: {
				type: Boolean,
				required: true,
				default: false,
			},
		},
	],
});

module.exports = mongoose.model("Questions", QuestionSchema);
