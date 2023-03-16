import { Schema, model, Types } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    managementName: {
        type: String,
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char']
    },
    email: {
        type: String,
        required: [true, 'userName is required'],
        unique: [true, 'must be unique value']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
        required: [true, 'phone is required'],
    },
    gender: {
        type: String,
        required: [true, 'gender is required'],
    },
 
    confirmEmail: {
        type: Boolean,
        default: 'false',
    },
    outMinistry: {
        type: Boolean,
        default: 'false',
    },
}, {
    timestamps: true
})
userSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, parseInt(process.env.ROUNDS))
    next()
})

const userModel = model('User', userSchema);
export default userModel