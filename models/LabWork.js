const mongoose = require("mongoose");

const LabWorkSchema = new mongoose.Schema({
	title: String,
	objectives: String,
	startDate: String,
	endDate: String,
	subjectName: String,
	sectionName: String,
	className: String,
	teacherId: String,
	schoolId: String,
	attend: [
		{
			id: String,
			observation: String,
			remark: String,
			marks: {
				type: Number,
				default: 0,
			},
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model("labworks", LabWorkSchema);
