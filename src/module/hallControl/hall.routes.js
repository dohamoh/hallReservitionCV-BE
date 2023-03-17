import { Router } from "express";
import { fileValidation, HME, myMulter } from "../../services/multer.js";

import * as hallControl from './controller/hall.controller.js'
const router = Router()
router.get("/", (req, res) => {
    res.status(200).json({ message: 'hall Module' })
})

router.post("/addHall",myMulter(fileValidation.file).single("file"),HME ,hallControl.addHall)
router.patch("/editHall/:hallId",myMulter(fileValidation.file).single("file"),HME, hallControl.updateHall)
router.delete("/deleteHall/:hallId", hallControl.deleteHall)


export default router