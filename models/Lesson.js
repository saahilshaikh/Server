const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
	goal: String,
	ldur: String,
	objective: String,
	summary: String,
	skills: String,
	questions: String,
	knowledge: String,
	references: String,
	hw: String,
	feedback: String,
	schoolId: String,
	teacherId: String,
	className: String,
	sectionName: String,
	subjectName: String,
	chapterName: String,
	topicName: String,
	date: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model("lessons", LessonSchema);
