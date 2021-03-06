const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    subjects: [{
        subjectName: String,
        chapters: [{
            chapterName: String,
            topics: [{
                topicName: String,
                code: {
                    type: String,
                    default: ''
                },
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
        lab: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    className: String,
    cycle: String,
    doa: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("iigp_classes", ClassSchema);
