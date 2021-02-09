const requireLogin = require("../middlewares/requireLogin");
const requireTeacher = require("../middlewares/requireTeacher");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Student = mongoose.model("students");
const Class = mongoose.model("iigp_classes");
const Practice = mongoose.model("iigp_practices");
const Users = mongoose.model("users");
const Teacher = mongoose.model("teachers");
const School = mongoose.model("schools");
const Lesson = mongoose.model("lessons");
const Exam = mongoose.model("exams");
const QuestionBank = mongoose.model("questionBank");
const Homework = mongoose.model("homeworks");
const Assignment = mongoose.model("assignments");
const LabWork = mongoose.model("labworks");
const PracticeResult = mongoose.model("practice_results");
const Poll = mongoose.model("polls");
const Announcement = mongoose.model("announcements");
const Calendar = mongoose.model("calendar");
const Discussion = mongoose.model("discussions");
const Resource = mongoose.model("iigp_resources");

module.exports = (app) => {
	//PROFILE DATA
	app.post("/api/teacher/profile", requireLogin, requireTeacher, async (req, res) => {
		const { id } = req.body;
		Teacher.findOne({ _id: id }).then(async (teacher) => {
			if (teacher) {
				var discussions = await Discussion.find({ $or: [{ ownerId: id }, { schoolId: teacher.school_id, audience: "faculty" }] }).exec();
				var polls = await Poll.find({ teacherId: id }).exec();
				var announcements = await Announcement.find({ teacherId: id }).exec();
				var calendar = await Calendar.find({ schoolId: teacher.school_id }).exec();
				var school = await School.findOne({
					_id: teacher.school_id,
				}).exec();
				var studentList = school.students;
				var students = [];
				var classes = [];
				teacher.subjects.map((sub) => {
					if (!classes.includes(sub.class)) {
						classes.push(sub.class);
					}
				});
				for (var i = 0; i < studentList.length; i++) {
					var student = await Student.findOne({
						_id: studentList[i].id,
					}).exec();
					console.log(student);
					if (classes.includes(student.class)) {
						students.push(student);
					}
				}
				var lessons = await Lesson.find({ schoolId: teacher.school_id, teacherId: teacher._id }).exec();
				var exams = await Exam.find({ schoolId: teacher.school_id, teacherId: teacher._id }).exec();
				var questionBank = await QuestionBank.find({ schoolId: teacher.school_id, teacherId: teacher._id }).exec();
				var homeworks = await Homework.find({ schoolId: teacher.school_id, teacherId: teacher._id }).exec();
				var assignments = await Assignment.find({ schoolId: teacher.school_id, teacherId: teacher._id }).exec();
				var labworks = await LabWork.find({ schoolId: teacher.school_id, teacherId: teacher._id }).exec();
				var resources = await Resource.find().exec();
				var teacherInfo = {
					address: teacher.address,
					city: teacher.city,
					contact: teacher.contact,
					doa: teacher.doa,
					dob: teacher.dob,
					email: teacher.email,
					experience: teacher.experience,
					name: teacher.name,
					photo: teacher.photo,
					qualification: teacher.qualification,
					school_id: teacher.school_id,
					state: teacher.state,
					status: teacher.status,
					subjects: teacher.subjects,
					zip: teacher.zip,
					_id: teacher._id,
					students: students,
					schoolInfo: school,
					lessons: lessons,
					exams: exams,
					questionBank: questionBank,
					homeworks: homeworks,
					assignments: assignments,
					labworks: labworks,
					todo: teacher.todo,
					announcements: announcements,
					calendar: calendar,
					polls: polls,
					discussions: discussions,
					resources: resources,
				};
				res.send(teacherInfo);
			} else {
				res.send({ error: "No teacher Found", type: "error" });
			}
		});
	});

	//EDIT PROFILE

	app.post("/api/teacher/editProfile", requireLogin, async (req, res) => {
		const { id, name, photo, address, dob, contact, qualification, experience, city, state, zip } = req.body;
		Teacher.findOne({ _id: id }).then((teacher) => {
			if (teacher) {
				teacher.photo = photo;
				teacher.name = name;
				teacher.address = address;
				teacher.contact = contact;
				teacher.dob = dob;
				teacher.qualification = qualification;
				teacher.experience = experience;
				teacher.city = city;
				teacher.state = state;
				teacher.zip = zip;
				teacher.save().then((response) => {
					if (response) {
						res.send({ success: "Info Updated", type: "success" });
					}
				});
			} else {
				res.send({ error: "Error Updating Info!", type: "error" });
			}
		});
	});

	//EDIT PASSWORD
	app.post("/api/teacher/editPassword", requireLogin, async (req, res) => {
		const { email, password } = req.body;
		console.log(email);
		const newpassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
		Users.findOne({ email: email }).then((user) => {
			if (user) {
				user.password = newpassword;
				user.save().then((resp) => {
					res.send({ success: "Password Updated", type: "success" });
				});
			} else {
				res.send({ error: "Error Changing Password!", type: "error" });
			}
		});
	});

	//STUDENT BEHAVIOUR
	app.post("/api/teacher/addBehaviour", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note, date, type, push } = req.body;
		console.log(status);
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var behaviours = student.behaviour;
				var behaviour = {
					className: className,
					sectionName: sectionName,
					subjectName: subjectName,
					status: status,
					teacherId: teacherId,
					note: "",
					date: date,
				};
				behaviours.map((behave, index) => {
					if (behave.teacherId === teacherId && behave.sectionName === sectionName && behave.className === className && behave.subjectName === subjectName && behave.date === date) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					behaviours[pos].status = status;
					if (push) {
						if (type === "Positive") {
							student.positivePoints = student.positivePoints + 1;
						} else {
							student.negativePoints = student.negativePoints + 1;
						}
					} else {
						if (type === "Positive") {
							student.positivePoints = student.positivePoints - 1;
						} else {
							student.negativePoints = student.negativePoints - 1;
						}
					}
				} else {
					behaviours.push(behaviour);
					if (push) {
						if (type === "Positive") {
							student.positivePoints = student.positivePoints + 1;
						} else {
							student.negativePoints = student.negativePoints + 1;
						}
					} else {
						if (type === "Positive") {
							student.positivePoints = student.positivePoints - 1;
						} else {
							student.negativePoints = student.negativePoints - 1;
						}
					}
				}
				student.behaviour = behaviours;
				console.log(student.behaviour);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Behaviour" });
					} else {
						res.send({ type: "error", error: "Could not update behaviour" });
					}
				});
			}
		});
	});

	app.post("/api/teacher/addBehaviourNote", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note } = req.body;
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var behaviours = student.behaviour;
				behaviours.map((behave, index) => {
					if (behave.teacherId === teacherId && behave.sectionName === sectionName && behave.className === className && behave.subjectName === subjectName) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					behaviours[pos].status = status;
					behaviours[pos].note = note;
				}
				student.behaviour = behaviours;
				console.log(student.behaviour);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Behaviour" });
					} else {
						res.send({ type: "error", error: "Could not update behaviour" });
					}
				});
			}
		});
	});

	//Attendance
	app.post("/api/teacher/addAttendance", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, date } = req.body;
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var attendances = student.attendance;
				var attendance = {
					className: className,
					sectionName: sectionName,
					subjectName: subjectName,
					status: status,
					teacherId: teacherId,
					date: date,
				};
				attendances.map((attend, index) => {
					if (attend.teacherId === teacherId && attend.sectionName === sectionName && attend.className === className && attend.subjectName === subjectName && attend.date === date) {
						found = true;
						pos = index;
						console.log("Found");
					}
				});
				if (found) {
					attendances[pos].status = status;
					attendances[pos].date = date;
					if (status === "Present") {
						student.positivePoints = student.positivePoints + 1;
						student.negativePoints = student.negativePoints - 1;
					} else {
						student.positivePoints = student.positivePoints - 1;
						student.negativePoints = student.negativePoints + 1;
					}
				} else {
					attendances.push(attendance);
					if (status === "Present") {
						student.positivePoints = student.positivePoints + 1;
					} else {
						student.negativePoints = student.negativePoints + 1;
					}
				}
				student.attendance = attendances;
				console.log(student.attendance);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Behaviour" });
					} else {
						res.send({ type: "error", error: "Could not update behaviour" });
					}
				});
			}
		});
	});

	//add lesson plan
	app.post("/api/teacher/addLessonPlan", requireLogin, requireTeacher, async (req, res) => {
		const { goal, ldur, objective, summary, skills, questions, knowledge, references, hw, feedback, schoolId, teacherId, className, sectionName, subjectName, chapterName, topicName } = req.body;

		new Lesson({
			goal: goal,
			ldur: ldur,
			objective: objective,
			summary: summary,
			skills: skills,
			questions: questions,
			knowledge: knowledge,
			references: references,
			hw: hw,
			feedback: feedback,
			schoolId: schoolId,
			teacherId: teacherId,
			className: className,
			sectionName: sectionName,
			subjectName: subjectName,
			chapterName: chapterName,
			topicName: topicName,
		})
			.save()
			.then((r) => {
				if (r) {
					School.findOne({ _id: schoolId }).then((school) => {
						if (school) {
							console.log(school);
							classes = school.classes;
							classes.map((c) => {
								if (c.name === className) {
									c.sections.map((s) => {
										if (s.name === sectionName) {
											s.subjects.map((sub) => {
												if (sub.name === subjectName) {
													sub.lessons.push(r.id);
												}
											});
										}
									});
								}
							});
							school.classes = classes;
							school.save().then((re) => {
								if (re) {
									res.send({ type: "success", success: "Yahoo, Updated Lesson Plan" });
								} else {
									res.send({ type: "error", error: "Could not update behaviour" });
								}
							});
						}
					});
				}
			});
	});

	//Exam

	app.post("/api/teacher/addExam", requireLogin, requireTeacher, async (req, res) => {
		const { schoolId, teacherId, className, sectionName, subjectName, title, duration, startDate, endDate } = req.body;
		console.log(req.body);
		new Exam({
			schoolId: schoolId,
			teacherId: teacherId,
			className: className,
			sectionName: sectionName,
			subjectName: subjectName,
			title: title,
			duration: duration,
			startDate: startDate,
			endDate: endDate,
		})
			.save()
			.then((re) => {
				if (re) {
					res.send({ type: "success", success: "Yahoo, Updated Exam" });
					new QuestionBank({
						examId: re._id,
						schoolId: schoolId,
						teacherId: teacherId,
						className: className,
						sectionName: sectionName,
						subjectName: subjectName,
						title: title,
					}).save();
				} else {
					res.send({ type: "error", error: "Could not exam" });
				}
			});
	});

	app.post("/api/teacher/updateExam", requireLogin, requireTeacher, async (req, res) => {
		const { id, questions } = req.body;
		Exam.findOne({
			_id: id,
		})
			.then((exam) => {
				if (exam) {
					exam.questions = questions;
					exam.save().then((re) => {
						if (re) {
							res.send({ type: "success", success: "Yahoo, Updated Exam" });
							QuestionBank.findOne({ examId: id }).then((bank) => {
								if (bank) {
									bank.questions = questions;
									bank.save();
								}
							});
						} else {
							res.send({ type: "error", error: "Could not exam" });
						}
					});
				} else {
					res.send({ type: "error", error: "Could not exam" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not exam" });
			});
	});

	app.post("/api/teacher/deleteExam", requireLogin, requireTeacher, async (req, res) => {
		const { examId } = req.body;
		Exam.findByIdAndDelete({ _id: examId })
			.then((response) => {
				if (response) {
					res.send({ type: "success", success: "Yahoo, Exam Deleted" });
				} else {
					res.send({ type: "error", error: "Could not delete exam" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not delete exam" });
			});
	});

	//Homework

	app.post("/api/teacher/addHomework", requireLogin, requireTeacher, async (req, res) => {
		const { schoolId, teacherId, className, sectionName, subjectName, title, duration, startDate, endDate } = req.body;
		console.log(req.body);
		new Homework({
			schoolId: schoolId,
			teacherId: teacherId,
			className: className,
			sectionName: sectionName,
			subjectName: subjectName,
			title: title,
			duration: duration,
			startDate: startDate,
			endDate: endDate,
		})
			.save()
			.then((re) => {
				if (re) {
					res.send({ type: "success", success: "Yahoo, Updated Exam" });
				} else {
					res.send({ type: "error", error: "Could not exam" });
				}
			});
	});

	app.post("/api/teacher/updateHomework", requireLogin, requireTeacher, async (req, res) => {
		const { id, questions } = req.body;
		Homework.findOne({
			_id: id,
		})
			.then((exam) => {
				if (exam) {
					exam.questions = questions;
					exam.save().then((re) => {
						if (re) {
							res.send({ type: "success", success: "Yahoo, Updated Exam" });
						} else {
							res.send({ type: "error", error: "Could not exam" });
						}
					});
				} else {
					res.send({ type: "error", error: "Could not exam" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not exam" });
			});
	});

	app.post("/api/teacher/deleteHomework", requireLogin, requireTeacher, async (req, res) => {
		const { homeworkId } = req.body;
		Homework.findByIdAndDelete({ _id: homeworkId })
			.then((response) => {
				if (response) {
					res.send({ type: "success", success: "Yahoo, Exam Deleted" });
				} else {
					res.send({ type: "error", error: "Could not delete exam" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not delete exam" });
			});
	});

	//ASSIGNMENT

	app.post("/api/teacher/addAssignment", requireLogin, requireTeacher, async (req, res) => {
		const { schoolId, teacherId, className, sectionName, subjectName, title, objectives, startDate, endDate } = req.body;
		console.log(req.body);
		new Assignment({
			schoolId: schoolId,
			teacherId: teacherId,
			className: className,
			sectionName: sectionName,
			subjectName: subjectName,
			title: title,
			objectives: objectives,
			startDate: startDate,
			endDate: endDate,
		})
			.save()
			.then((re) => {
				if (re) {
					res.send({ type: "success", success: "Yahoo, added Assigment" });
				} else {
					res.send({ type: "error", error: "Could not add Assigment" });
				}
			});
	});

	app.post("/api/teacher/updateAssignment", requireLogin, requireTeacher, async (req, res) => {
		const { assignmentId, title, objectives, startDate, endDate } = req.body;
		Assignment.findOne({
			_id: assignmentId,
		})
			.then((assignment) => {
				if (assignment) {
					assignment.title = title;
					assignment.objectives = objectives;
					assignment.startDate = startDate;
					assignment.endDate = endDate;
					assignment.save().then((re) => {
						if (re) {
							res.send({ type: "success", success: "Yahoo, Updated Assignment" });
						} else {
							res.send({ type: "error", error: "Could not assignment" });
						}
					});
				} else {
					res.send({ type: "error", error: "Could not update assignment" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update assignment" });
			});
	});

	app.post("/api/teacher/deleteAssignment", requireLogin, requireTeacher, async (req, res) => {
		const { assignmentId } = req.body;
		Assignment.findByIdAndDelete({ _id: assignmentId })
			.then((response) => {
				if (response) {
					res.send({ type: "success", success: "Yahoo, Assignment Deleted" });
				} else {
					res.send({ type: "error", error: "Could not delete assignment" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not delete assignment" });
			});
	});

	app.post("/api/teacher/addAssignmentRemark", requireLogin, requireTeacher, async (req, res) => {
		const { id, remark, assignmentId, marks } = req.body;
		Assignment.findOne({
			_id: assignmentId,
		})
			.then((assignment) => {
				if (assignment) {
					var attend = assignment.attend;
					var found = false;
					var pos;
					var data = {
						id: id,
						remark: remark,
						marks: marks,
					};
					attend.map((a, index) => {
						if (a.id === id) {
							found = true;
							pos = index;
						}
					});
					if (found === false) {
						attend.push(data);
					} else {
						attend[pos].remark = remark;
						attend[pos].marks = marks;
					}
					assignment.attend = attend;
					assignment.save().then((re) => {
						if (re) {
							res.send({ type: "success", success: "Yahoo, Updated Remark" });
						} else {
							res.send({ type: "error", error: "Could not Remark" });
						}
					});
				} else {
					res.send({ type: "error", error: "Could not update Remark" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update Remark" });
			});
	});

	// ADD DISCUSSION GROUP

	app.post("/api/teacher/addDiscussionGroup", requireLogin, requireTeacher, async (req, res) => {
		const { ownerId, ownerRole, schoolId, title, audience, grade, section } = req.body;

		new Discussion({
			ownerId: ownerId,
			ownerRole: ownerRole,
			schoolId: schoolId,
			title: title,
			audience: audience,
			grade: grade,
			section: section,
			chats: [],
		})
			.save()
			.then((re) => {
				if (re) {
					res.send({ type: "success", success: "Yahoo, Group created" });
				} else {
					res.send({ type: "error", error: "Could not create group" });
				}
			});
	});

	// ADD MESSAGE IN FORUM

	app.post("/api/teacher/addMessage", requireLogin, requireTeacher, async (req, res) => {
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

	app.post("/api/teacher/addReply", requireLogin, requireTeacher, async (req, res) => {
		const { reply, userId, userRole, msgId, discId } = req.body;

		Discussion.findOne({ _id: discId }).then((result) => {
			if (result) {
				console.log("result");
				result.chats.map((item) => {
					if (item._id.toString() === msgId.toString()) {
						var newReply = item.reply;

						var replyObj = {};
						replyObj.reply = reply;
						replyObj.userId = userId;
						replyObj.userRole = userRole;

						newReply.push(replyObj);

						item.reply = newReply;
						console.log(item.reply);
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

	//EDIT-LESSON-PLAN

	app.post("/api/teacher/editLessonPlan", requireLogin, requireTeacher, async (req, res) => {
		const { goal, ldur, objective, summary, skills, questions, knowledge, references, hw, feedback, chapterName, topicName, lessonId } = req.body;

		Lesson.findOne({ _id: lessonId }).then((lesson) => {
			if (lesson) {
				lesson.goal = goal;
				lesson.ldur = ldur;
				lesson.objective = objective;
				lesson.summary = summary;
				lesson.skills = skills;
				lesson.questions = questions;
				lesson.knowledge = knowledge;
				lesson.references = references;
				lesson.hw = hw;
				lesson.feedback = feedback;
				lesson.chapterName = chapterName;
				lesson.topicName = topicName;
				lesson.save().then((r) => {
					if (r) {
						if (r) {
							res.send({ type: "success", success: "Yahoo, Updated Lesson Plan" });
						} else {
							res.send({ type: "error", error: "Could not update behaviour" });
						}
					}
				});
			}
		});
	});

	app.post("/api/teacher/deleteLessonPlan", requireLogin, requireTeacher, async (req, res) => {
		const { schoolId, lessonId, className, sectionName, subjectName } = req.body;

		Lesson.findByIdAndDelete({ _id: lessonId }).then((l) => {
			if (l) {
				if (l) {
					School.findOne({ _id: schoolId }).then((school) => {
						if (school) {
							classes = school.classes;
							classes.map((c) => {
								if (c.name === className) {
									c.sections.map((s) => {
										if (s.name === sectionName) {
											s.subjects.map((sub) => {
												if (sub.name === subjectName) {
													var lessons = [];
													sub.lessons.map((item) => {
														if (item !== lessonId) {
															lessons.push(item);
														}
													});
													sub.lessons = lessons;
													console.log("322", sub.lessons);
												}
											});
										}
									});
								}
							});
							school.classes = classes;
							school.save().then((re) => {
								if (re) {
									res.send({ type: "success", success: "Yahoo, Updated Lesson Plan" });
								} else {
									res.send({ type: "error", error: "Could not update behaviour" });
								}
							});
						}
					});
				}
			}
		});
	});

	app.post("/api/teacher/saveSeating", requireLogin, requireTeacher, async (req, res) => {
		const { schoolId, className, sectionName, subjectName, layout } = req.body;
		School.findOne({ _id: schoolId }).then((school) => {
			classes = school.classes;
			classes.map((c) => {
				if (c.name === className) {
					c.sections.map((s) => {
						if (s.name === sectionName) {
							s.subjects.map((sub) => {
								if (sub.name === subjectName) {
									sub.layout = layout;
								}
							});
						}
					});
				}
			});
			school.classes = classes;
			school.save().then((r) => {
				if (r) {
					res.send({ type: "success", success: "Yahoo, Updated layout" });
				} else {
					res.send({ type: "error", error: "Could not update layput" });
				}
			});
		});
	});

	// TODO TASK API

	app.post("/api/teacher/addTodo", requireLogin, requireTeacher, async (req, res) => {
		const { teacherId, todo } = req.body;
		Teacher.findOne({ _id: teacherId }).then((r) => {
			if (r) {
				r.todo.push(todo);
				r.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Todo" });
					} else {
						res.send({ type: "error", error: "Could not update todo" });
					}
				});
			}
		});
	});

	app.post("/api/teacher/deleteTodo", requireLogin, requireTeacher, async (req, res) => {
		const { teacherId, task } = req.body;
		Teacher.findOne({ _id: teacherId }).then((r) => {
			if (r) {
				var newTodo = r.todo;
				newTodo = newTodo.filter((item) => item.title !== task.title);
				r.todo = newTodo;
				r.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Todo" });
					} else {
						res.send({ type: "error", error: "Could not update todo" });
					}
				});
			}
		});
	});

	// ANNOUNCEMENT API

	app.post("/api/teacher/addAnnouncement", requireLogin, requireTeacher, async (req, res) => {
		const { teacherId, news } = req.body;
		new Announcement({
			teacherId: teacherId,
			title: news.title,
			grade: news.grade,
			type: news.type,
			studentId: news.studentId,
		})
			.save()
			.then((r) => {
				if (r) {
					res.send({ type: "success", success: "Yahoo, Updated Poll" });
				} else {
					res.send({ type: "error", error: "Could not update Poll" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update Poll" });
			});
	});

	app.post("/api/teacher/deleteAnnouncement", requireLogin, requireTeacher, async (req, res) => {
		const { id } = req.body;
		Announcement.findOneAndDelete({ _id: id })
			.then((re) => {
				if (re) {
					res.send({ type: "success", success: "Yahoo, Updated Announcement" });
				} else {
					res.send({ type: "error", error: "Could not update Announcement" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update Announcement" });
			});
	});

	// CALENDAR EVENTS API

	app.post("/api/teacher/addCalendarEvent", requireLogin, requireTeacher, async (req, res) => {
		const { userId, event, schoolId } = req.body;
		new Calendar({
			userId: userId,
			schoolId: schoolId,
			title: event.title,
			audience: event.audience,
			grade: event.grade,
			start: event.start,
			end: event.end,
			allDay: event.allDay,
		})
			.save()
			.then((r) => {
				if (r) {
					res.send({ type: "success", success: "Yahoo, Updated Calendar Event" });
				} else {
					res.send({ type: "error", error: "Could not update Calendar Event" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update Calendar Event" });
			});
	});

	// app.post("/api/teacher/deleteCalendarEvent", requireLogin, requireTeacher, async (req, res) => {
	// 	const { id } = req.body;
	// 	Announcement.findOneAndDelete({ _id: id })
	// 		.then((re) => {
	// 			if (re) {
	// 				res.send({ type: "success", success: "Yahoo, Updated Announcement" });
	// 			} else {
	// 				res.send({ type: "error", error: "Could not update Announcement" });
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 			res.send({ type: "error", error: "Could not update Announcement" });
	// 		});
	// });

	// POLL API

	app.post("/api/teacher/addPoll", requireLogin, requireTeacher, async (req, res) => {
		const { teacherId, poll } = req.body;
		console.log(poll);
		res.send({ type: "success", success: "Yahoo, Updated Poll" });
		new Poll({
			teacherId: teacherId,
			questions: poll.questionArray,
			pollTitle: poll.pollTitle,
			grade: poll.grade,
		})
			.save()
			.then((r) => {
				if (r) {
					res.send({ type: "success", success: "Yahoo, Updated Poll" });
				} else {
					res.send({ type: "error", error: "Could not update Poll" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update Poll" });
			});
	});

	app.post("/api/teacher/deletePoll", requireLogin, requireTeacher, async (req, res) => {
		const { id } = req.body;
		// RESOURCES API
		Poll.findOneAndDelete({ _id: id })
			.then((re) => {
				if (re) {
					res.send({ type: "success", success: "Yahoo, Updated Poll" });
				} else {
					res.send({ type: "error", error: "Could not update Poll" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update Poll" });
			});
	});

	// RESOURCES API

	app.post("/api/teacher/addResource", requireLogin, async (req, res) => {
		console.log(req.body);
		const { schoolId, topicName, subjectName, className, chapterName, resourceName, file, sectionName } = req.body;
		School.findOne({ _id: schoolId }).then((school) => {
			if (school) {
				classes = school.classes;
				classes.map((c) => {
					if (c.name === className) {
						c.sections.map((s) => {
							if (s.name === sectionName) {
								s.subjects.map((sub) => {
									if (sub.name === subjectName) {
										console.log(sub);
										var resource = {
											file: file,
											chapterName: chapterName,
											topicName: topicName,
											resourceName: resourceName,
										};
										sub.resources.push(resource);
									}
								});
							}
						});
					}
				});
				school.classes = classes;
				school.save().then((r) => {
					if (r) {
						res.send({ type: "success", success: "Yahoo, added resource" });
					} else {
						res.send({ type: "error", error: "Could not add resource" });
					}
				});
			}
		});
	});

	app.post("/api/teacher/deleteResource", requireLogin, async (req, res) => {
		const { schoolId, subjectName, className, resource, sectionName } = req.body;
		School.findOne({ _id: schoolId }).then((school) => {
			if (school) {
				classes = school.classes;
				classes.map((c) => {
					if (c.name === className) {
						c.sections.map((s) => {
							if (s.name === sectionName) {
								s.subjects.map((sub) => {
									if (sub.name === subjectName) {
										var newResources = [];
										sub.resources.map((resource) => {
											if (resource._id !== resource._id) {
												newResources.push(resource);
											}
										});
										sub.resources = newResources;
									}
								});
							}
						});
					}
				});
				school.classes = classes;
				school.save().then((r) => {
					if (r) {
						res.send({ type: "success", success: "Yahoo, added resource" });
					} else {
						res.send({ type: "error", error: "Could not add resource" });
					}
				});
			}
		});
	});

	// GET ANALYTICAL REPORTS

	app.post("/api/teacher/studentAnalytics/subject", requireLogin, requireTeacher, async (req, res) => {
		console.log("509", req.body);
		const { studentId, subject } = req.body;
		PracticeResult.find({ studentId: studentId, subject: new RegExp(subject, "i") }).then((result) => {
			if (result.length > 0) {
				console.log("Found Something !", result.length);
				res.send({ data: result.reverse(), type: "success" });
			} else {
				console.log("Not Found !");
				res.send({ error: "Not Found", type: "error" });
			}
		});
	});

	//ADD CREATIVITY
	app.post("/api/teacher/addCreativity", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note, date, push } = req.body;
		console.log(status);
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var creativities = student.creativity;
				var creativity = {
					className: className,
					sectionName: sectionName,
					subjectName: subjectName,
					status: status,
					teacherId: teacherId,
					note: "",
					date: date,
				};
				creativities.map((creat, index) => {
					if (creat.teacherId === teacherId && creat.sectionName === sectionName && creat.className === className && creat.subjectName === subjectName && creat.date === date) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					creativities[pos].status = status;
					if (push) {
						student.positivePoints = student.positivePoints + 1;
					} else {
						student.positivePoints = student.positivePoints - 1;
					}
				} else {
					creativities.push(creativity);
					student.positivePoints = student.positivePoints + 1;
				}
				student.creativity = creativities;
				console.log(student.creativity);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Creativity" });
					} else {
						res.send({ type: "error", error: "Could not update Creativity" });
					}
				});
			}
		});
	});

	app.post("/api/teacher/addCreativityNote", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note } = req.body;
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var creativities = student.creativity;
				creativities.map((creat, index) => {
					if (creat.teacherId === teacherId && creat.sectionName === sectionName && creat.className === className && creat.subjectName === subjectName) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					creativities[pos].status = status;
					creativities[pos].note = note;
				}
				student.creativity = creativities;
				console.log(student.creativity);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Creativity" });
					} else {
						res.send({ type: "error", error: "Could not update Creativity" });
					}
				});
			}
		});
	});

	//ADD POINTS
	app.post("/api/teacher/addPositivePoint", requireLogin, requireTeacher, async (req, res) => {
		const { studentId } = req.body;
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var postivePoints = student.postivePoints + 1;
				student.postivePoints = postivePoints;
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Points" });
					} else {
						res.send({ type: "error", error: "Could not update Points" });
					}
				});
			} else {
				console.log("No students found");
			}
		});
	});

	app.post("/api/teacher/addNegativePoint", requireLogin, requireTeacher, async (req, res) => {
		const { studentId } = req.body;
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var negativePoints = student.negativePoints + 1;
				student.negativePoints = negativePoints;
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Points" });
					} else {
						res.send({ type: "error", error: "Could not update Points" });
					}
				});
			} else {
				console.log("No students found");
			}
		});
	});

	///ADD Entrepreneurship
	app.post("/api/teacher/addEntrepreneurship", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note, date, push } = req.body;
		console.log(status);
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var entrepreneurships = student.entrepreneurship;
				var entrepreneurship = {
					className: className,
					sectionName: sectionName,
					subjectName: subjectName,
					status: status,
					teacherId: teacherId,
					note: "",
					date: date,
				};
				entrepreneurships.map((creat, index) => {
					if (creat.teacherId === teacherId && creat.sectionName === sectionName && creat.className === className && creat.subjectName === subjectName && creat.date === date) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					entrepreneurships[pos].status = status;
					if (push) {
						student.positivePoints = student.positivePoints + 1;
					} else {
						student.positivePoints = student.positivePoints - 1;
					}
				} else {
					entrepreneurships.push(entrepreneurship);
					student.positivePoints = student.positivePoints + 1;
				}
				student.entrepreneurship = entrepreneurships;
				console.log(student.entrepreneurship);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Entrepreneurship" });
					} else {
						res.send({ type: "error", error: "Could not update Entrepreneurship" });
					}
				});
			}
		});
	});

	app.post("/api/teacher/addEntrepreneurshipNote", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note } = req.body;
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var entrepreneurships = student.entrepreneurship;
				entrepreneurships.map((creat, index) => {
					if (creat.teacherId === teacherId && creat.sectionName === sectionName && creat.className === className && creat.subjectName === subjectName) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					entrepreneurships[pos].status = status;
					entrepreneurships[pos].note = note;
				}
				student.entrepreneurship = entrepreneurships;
				console.log(student.entrepreneurship);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Entrepreneurship" });
					} else {
						res.send({ type: "error", error: "Could not update Entrepreneurship" });
					}
				});
			}
		});
	});

	//ADD Participation
	app.post("/api/teacher/addParticipation", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note, date, push } = req.body;
		console.log(status);
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var participations = student.participation;
				var participation = {
					className: className,
					sectionName: sectionName,
					subjectName: subjectName,
					status: status,
					teacherId: teacherId,
					note: "",
					date: date,
				};
				participations.map((creat, index) => {
					if (creat.teacherId === teacherId && creat.sectionName === sectionName && creat.className === className && creat.subjectName === subjectName && creat.date === date) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					participations[pos].status = status;
					if (push) {
						student.positivePoints = student.positivePoints + 1;
					} else {
						student.positivePoints = student.positivePoints - 1;
					}
				} else {
					participations.push(participation);
					student.positivePoints = student.positivePoints + 1;
				}
				student.participation = participations;
				console.log(student.participation);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Participation" });
					} else {
						res.send({ type: "error", error: "Could not update Participation" });
					}
				});
			}
		});
	});

	app.post("/api/teacher/addParticipationNote", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note } = req.body;
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var participations = student.participation;
				participations.map((creat, index) => {
					if (creat.teacherId === teacherId && creat.sectionName === sectionName && creat.className === className && creat.subjectName === subjectName) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					participations[pos].status = status;
					participations[pos].note = note;
				}
				student.participation = participations;
				console.log(student.participation);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Participation" });
					} else {
						res.send({ type: "error", error: "Could not update Participation" });
					}
				});
			}
		});
	});

	//ADD ProblemSolving
	app.post("/api/teacher/addProblem", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note, date, push } = req.body;
		console.log(status);
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var problems = student.problemSolving;
				var problem = {
					className: className,
					sectionName: sectionName,
					subjectName: subjectName,
					status: status,
					teacherId: teacherId,
					note: "",
					date: date,
				};
				problems.map((creat, index) => {
					if (creat.teacherId === teacherId && creat.sectionName === sectionName && creat.className === className && creat.subjectName === subjectName && creat.date === date) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					problems[pos].status = status;
					if (push) {
						student.positivePoints = student.positivePoints + 1;
					} else {
						student.positivePoints = student.positivePoints - 1;
					}
				} else {
					problems.push(problem);
					student.positivePoints = student.positivePoints + 1;
				}
				student.problemSolving = problems;
				console.log(student.problemSolving);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated problem solving" });
					} else {
						res.send({ type: "error", error: "Could not update proble solving" });
					}
				});
			}
		});
	});

	app.post("/api/teacher/addProblemNote", requireLogin, requireTeacher, async (req, res) => {
		const { className, sectionName, subjectName, status, teacherId, studentId, note } = req.body;
		Student.findOne({ _id: studentId }).then((student) => {
			if (student) {
				var found = false;
				var pos;
				var problems = student.problemSolving;
				problems.map((creat, index) => {
					if (creat.teacherId === teacherId && creat.sectionName === sectionName && creat.className === className && creat.subjectName === subjectName) {
						found = true;
						pos = index;
					}
				});
				if (found) {
					problems[pos].status = status;
					problems[pos].note = note;
				}
				student.problemSolving = problems;
				console.log(student.problemSolving);
				student.save().then((re) => {
					if (re) {
						res.send({ type: "success", success: "Yahoo, Updated Problem Solving" });
					} else {
						res.send({ type: "error", error: "Could not update Problem Solving" });
					}
				});
			}
		});
	});

	app.post("/api/teacher/studentInfo", requireLogin, requireTeacher, async (req, res) => {
		const { id } = req.body;
		Student.findOne({ _id: id }).then((student) => {
			res.send(student);
		});
	});

	app.post("/api/teacher/getOtherUser", requireLogin, requireTeacher, async (req, res) => {
		const { id, role } = req.body;
		if (role === "teacher") {
			Teacher.findOne({ _id: id }).then((teacher) => {
				res.send(teacher);
			});
		}
	});

	// Get list of all codes of topics

	app.post("/api/teacher/getCodes", requireLogin, requireTeacher, async (req, res) => {
		const { code, grade, subject } = req.body;

		Class.findOne({ className: grade }).then((clas) => {
			if (clas) {
				clas.subjects.map((sub) => {
					if (sub.subjectName === subject) {
						var codeArray = [];
						for (var i = 0; i < sub.chapters.length; i++) {
							sub.chapters[i].topics.map((topic) => {
								codeArray.push(topic.code);
							});
						}
						res.send(codeArray);
					}
				});
			}
		});
	});

	//LABWORK

	app.post("/api/teacher/addLabWork", requireLogin, requireTeacher, async (req, res) => {
		const { schoolId, teacherId, className, sectionName, subjectName, title, objectives, startDate, endDate } = req.body;
		console.log(req.body);
		new LabWork({
			schoolId: schoolId,
			teacherId: teacherId,
			className: className,
			sectionName: sectionName,
			subjectName: subjectName,
			title: title,
			objectives: objectives,
			startDate: startDate,
			endDate: endDate,
		})
			.save()
			.then((re) => {
				if (re) {
					res.send({ type: "success", success: "Yahoo, added Labwork" });
				} else {
					res.send({ type: "error", error: "Could not add Labwork" });
				}
			});
	});

	app.post("/api/teacher/updateLabWork", requireLogin, requireTeacher, async (req, res) => {
		const { labworkId, title, objectives, startDate, endDate } = req.body;
		LabWork.findOne({
			_id: labworkId,
		})
			.then((labwork) => {
				if (labwork) {
					labwork.title = title;
					labwork.objectives = objectives;
					labwork.startDate = startDate;
					labwork.endDate = endDate;
					labwork.save().then((re) => {
						if (re) {
							res.send({ type: "success", success: "Yahoo, Updated Labwork" });
						} else {
							res.send({ type: "error", error: "Could not Labwork" });
						}
					});
				} else {
					res.send({ type: "error", error: "Could not update Labwork" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update Labwork" });
			});
	});

	app.post("/api/teacher/deleteLabWork", requireLogin, requireTeacher, async (req, res) => {
		const { labworkId } = req.body;
		LabWork.findByIdAndDelete({ _id: labworkId })
			.then((response) => {
				if (response) {
					res.send({ type: "success", success: "Yahoo, Labwork Deleted" });
				} else {
					res.send({ type: "error", error: "Could not delete Labwork " });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not delete labwork" });
			});
	});

	app.post("/api/teacher/addLabWorkRemark", requireLogin, requireTeacher, async (req, res) => {
		const { id, remark, labworkId, observation, marks } = req.body;
		LabWork.findOne({
			_id: labworkId,
		})
			.then((labwork) => {
				if (labwork) {
					var attend = labwork.attend;
					var found = false;
					var pos;
					var data = {
						id: id,
						remark: remark,
						observation: observation,
						marks: marks,
					};
					attend.map((a, index) => {
						if (a.id === id) {
							found = true;
							pos = index;
						}
					});
					if (found === false) {
						attend.push(data);
					} else {
						attend[pos].remark = remark;
						attend[pos].observation = observation;
						attend[pos].marks = marks;
					}
					labwork.attend = attend;
					labwork.save().then((re) => {
						if (re) {
							res.send({ type: "success", success: "Yahoo, Updated Remark" });
						} else {
							res.send({ type: "error", error: "Could not Remark" });
						}
					});
				} else {
					res.send({ type: "error", error: "Could not update Remark" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.send({ type: "error", error: "Could not update Remark" });
			});
	});
};
