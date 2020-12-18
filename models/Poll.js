const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
	teacherId: String,
	questions: [
		{
			questionType: String,
			question: String,
			answers: [
				{
					studentId: String,
					answer: String,
				},
			],
		},
	],
	pollTitle: String,
	grade: String,
	doa: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model("polls", PollSchema);
