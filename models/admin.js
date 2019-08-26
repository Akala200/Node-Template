import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const saltRounds = 10; // or another integer in that ballpark

const { Schema } = mongoose;

const admin = new Schema(
    {
        active: { type: Boolean, required: true, default: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        department: { type: String, required: true },
        username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
        email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
        telephone: { type: Number, required: true },
        password: { type: String, required: true },
        passwordResetToken: String,
        passwordResetExpires: Date,
        isVerified: { type: Boolean, required: true, default: false },
        status: { type: Boolean, required: true, default: true },
    },
    { timestamps: true }
);

admin.plugin(uniqueValidator, {message: 'is already taken.'});


admin.pre("save", function(next) {
    this.password = bcrypt.hashSync(this.password.trim(), saltRounds);
    next();
});

const Admin = mongoose.model("adminusers", admin);

export default Admin;
