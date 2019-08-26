import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const saltRounds = 10; // or another integer in that ballpark

const { Schema } = mongoose;

const applicant = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    telephone: { type: String,  required: true },
    country: { type: String, required: true },
    profession: { type: String, required: true },
    state: { type: String, required: true },
    password: { type: String, required: true },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isVerified: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
},
{ timestamps: true }
);

applicant.plugin(uniqueValidator, {message: 'is already taken.'});


applicant.pre("save", function(next) {
    this.password = bcrypt.hashSync(this.password.trim(), saltRounds);
    next();
});

const Applicant = mongoose.model("Applicant", applicant);

export default Applicant;
