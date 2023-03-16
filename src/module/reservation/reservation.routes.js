import { Router } from "express";
import { fileValidation, HME, myMulter } from "../../services/multer.js";

import * as reservationControl from './controller/reservation.controller.js'
const router = Router()
router.get("/", (req, res) => {
    res.status(200).json({ message: 'reservation Module' })
})

router.post("/addReservation",myMulter(fileValidation.file).single("file"),HME, reservationControl.addReservation)


export default router