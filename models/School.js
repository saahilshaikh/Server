const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
	logo: {
		type: Object,
		default: {},
	},
	name: {
		type: String,
	},
	branch: {
		type: String,
	},
	address: {
		type: String,
	},
	email: {
		type: String,
	},
	contact: {
		type: String,
	},
	fax: {
		type: String,
	},
	website: {
		type: String,
	},
	teachers: {
		type: Array,
		default: [],
	},
	students: {
		type: Array,
		default: [],
	},
	administrators: {
		type: Array,
		default: [],
	},
	principal: {
		type: Array,
		default: [],
	},
	districtOfficers: {
		type: Array,
		default: [],
	},
	classes: [
		{
			cycle: String,
			name: String,
			sections: [
				{
					name: String,
					subjects: [
						{
							layout: {
								type: Array,
								default: [],
							},
							exams: {
								type: Array,
								default: [],
							},
							lessons: {
								type: Array,
								default: [],
							},
							resources: [
								{
									file: Object,
									chapterName: String,
									topicName: String,
									resourceName: String,
									date: {
										type: Date,
										default: Date.now,
									},
									status: {
										type: Boolean,
										default: false,
									},
								},
							],
							assignments: {
								type: Array,
								default: [],
							},
							name: String,
							startTime: String,
							endTime: String,
							lab: {
								type: Boolean,
								default: false
							}
						},
					],
				},
			],
			doa: Date,
		},
	],
	status: {
		type: Boolean,
		default: true,
	},
	doa: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model("schools", SchoolSchema);
