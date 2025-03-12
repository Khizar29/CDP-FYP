const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job", required: true
    },
    createdAt: { type: Date, default: Date.now }
});

// Ensure a user can apply only once per job
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
