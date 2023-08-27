import { Schema, model, Types } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
 
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
    role: {
      type: String,
      required: true,
      default:'User',
      enum: ['User','Admin']
  },
    confirmEmail: {
        type: Boolean,
        default: 'false',
    },
    reservations: [{
      type: Types.ObjectId,
      ref: "Reservation",
  }]
}, {
    timestamps: true
})
userSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, parseInt(process.env.ROUNDS))
    next()
})

const userModel = model('User', userSchema);
export default userModel
