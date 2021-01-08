const requireLogin = require("../middlewares/requireLogin");
const requireSuperAdmin = require("../middlewares/requireSuperAdmin");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const School = mongoose.model("schools");
const Class = mongoose.model("iigp_classes");
const Practice = mongoose.model("iigp_practices");
const Resource = mongoose.model("iigp_resources");
const SchoolAdmin = mongoose.model("schoolAdmins");
const DistrictOfficers = mongoose.model("districtOfficers");
const Users = mongoose.model("users");

module.exports = (app) => {
	//IIGP CLASSES

	app.get("/api/showList/classes", requireLogin, requireSuperAdmin, async (req, res) => {
		Class.find().then((response) => {
			res.send(response);
		});
	});

	app.post("/api/addChapter", requireLogin, requireSuperAdmin, async (req, res) => {
		const { classId, subjectName, chapterName } = req.body;
		Class.findOne({ _id: classId }).then((clas) => {
			if (clas) {
				var subjectsInfo = clas.subjects;
				subjectsInfo.map((sub) => {
					if (sub.subjectName === subjectName) {
						var chapterInfo = {
							chapterName: chapterName,
							topics: [],
						};
						sub.chapters.push(chapterInfo);
					}
				});
				clas.subjects = subjectsInfo;
				clas.save().then((re) => {
					if (re) {
						res.send({ success: "Chapter Added", type: "success" });
					}
				});
			} else {
				res.send({ success: "Cannot add chapter", type: "error" });
			}
		});
	});

	app.post("/api/addTopic", requireLogin, requireSuperAdmin, async (req, res) => {
		const { classId, subjectName, chapterName, topicName } = req.body;
		new Practice({
			level: [],
			level: [],
			level3: [],
			level4: [],
			level5: [],
		})
			.save()
			.then((response) => {
				Class.findOne({ _id: classId }).then((clas) => {
					if (clas) {
						var subjectsInfo = clas.subjects;
						subjectsInfo.map((sub) => {
							if (sub.subjectName === subjectName) {
								sub.chapters.map((chapter) => {
									if (chapter.chapterName === chapterName) {
										var practices = [];
										var practice = response._id;
										practices.push(practice);
										var topicInfo = {
											topicName: topicName,
											resources: [],
											practices: practices,
										};
										chapter.topics.push(topicInfo);
										console.log(chapter.topics);
									}
								});
							}
						});
						clas.subjects = subjectsInfo;
						clas.save().then((re) => {
							if (re) {
								res.send({ success: "Topic Added", type: "success" });
							}
						});
					} else {
						res.send({ error: "Cannot add topic", type: "error" });
					}
				});
			});
	});

	app.post("/api/updatePractice", requireLogin, requireSuperAdmin, async (req, res) => {
		const { id, level1, level2, level3, level4, level5 } = req.body;
		Practice.findById({ _id: id }).then((practice) => {
			if (practice) {
				practice.level1 = level1;
				practice.level2 = level2;
				practice.level3 = level3;
				practice.level4 = level4;
				practice.level5 = level5;
				practice.save().then((re) => {
					if (re) {
						res.send({ success: "Questions Updated", type: "success" });
					}
				});
			} else {
				res.send({ error: "Error Updating", type: "error" });
			}
		});
	});

	app.post("/api/practiceInfo", requireLogin, requireSuperAdmin, async (req, res) => {
		const { id } = req.body;
		console.log(id);
		Practice.findById({ _id: id }).then((practice) => {
			if (practice) {
				res.send(practice);
			}
		});
	});

	app.post("/api/controller/addResource", requireLogin, async (req, res) => {
		const { file, resourceName, topicName, subjectName, chapterName, classId } = req.body;
		Class.findOne({ _id: classId }).then((clas) => {
			if (clas) {
				console.log(clas);
				var subjectsInfo = clas.subjects;
				subjectsInfo.map((sub) => {
					if (sub.subjectName === subjectName) {
						sub.chapters.map((chapter) => {
							if (chapter.chapterName === chapterName) {
								chapter.topics.map((topic) => {
									if (topic.topicName === topicName) {
										var resource = {
											file: file,
											resourceName: resourceName,
											date: new Date(),
										};
										topic.resources.push(resource);
									}
								});
							}
						});
					}
				});
				clas.subjects = subjectsInfo;
				clas.save().then((re) => {
					if (re) {
						new Resource({
							file: file,
							resourceName: resourceName,
							topicName: topicName,
							subjectName: subjectName,
							chapterName: chapterName,
							classId: classId,
						})
							.save()
							.then((ree) => {
								if (ree) {
									res.send({ success: "Resource Added", type: "success" });
								}
							});
					}
				});
			} else {
				res.send({ success: "Cannot add resource", type: "error" });
			}
		});
	});

	//Create DistrictOfficer

	app.post("/api/createDistrictOfficer", requireLogin, requireSuperAdmin, async (req, res) => {
		const { fName, lName, email, contact, address, city, state, zip, experience, qualification } = req.body; //request data coming from react front end
		const password = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);

		DistrictOfficers.findOne({ email: email }).then((officer) => {
			if (officer) {
				res.send({ error: "Officer already exists", type: "error" });
			} else {
				new DistrictOfficers({
					firstName: fName,
					lastName: lName,
					address: address,
					contact: contact,
					email: email,
					city: city,
					state: state,
					zip: zip,
					experience: experience,
					qualification: qualification,
				})
					.save() //newOfficer stores the response coming from mongo after save() is executed successfully
					.then((response) => {
						new Users({
							email: email,
							name: fName + " " + lName,
							role: "DistrictOfficer",
							password: password,
							ref_id: response._id,
						})
							.save()
							.then((response) => {
								res.send({ success: "District Officer Created", type: "success" });
							});
					});
			}
		});
	});

	//Show a single DistrictOfficer Info

	app.post("/api/showDistrictOfficer", requireLogin, requireSuperAdmin, async (req, res) => {
		const { officerId } = req.body;
		DistrictOfficers.findOne({ _id: officerId }).then((officer) => {
			if (officer) {
				console.log(officer);
			} else {
				console.log("No district officer found");
			}
		});
	});

	//Show all DistrictOfficer Info

	app.get("/api/showList/DistrictOfficer", requireLogin, requireSuperAdmin, async (req, res) => {
		DistrictOfficers.find().then((response) => {
			res.send(response.reverse());
		});
	});

	//Remove DistrictOfficer

	app.post("/api/removeDistrictOfficer", requireLogin, requireSuperAdmin, async (req, res) => {
		const { officerId } = req.body;
		DistrictOfficers.findOne({ _id: officerId }).then((officer) => {
			if (officer) {
				console.log("Found OFFICER");
				officer.schoolList.map((schoolId) => {
					School.findOne({ _id: schoolId }).then((school) => {
						if (school) {
							var districtOfficers = school.districtOfficers;
							var newDistrictOfficers = [];
							districtOfficers.map((id) => {
								if (id !== officerId) {
									newDistrictOfficers.push(id);
								}
							});
							school.districtOfficers = newDistrictOfficers;
							school.save();
						}
					});
				});
				Users.findOneAndDelete({ email: officer.email }).then((re) => {
					DistrictOfficers.findOneAndDelete({ _id: officerId }).then((resp) => {
						if (resp) {
							res.send({ success: "District Officer Deleted", type: "success" });
						} else {
							res.send({ error: "District Officer Could Not Be Deleted", type: "error" });
						}
					});
				});
			} else {
				console.log("COULD NOT Found OFFICER");
				res.send({ error: "District Officer Could Not Be Deleted", type: "error" });
			}
		});
	});

	//Add School

	app.post("/api/createSchool", requireLogin, requireSuperAdmin, async (req, res) => {
		const { name, branch, address, logo, email, contact, website, fax } = req.body;
		School.findOne({ name: name, branch: branch }).then((school) => {
			if (school) {
				res.send({ error: "School Already Exists", type: "error" });
			} else {
				const response = new School({
					logo: logo,
					name: name,
					branch: branch,
					address: address,
					email: email,
					contact: contact,
					fax: fax,
					website: website,
				}).save();
				res.send({ success: "Successfully Added School", type: "success" });
			}
		});
	});

	//Edit School

	app.post("/api/editSchool", requireLogin, requireSuperAdmin, async (req, res) => {
		const { name, branch, address, email, contact, logo, fax, website, id } = req.body;
		School.findOne({ _id: id }).then((school) => {
			if (school) {
				school.logo = logo;
				school.name = name;
				school.branch = branch;
				school.address = address;
				school.email = email;
				school.contact = contact;
				school.fax = fax;
				school.website = website;
				school.save().then((response) => {
					if (response) {
						res.send({ success: "School Info Updated", type: "success" });
					}
				});
			} else {
				res.send({ error: "School Ref Not Found", type: "error" });
			}
		});
	});

	//Show a single School Info

	app.post("/api/showSchool", requireLogin, requireSuperAdmin, async (req, res) => {
		const { id } = req.body;
		School.find({ _id: id }).then((school) => {
			if (school) {
				console.log(school);
			} else {
				console.log("No school found");
			}
		});
	});

	//Show a all School Info

	app.get("/api/showList/School", requireLogin, requireSuperAdmin, async (req, res) => {
		School.find().then((response) => {
			res.send(response.reverse());
		});
	});

	//Add SchoolAdmin

	app.post("/api/school/createSchoolAdmin", requireLogin, requireSuperAdmin, async (req, res) => {
		const { name, email, address, contact, photo, zip, city, state, dob, qualification, experience, id } = req.body; //request data coming from react front end
		const password = await bcrypt.hashSync(email, bcrypt.genSaltSync(8), null);

		Users.findOne({ email: email }).then((user) => {
			if (user) {
				res.send({ error: "User exists with same email id", type: "error" });
			} else {
				console.log("Adding Admin");
				new SchoolAdmin({
					photo: photo,
					name: name,
					email: email,
					address: address,
					contact: contact,
					dob: dob,
					qualification: qualification,
					experience: experience,
					city: city,
					state: state,
					zip: zip,
					school_id: id,
				})
					.save()
					.then((r) => {
						new Users({
							email: email,
							name: name,
							role: "SchoolAdmin",
							password: password,
							ref_id: r._id,
						})
							.save()
							.then((response) => {
								School.findOne({ _id: id }).then((school) => {
									if (school) {
										var administrators = school.administrators;
										var data = {
											name: name,
											id: r._id.toString(),
										};
										administrators.push(data);
										console.log("43", administrators);
										school.administrators = administrators;
										school.save().then((re) => {
											if (re) {
												res.send({ success: "School Administrators Added", type: "success" });
											}
										});
									}
								});
							});
					});
			}
		});
	});

	//Assign DistrictOfficer to School

	app.post("/api/school/addDistrictOfficer", requireLogin, requireSuperAdmin, async (req, res) => {
		const { officerId, schoolId } = req.body; //request data coming from react front end
		DistrictOfficers.findOne({ _id: officerId }).then((officer) => {
			if (officer) {
				School.findOne({ _id: schoolId }).then((school) => {
					if (school) {
						var districtOfficers = school.districtOfficers;
						var data = {
							name: officer.firstName + " " + officer.lastName,
							id: officerId,
						};
						districtOfficers.push(data);
						console.log("SR 61", districtOfficers);
						school.districtOfficers = districtOfficers;
						school.save().then((re) => {
							console.log(re);
							var schoolList = officer.schoolList;
							var data2 = {
								name: school.name,
								id: schoolId,
							};
							schoolList.push(data2);
							console.log("SR 72", schoolList);
							officer.schoolList = schoolList;
							officer.save().then((resp) => {
								console.log("SR 75", res);
								if (resp) {
									res.send({ success: "School Assigned District Officer", type: "success" });
								}
							});
						});
					}
				});
			}
		});
	});

	//Delete School

	app.post("/api/deleteSchool", requireLogin, requireSuperAdmin, async (req, res) => {
		const { id } = req.body;
		School.findOneAndDelete({ _id: id }).then((response) => {
			if (response) {
				res.send({ success: "Successfully Deleted School", type: "success" });
			} else {
				res.send({ error: "Error Deleting School", type: "error" });
			}
		});
	});

	//Show school admin info

	app.post("/api/showSchoolAdmin", requireLogin, requireSuperAdmin, async (req, res) => {
		const { id } = req.body;
		SchoolAdmin.findOne({ _id: id }).then((schoolAdmin) => {
			if (schoolAdmin) {
				res.send(schoolAdmin);
			} else {
				res.send([]);
			}
		});
	});

	//Edit school admin info

	app.post("/api/editSchoolAdmin", requireLogin, requireSuperAdmin, async (req, res) => {
		const { id, name, photo, address, dob, contact, qualification, experience, city, state, zip } = req.body;
		SchoolAdmin.findOne({ _id: id }).then((schoolAdmin) => {
			if (schoolAdmin) {
				schoolAdmin.photo = photo;
				schoolAdmin.name = name;
				schoolAdmin.address = address;
				schoolAdmin.contact = contact;
				schoolAdmin.dob = dob;
				schoolAdmin.qualification = qualification;
				schoolAdmin.experience = experience;
				schoolAdmin.city = city;
				schoolAdmin.state = state;
				schoolAdmin.zip = zip;
				schoolAdmin.save().then((response) => {
					if (response) {
						res.send({ success: "School Administrator Info Updated", type: "success" });
					}
				});
			} else {
				res.send({ error: "Error Updating School Administrator Info!", type: "error" });
			}
		});
	});

	//Remove school Admin

	app.post("/api/school/removeSchoolAdmin", requireLogin, requireSuperAdmin, async (req, res) => {
		const { schoolAdminId, schoolId } = req.body;
		console.log(schoolAdminId);
		School.findOne({ _id: schoolId }).then((school) => {
			if (school) {
				var administrators = school.administrators;
				var newAdministrators = [];
				administrators.map((admin) => {
					if (admin.id !== schoolAdminId) {
						newAdministrators.push(admin);
					}
				});
				console.log("43", newAdministrators);
				school.administrators = newAdministrators;
				school.save().then((r) => {
					console.log("SR 151", r);
					SchoolAdmin.findOne({ _id: schoolAdminId }).then((schoolAdmin) => {
						if (schoolAdmin) {
							var email = schoolAdmin.email;
							Users.findOneAndDelete({ email: email }).then((re) => {
								console.log("SR 159", re);
								SchoolAdmin.findOneAndDelete({ _id: schoolAdminId }).then((resp) => {
									console.log("SR 162", resp);
									res.send({ success: "Successfully Removed School Administrator", type: "success" });
								});
							});
						}
					});
				});
			}
		});
	});

	//Remove District Officer

	app.post("/api/school/removeDistrictOfficer", requireLogin, requireSuperAdmin, async (req, res) => {
		const { officerId, schoolId } = req.body; //request data coming from react front end

		School.findOne({ _id: schoolId }).then((school) => {
			if (school) {
				var districtOfficers = school.districtOfficers;
				var newDistrictOfficers = [];
				districtOfficers.map((officer) => {
					if (officer.id !== officerId) {
						newDistrictOfficers.push(officer);
					}
				});
				console.log("SR 187", newDistrictOfficers);
				school.districtOfficers = newDistrictOfficers;
				school.save().then((re) => {
					console.log(re);
					DistrictOfficers.findOne({ _id: officerId }).then((officer) => {
						if (officer) {
							var schoolList = officer.schoolList;
							var newSchoolList = [];
							schoolList.map((id) => {
								if (id !== schoolId) {
									newSchoolList.push(id);
								}
							});
							console.log("SR 202", newSchoolList);
							officer.schoolList = newSchoolList;
							officer.save().then((resp) => {
								console.log("SR 75", res);
								if (resp) {
									res.send({ success: "Successfully Removed District Officers", type: "success" });
								}
							});
						}
					});
				});
			}
		});
	});
};
