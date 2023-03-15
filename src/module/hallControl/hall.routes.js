import { Router } from "express";

import * as hallControl from './controller/hall.controller.js'
const router = Router()
router.get("/", (req, res) => {
    res.status(200).json({ message: 'hall Module' })
})

router.delete("/deleteHall/:hallId", hallControl.deleteHall)


export default router