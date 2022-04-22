const express = require("express");
const router = express.Router();
const questionModel = require("../models/question");

// includes our model Question

/*************  CRUD QUESTION  *************/
// create  question
router.post("/addQuestion", async (req, res) => {
	try {
		console.log(req.body);
		const question = await questionModel.findOne({ tag: req.body.tag });
		console.log(question);
		if (!question) {
			const question = await questionModel.create(req.body);
			return res.status(200).json({
				msg: "success",
				question,
			});
		} else {
			return res.status(201).json(" Exist ");
		}
	} catch (errors) {
		return res.status(500).json({ message: errors.message });
	}
});

// get all quiz questions : Done
router.get("/allQuestions", async (req, res) => {
	try {
		const questions = await questionModel.find();
		return res.status(200).json({
			msg: "success",
			questions,
		});
	} catch (errors) {
		return res.status(500).json({ message: errors.message });
	}
});
// get one   question
router.get("/getQuestion/:tag", async (req, res) => {
	try {
		const question = await questionModel.findOne({ tag: req.body.tag });
		console.log(question);
		if (!question) {
			return res.json({
				msg: "  not found ! ",
			});
		} else {
			return res.status(200).json(question);
		}
	} catch (error) {
		return res.status(500).json({ msg: "error" });
	}
});

// update one   question
router.delete("/updateQuestion/:id", async (req, res) => {
	try {
		const _id = req.params.id;

		let question = await questionModel.findOne({ _id });

		if (!question) {
			return res.status(201).json({ error: "not found " });
		} else {
			req.body = question;
			await question.save();
			return res.status(200).json(question);
		}
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});
// Delete one  question

router.delete("/deleteQuestion/:tag", async (req, res) => {
	const tag = req.params.tag;
	try {
		const question = await questionModel.findOneAndDelete({ tag: tag });
		console.log(question);
		if (!question) {
			question = await Question.deleteOne(question);
			return res.status(201).json("deleted");
		} else {
			return res.status(200).json("not found");
		}
	} catch (error) {
		return res.status(500).json({ msg: "error" });
	}
});

module.exports = router;
