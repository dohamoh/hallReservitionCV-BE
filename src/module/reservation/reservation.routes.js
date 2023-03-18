import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import { endPoints } from "../auth/auth.endPoint.js";
import * as reservationControl from './controller/reservation.controller.js'




const router = Router()
router.get("/", (req, res) => {
    res.status(200).json({ message: 'reservation Module' })
})

router.post("/addReservation",auth(endPoints.users),myMulter(fileValidation.file).single("file"),HME, reservationControl.addReservation)
router.get("/getAllReservation",auth(endPoints.admins), reservationControl.getAllReservation)
router.delete("/cancelReservation/:_id",auth(endPoints.users), reservationControl.cancelReservation)


export default router
