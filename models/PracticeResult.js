const mongoose = require("mongoose");

const PracticeResultSchema = new mongoose.Schema({
    practiceId:String,
    studentId:String,
    duration:String,
    score:Number,
    correct:Number,
    wrong:Number,
    level1: Array,
    level2: Array,
    level3: Array,
    level4: Array,
    level5: Array,
    topic:String,
    chapter:String,
    subject:String,
    date:{
        type: Date,
        default: Date.now,
    },
});

mongoose.model("practice_results", PracticeResultSchema);
