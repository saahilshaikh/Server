const mongoose = require("mongoose");

const HomeworkSchema = new mongoose.Schema({
	title: String,
	duration: String,
	questions: {
		type: Array,
		default: [],
	},
	startDate: String,
	endDate: String,
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

mongoose.model("homeworks", HomeworkSchema);
