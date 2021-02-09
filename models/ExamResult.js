const mongoose = require("mongoose");

const ExamResultSchema = new mongoose.Schema({
    examId:String,
    studentId:String,
    schoolId : String,
    questions: {
		type: Array,
		default: [],
    },
    title:String,
    marks:Number,
    correct:Number,
    wrong:Number,
    subject:String,
    date:{
        type: Date,
        default: Date.now,
    },
});

mongoose.model("exam_results", ExamResultSchema);
