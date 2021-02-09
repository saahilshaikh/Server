const requireLogin = require("../middlewares/requireLogin");
const requireStudent = require("../middlewares/requireStudent");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { response } = require("express");

const Student = mongoose.model("students");
const Class = mongoose.model("iigp_classes");
const Practice = mongoose.model("iigp_practices");
const Users = mongoose.model("users");
const PracticeResult = mongoose.model("practice_results");
const Polls = mongoose.model("polls");
const Teacher = mongoose.model("teachers");
const Announcements = mongoose.model("announcements");
const Calendar = mongoose.model("calendar");
const Discussion = mongoose.model("discussions");
const School = mongoose.model("schools");
const Assignments = mongoose.model("assignments");
const Labs = mongoose.model("labworks");
const Exams = mongoose.model("exams");
const ExamResult = mongoose.model("exam_results");

module.exports = (app) => {
	app.post("/api/student/profile", requireLogin, requireStudent, async (req, res) => {
		const { studentId } = req.body;
		Student.findOne({ _id: studentId }).then(async (student) => {
			if (student) {
				// var practices = [];
				var classInfo = await Class.findOne({ className: student.class }).exec();
				// student.practices.map(async(item) => {
				//     var practiceInfo = await PracticeResult.findOne({_id:item}).exec();
				//     practices.push(practiceInfo)
				// })

				var exams = await Exams.find({schoolId: student.school_id, className : student.class, sectionName: student.section}).exec();
				var labs = await Labs.find({ schoolId: student.school_id }).exec();
				var calendarEvents = await Calendar.find({ grade: student.class, schoolId: student.school_id, audience: "students" }).exec();
				var announcements = await Announcements.find({ grade: student.class }).exec();
				var polls = await Polls.find({ grade: student.class }).exec();
				var discussions = await Discussion.find({
					schoolId: student.school_id,
					audience: "students",
					grade: student.class,
					section: student.section,
				}).exec();
				var assignments = await Assignments.find({
					schoolId: student.school_id,
					className: student.class,
					sectionName: student.section,
				}).exec();
				var stud = {
					_id: student._id,
					photo: student.photo,
					name: student.name,
					email: student.email,
					pname: student.pname,
					pcontact: student.pcontact,
					pemail: student.pemail,
					address: student.address,
					contact: student.contact,
					dob: student.dob,
					class: student.class,
					section: student.section,
					city: student.city,
					state: student.state,
					zip: student.zip,
					blood: student.blood,
					school_id: student.school_id,
					doa: student.doa,
					practices: student.practices,
					classInfo: classInfo,
					participation: student.participation,
					behaviour: student.behaviour,
					assignments: student.assignments,
					attendance: student.attendance,
					creativity: student.creativity,
					entrepreneurship: student.entrepreneurship,
					problemSolving: student.problemSolving,
					negativePoints: student.negativePoints,
					positivePoints: student.positivePoints,
					discussions: discussions,
					announcements: announcements,
					polls: polls,
					calendarEvents: calendarEvents,
					assignments: assignments,
					labs: labs,
					exams : exams
				};
				res.send(stud);
			} else {
				res.send({ error: "No student Found", type: "error" });
			}
		});
	});

	app.post("/api/iigp/getChapter", async (req, res) => {
		const { grade } = req.body;
		Class.findOne({ className: grade }).then((response) => {
			if (response) {
				res.send(response);
				console.log(response);
			} else {
				res.send({ error: "No class found", type: "error" });
			}
		});
	});

	app.post("/api/iigp/getPractice", async (req, res) => {
		const { practiceId } = req.body;
		Practice.findOne({ _id: practiceId }).then((response) => {
			if (response) {
				res.send(response);
			} else {
				console.log("Error");
			}
		});
	});

	// Saving practice

	app.post("/api/practice/saveresult", async (req, res) => {
		const { practiceId, topic, chapter, subject, studentId, duration, score, correct, wrong, level1, level2, level3, level4, level5 } = req.body;

		new PracticeResult({
			practiceId: practiceId,
			topic: topic,
			chapter: chapter,
			subject: subject,
			studentId: studentId,
			duration: duration,
			score: score,
			correct: correct,
			wrong: wrong,
			level1: level1,
			level2: level2,
			level3: level3,
			level4: level4,
			level5: level5,
		})
			.save()
			.then((r) => {
				if (r) {
					Student.findOne({ _id: studentId })
						.then((student) => {
							if (student) {
								var practices = student.practices;
								practices.push(r._id);
								student.practices = practices;
								student
									.save()
									.then((re) => {
										if (re) {
											res.send({ success: "Result saved", type: "success" });
										} else {
											res.send({ error: "Error in saving result to student", type: "error" });
										}
									})
									.catch(() => {
										res.send({ error: "Error in saving result", type: "error" });
									});
								return null;
							} else {
								res.send({ error: "Error student not found", type: "error" });
							}
						})
						.catch(() => {
							res.send({ error: "Student not saving error", type: "error" });
						});
					return null;
				} else {
					res.send({ error: "Error in saving result", type: "error" });
				}
			});
	});

	// Register student for exam attempt
	app.post("/api/exam/storeAttempt", requireLogin, requireStudent, async (req, res) => {
		const {studentId, examId} = req.body;
		Exams.findOne({_id : examId})
		.then((result) => {
			if (result) {
				var arr = result.attend;
				arr.push(studentId);
				result.attend = arr;
				result.save()
				.then((re) => {
					if (re) {
						res.send({type : "success"});
					}
					else {
						res.send({type : "error"});
					}
				})
			}
		})
	})

	//Saving exam

	app.post("/api/exam/saveExam", requireLogin, requireStudent, async (req,res) => {
		const {studentId ,examId,schoolId,questions,title,marks,correct,wrong,subject} = req.body;

		new ExamResult({
			studentId : studentId,
			examId : examId,
			schoolId : schoolId,
			questions: questions,
			title : title,
			marks:marks,
			correct: correct,
			wrong: wrong,
			subject:subject,
		})
		.save()
		.then((re) => {
			if (re) {
				res.send({ success: "Result saved", type: "success" });
			}
			else {
				res.send({ success: "Result not saved", type: "error" });
			}
		})
	})
	

	// GET ANALYTICAL REPORTS

	app.post("/api/analytics/getLastTen", requireLogin, requireStudent, async (req, res) => {
		const { studentId } = req.body;
		PracticeResult.find({ studentId: studentId })
			.sort({ date: "desc" })
			.limit(10)
			.then((result) => {
				if (result) {
					res.send(result);
				}
			});
	});

	app.post("/api/analytics/subject", requireLogin, requireStudent, async (req, res) => {
		const { studentId, subject } = req.body;
		PracticeResult.find({ studentId: studentId, subject: new RegExp(subject, "i") }).then((result) => {
			if (result.length > 0) {
				res.send({ data: result.reverse(), type: "success" });
			} else {
				res.send({ error: "Not Found", type: "error" });
			}
		});
	});

	// GET ALL EXAM RESULT FOR GRADEBOOK

	app.post("/api/gradebook/exam", requireLogin, requireStudent, async(req, res) => {
		const {studentId} = req.body;
		ExamResult.find({studentId : studentId})
		.then((result) => {
			if (result && result.length > 0) {
				res.send({data: result, type : "success"});
			}
			else {
				res.send({ error: "Not Found", type: "error" });
			}
		})
	})

	// GET EXAM ANALYTICAL REPORT
	app.post("/api/examAnalytics/getLastTen", requireLogin, requireStudent, async (req, res) => {
		const { studentId } = req.body;
		ExamResult.find({ studentId: studentId })
			.sort({ date: "desc" })
			.limit(10)
			.then((result) => {
				if (result) {
					res.send(result);
				}
			});
	});

	app.post("/api/examAnalytics/subject", requireLogin, requireStudent, async (req, res) => {
		const { studentId, subject } = req.body;
		ExamResult.find({ studentId: studentId, subject: new RegExp(subject, "i") }).then((result) => {
			if (result.length > 0) {
				res.send({ data: result.reverse(), type: "success" });
			} else {
				res.send({ error: "Not Found", type: "error" });
			}
		});
	});


	// STUDENT SCHOOL API

	app.post("/api/myschool/getTeacher", requireLogin, requireStudent, async (req, res) => {
		const { teacherId } = req.body;
		Teacher.findOne({ _id: teacherId }).then((result) => {
			res.send({ result });
		});
	});

	// Polls

	app.post("/api/myschool/getPolls", requireLogin, requireStudent, async (req, res) => {
		const { grade } = req.body;
		Polls.find({ grade: grade }).then((result) => {
			res.send(result);
		});
	});

	app.post("/api/myschool/submitPoll", requireLogin, requireStudent, async (req, res) => {
		const { pollId, questions } = req.body;
		Polls.findOne({ _id: pollId }).then((poll) => {
			poll.questions = questions;
			poll.save().then((r) => {
				res.send({ type: "success" });
			});
		});
	});

	// Calendar
	app.post("/api/myschool/calendarEvents", requireLogin, requireStudent, async (req, res) => {
		const { grade, schoolId } = req.body;
		Calendar.find({ grade: grade, schoolId: schoolId, audience: "students" }).then((result) => {
			res.send(result);
		});
	});

	// Get other user profile

	app.post("/api/myschool/getOtherUser", requireLogin, requireStudent, async (req, res) => {
		const { id, role } = req.body;
		if (role === "teacher") {
			Teacher.findOne({ _id: id }).then((teacher) => {
				res.send(teacher);
			});
		}
	});

	// ADD MESSAGE IN FORUM

	app.post("/api/myschool/mydiscussion/addMessage", requireLogin, requireStudent, async (req, res) => {
		const { userId, userRole, message, id } = req.body;

		Discussion.findOne({ _id: id }).then((result) => {
			if (result) {
				var newChats = result.chats;

				// Create chat object
				var chatObj = {};
				chatObj.message = message;
				chatObj.userId = userId;
				chatObj.userRole = userRole;
				chatObj.reply = [];

				// push in new chat array
				newChats.push(chatObj);

				// store in database chats
				result.chats = newChats;

				result.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, chat sent" });
					} else {
						res.send({ type: "error", error: "chat not" });
					}
				});
			} else {
				res.send({ type: "error", error: "not found" });
			}
		});
	});

	// ADD REPLY TO A MESSAGE IN FORUM

	app.post("/api/myschool/mydiscussion/addReply", requireLogin, requireStudent, async (req, res) => {
		const { reply, userId, userRole, msgId, discId } = req.body;

		Discussion.findOne({ _id: discId }).then((result) => {
			if (result) {
				result.chats.map((item) => {
					if (item._id.toString() === msgId.toString()) {
						var newReply = item.reply;

						var replyObj = {};
						replyObj.reply = reply;
						replyObj.userId = userId;
						replyObj.userRole = userRole;

						newReply.push(replyObj);

						item.reply = newReply;
						result.save().then((re) => {
							if (re) {
								res.send({ type: "success", success: "Yahoo, reply sent" });
							} else {
								res.send({ type: "error", error: "reply not sent" });
							}
						});
					}
				});
			} else {
				res.send({ type: "error", error: "not found" });
			}
		});
	});

	// Seating chart

	app.post("/api/getSeatChart", requireLogin, requireStudent, async (req, res) => {
		const { schoolId, grade, section, subject } = req.body;

		School.findOne({ _id: schoolId }).then((school) => {
			if (school) {
				school.classes.length > 1 &&
					school.classes.map((item) => {
						if (item.name === grade) {
							item.sections.map((sec) => {
								if (sec.name === section) {
									sec.subjects.map((sub) => {
										if (sub.name === subject) {
											res.send(sub.layout);
										}
									});
								}
							});
						}
					});
			}
		});
	});
};
