import { model } from 'mongoose';
import { hallModel } from '../../../../DB/model/hall.model'
import { asyncHandler } from '../../../services/asyncHandler.js';

export const addHall = asyncHandler(async(req,res,next) => {
    let {hallImg, hallName, hallDesc, hallAttendees} = req.body;
})

export const updateHall = asyncHandler(async (req, res, next) => {
    let { hallId } = req.params;
    let { newName, newDesc, newPic, attendees} = req.body;
    let foundedHall = await findByIdAndUpdate({ model: hallModel, condition: hallId, data: {title:newName , desc:newDesc , hallImg:newPic , attendeesNum:attendees } } = {})
    if (foundedHall) {
        res.status(200).json({ message: "hall Updated" })
    } else {
        next(new Error("hall not found", { cause: 404 }));
    }
})
export const deleteHall = asyncHandler(async (req, res, next) => {
    let { hallId } = req.params;
    let hall = await findByIdAndDelete({ model: hallModel, condition: hallId });
    if (!hall) {
        next(new Error("hall not found", { cause: 404 }));
    } else {
        res.status(200).json({ message: "deleted" })
    }
})