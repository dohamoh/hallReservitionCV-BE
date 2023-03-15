import userModel from '../../../../DB/model/user.model.js'
import { sendEmail } from '../../../services/email.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';


export const signUp = asyncHandler(async (req, res, next) => {
 
    const { managementName, email, password,outMinistry,gender,phone } = req.body;
    const user = await findOne({ model: userModel, condition: { email }, select: "email" })
    if (user) {
        next(new Error("this email already register", { cause: 409 }))
    } else {
        let addUser = new userModel({managementName, email, password,outMinistry,gender,phone });
    
        if (addUser) {
            let savedUser = await addUser.save()
            res.status(201).json({ message: "added successfully", savedUser })
        } else {
            next(new Error("invalid email", { cause: 404 }))
        }
    }

})

export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await findOne({ model: userModel, condition: { email } })
    if (!user) {
        next(new Error("You have to register first", { cause: 404 }))
    } else {
        let compare = bcrypt.compareSync(password, user.password, parseInt(process.env.SALTROUND))
        if (compare) {
           
                let token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature, { expiresIn: 60 * 60 * 24 * 2 })
                res.status(200).json({ message: "welcome", token, id: user._id })
            
        } else {
            next(new Error("in valid password", { cause: 400 }))
        }
    }
})
export const getUserData = asyncHandler(async (req, res, next) => {
    let { token } = req.params
    let decoded = jwt.verify(token, process.env.tokenSignature)
    if (!decoded && !decoded.id) {
        next(new Error("invalid token data", { cause: 400 }))
    } else {
        const userData = await findById({ model: userModel, condition: { _id: decoded.id } })
        if (userData) {
            res.status(200).json({message:'DONE',userData:userData})
        } else {
            next(new Error("invalid data token", { cause: 404 }))
        }
    }
})
