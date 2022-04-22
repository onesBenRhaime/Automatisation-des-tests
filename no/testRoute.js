const express = require("express");
const routerT = express.Router();
const Test = require("../backend/models/test"); // includes our model Test

// create one Test
routerT.post("/addTest", async (req, res) => {
	try {
		const { domaine } = req.body;
		const { catégorie } = req.body;
		const { technologies } = req.body;
		const { nbQuestion } = req.body;
		const { niveau } = req.body;
		const { date } = req.body;
		const { time } = req.body;
		const { dure } = req.body;

		const test = await Test.create({
			domaine,
			catégorie,
			technologies,
			nbQuestion,
			niveau,
			date,
			time,
			dure,
		});
		console.log(test);
		return res.status(201).json(test);
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});

// Get all  Test
routerT.post("/getTest", async (req, res) => {
	try {
		const test = await Test.find();
		return res.status(201).json(test);
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});
// Delete one test
routerT.delete("/deleteTest/:id", async (req, res) => {
	try {
		const _id = req.params.id;
		const test = await Test.deleteOne({ _id });

		if (test.deletedCount === 0) {
			return res.json({
				msg: " test not found ! ",
			});
		} else {
			return res.json({
				msg: " test deleted! ",
			});
		}
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});
module.exports = routerT;
