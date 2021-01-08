const mongoose = require("mongoose");

const QuestionBankSchema = new mongoose.Schema({
    examId: String,
    title: String,
    questions: {
        type: Array,
        default: [],
    },
    subjectName: String,
    sectionName: String,
    className: String,
    teacherId: String,
    schoolId: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("questionBank", QuestionBankSchema);
