const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
	file: Object,
	resourceName: String,
	topicName: String,
	subjectName: String,
	chapterName: String,
	className: String,
	code: String,
	date: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model("iigp_resources", ResourceSchema);
