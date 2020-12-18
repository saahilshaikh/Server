const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
	teacherId: String,
	title: String,
	grade: String,
	type: String,
	studentId: String,
	doa: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model("announcements", AnnouncementSchema);
