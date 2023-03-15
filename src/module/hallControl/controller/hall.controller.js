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