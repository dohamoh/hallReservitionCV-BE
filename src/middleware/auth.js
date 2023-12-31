import jwt from "jsonwebtoken"
import userModel from "../../DB/model/user.model.js"
import { asyncHandler } from "../services/asyncHandler.js"
export const roles = {
    User: "User",
    Admin: "Admin"
}
export const auth = (acceptRoles = [roles.User]) => {

    return asyncHandler(async (req, res, next) => {
        const { authorization } = req.headers
        if (!authorization?.startsWith(process.env.BearerKey)) {

            // next(new Error("In-valid Bearer Key", { cause: 400 }))
            res.status(400).json({ message: "In-valid Bearer Key" })

        } else {
            const token = authorization.split(process.env.BearerKey)[1]

            const decoded = jwt.verify(token, process.env.tokenSignature);
            if (!decoded?.id || !decoded?.isLoggedIn) {
                // next(new Error("In-valid token payload", { cause: 400 }))
                res.status(400).json({ message: "In-valid token payload" })

            } else {
                const user = await userModel.findById({ _id: decoded.id })
                if (!user) {
                    // next(new Error("Not register user", { cause: 404 }))
                    res.status(404).json({ message: "Not register user" })

                } else {

                    if (acceptRoles.includes(user.role)) {
                        req.user = user
                        next()
                    } else {
                        // next(new Error("Not authorized user", { cause: 403 }))
                        res.status(403).json({ message: "Not authorized user" })

                    }
                }
            }
        }
    })
}

