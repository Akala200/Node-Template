import mongoose from "mongoose";

const applicantTokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'applicant' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

const ApplicantToken = mongoose.model("ApplicantToken", applicantTokenSchema);

export default ApplicantToken;