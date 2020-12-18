const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
	title: String,
	duration: String,
	totalMarks: String,
	questions: {
		type: Array,
		default: [],
	},
	doe: String,
	subjectName: String,
	sectionName: String,
	className: String,
	teacherId: String,
	schoolId: String,
	attend: {
		type: Array,
		default: [],
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model("assignments", AssignmentSchema);
