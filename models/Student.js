const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
	photo: {
		type: Object,
		default: {},
	},
	name: {
		type: String,
	},
	pname: {
		type: String,
	},
	pcontact: {
		type: String,
	},
	pemail: {
		type: String,
	},
	contact: {
		type: String,
	},
	address: {
		type: String,
	},
	dob: {
		type: String,
	},
	blood: {
		type: String,
	},
	class: {
		type: String,
	},
	section: {
		type: String,
	},
	email: {
		type: String,
	},
	city: {
		type: String,
	},
	state: {
		type: String,
	},
	zip: {
		type: String,
	},
	school_id: {
		type: String,
	},
	status: {
		type: Boolean,
		default: true,
	},
	practices: {
		type: Array,
		default: [],
	},
	behaviour: [
		{
			className: String,
			sectionName: String,
			subjectName: String,
			status: Array,
			teacherId: String,
			note: String,
			date: String,
		},
	],
	creativity: [
		{
			className: String,
			sectionName: String,
			subjectName: String,
			status: Array,
			teacherId: String,
			note: String,
			date: String,
		},
	],
	entrepreneurship: [
		{
			className: String,
			sectionName: String,
			subjectName: String,
			status: Array,
			teacherId: String,
			note: String,
			date: String,
		},
	],
	problemSolving: [
		{
			className: String,
			sectionName: String,
			subjectName: String,
			status: Array,
			teacherId: String,
			note: String,
			date: String,
		},
	],
	assignments: {
		type: Array,
		default: [],
	},
	attendance: [
		{
			className: String,
			sectionName: String,
			subjectName: String,
			status: String,
			teacherId: String,
			date: String,
		},
	],
	positivePoints: {
		type: Number,
		default: 0,
	},
	negativePoints: {
		type: Number,
		default: 0,
	},
	doa: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model("students", StudentSchema);
