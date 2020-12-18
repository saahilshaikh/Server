const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    subjects: [{
        subjectName: String,
        chapters: [{
            chapterName: String,
            topics: [{
                topicName: String,
                date: {
                    type: String,
                    default: new Date()
                },
                resources: {
                    type: Array,
                    default: [],
                },
                practices: {
                    type: Array,
                    default: [],
                }
            }],
        }],
        doa: Date
    }],
    className: String,
    cycle:String,
    doa: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("iigp_classes", ClassSchema);
