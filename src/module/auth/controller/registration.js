import userModel from '../../../../DB/model/user.model.js'
import { sendEmail } from '../../../services/email.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';
const userPopulate = [
    {
        path: "reservations",
        populate: [
            { path: "hallId" },
        ]
    },
];

export const signUp = asyncHandler(async (req, res, next) => {
    const {email, password, gender, phone } = req.body;
    const user = await findOne({ model: userModel, condition: { email }, select: "email" })
    if (user) {
        // next(new Error("this email already register", { cause: 409 }))
        res.status(409).json({ message: "This email already register" })
    } else {
        let addUser = new userModel({ email, password, gender, phone });
        if (addUser) {
            let savedUser = await addUser.save()
            res.status(201).json({ message: "added successfully", savedUser })
        } else {
            res.status(404).json({ message: "Invalid email" })
        }
    }
})

export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await findOne({ model: userModel, condition: { email } })
    if (!user) {
        // next(new Error("You have to register first", { cause: 404 }))
        res.status(404).json({ message: "You have to register first" })
    } else {
        let compare = bcrypt.compareSync(password, user.password, parseInt(process.env.SALTROUND))
        if (compare) {

            let token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature, { expiresIn: 60 * 60 * 24 * 2 })
            res.status(200).json({ message: "welcome", token })

        } else {
            // next(new Error("invalid password", { cause: 400 }))
            res.status(400).json({ message: "invalid password" })
        }
    }
})
export const getUserData = asyncHandler(async (req, res, next) => {

    let { token } = req.params
    let decoded = jwt.verify(token, process.env.tokenSignature)

    if (!decoded && !decoded.id) {
        // next(new Error("invalid token data", { cause: 400 }))
        res.status(400).json({ message: "invalid token data" })
    } else {
        let reservation = []
        const userData = await findById({ model: userModel, condition: { _id: decoded.id }, populate: [...userPopulate] })
        for (let i = 0; i < userData.reservations.length; i++) {
            const element = userData.reservations[i];
            reservation.push(element._id)
        }
        if (userData) {
            const updatedUser = await findByIdAndUpdate({ model: userModel, condition: { _id: decoded.id }, data: { reservations: reservation }, options: { new: true } })
            if (updatedUser) {
                res.status(200).json({ message: 'DONE', userData })

            }
        } else {
            // next(new Error("invalid data token", { cause: 404 }))
            res.status(400).json({ message: "invalid token data" })
        }
    }
})
