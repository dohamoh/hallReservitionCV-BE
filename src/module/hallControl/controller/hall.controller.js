import { model } from 'mongoose';
import { asyncHandler } from '../../../services/asyncHandler.js';

export const deleteHall = asyncHandler(async (req, res, next) => {

    let { hallId } = req.params;
    let hall = await findByIdAndDelete({ model: hallModel, condition: hallId });
    if (!hall) {
        next(new Error("hall not found", { cause: 404 }));
    } else {
        res.status(200).json({ message: "deleted" })
    }
})

export const updateHall = asyncHandler(async (req,res,next) => {
    let { hallId } = req.params;
    let { newName , newDesc} = req.body;
    let foundedHall = await findByIdAndUpdate({model:hallModel , condition: hallId , data: newName,newDesc} = {})
    if (foundedHall) {
        res.status(200).json({ message: "hall Updated" })
    } else {
        next(new Error("hall not found", { cause: 404 }));
    }
})