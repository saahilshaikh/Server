const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema({
    ownerId: String,
    ownerRole: String,
    schoolId: String,
    title: String,
    audience: String,
    grade: String,
    section: String,
    chats: [
        {
            message: String,
            userId: String,
            userRole: String,
            reply: [
                {
                    reply: String,
                    userId: String,
                    userRole: String,
                    date: {
                        type: Date,
                        default: Date.now,
                    },
                }
            ],
            date: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("discussions", DiscussionSchema);