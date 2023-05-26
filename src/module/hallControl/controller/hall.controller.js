import cloudinary from "../../../services/cloudinary.js";
import hallModel from "../../../../DB/model/hall.model.js"
import reservationModel from "../../../../DB/model/reservation.model.js"
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';
const reservationsPopulate = [
    {
        path: "reservations",

    },
];
export const addHall = asyncHandler(async (req, res, next) => {
    if (req.file) {
        let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "hallImages"
        })
        req.body.hallImg = secure_url
        req.body.hallImgId = public_id
    }
    let { hallImg, hallImgId, hallName, hallDesc, hallAttendees, } = req.body;
    let hallExist = await findOne({ model: hallModel, condition: { hallName } })

    if (!hallExist) {
        const newHall = new hallModel({ hallName, hallDesc, hallImg, hallImgId, hallAttendees });
        if (newHall) {
            const addHall = await newHall.save();
            res.status(200).json({ message: "hall added" })
        }
    } else {
        // next(new Error("hall already exists", { cause: 404 }));
        res.status(404).json({ message: "hall already exists" })
    }
})
export const updateHall = asyncHandler(async (req, res, next) => {
    console.log(req.file);
    if (req.file) {
        let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "hallImages"
        })
        req.body.hallImg = secure_url
        req.body.hallImgId = public_id
    }
    let { hallId } = req.params;
    let { newName, hallImg, hallImgId, newDesc, attendees } = req.body;
    let foundedHall = await findById({ model: hallModel, condition: hallId })
    if (foundedHall) {
        if (newDesc == 'null') {
            newDesc = foundedHall.hallDesc
        }
        if (newName == 'null') {
            newName = foundedHall.hallName
        }
        if (attendees == 'null') {
            attendees = foundedHall.hallAttendees
        }
        let updateHall = await findByIdAndUpdate({ model: hallModel, condition: hallId, data: { hallName: newName, hallDesc: newDesc, hallImg, hallImgId: hallImgId, hallAttendees: attendees } })
        if (!updateHall) {
            res.status(500).json({ message: "Couldn't Updated" })
        } else {
            if (hallImgId) {

                await cloudinary.uploader.destroy(updateHall.hallImgId)
            }
            res.status(200).json({ message: "Updated" })
        }
    } else {
        // next(new Error("hall not found", { cause: 404 }));
        res.status(404).json({ message: "hall not found" })
    }
})
export const deleteHall = asyncHandler(async (req, res, next) => {
    let { hallId } = req.params;
    let hall = await findByIdAndDelete({ model: hallModel, condition: hallId });
    if (!hall) {
        // next(new Error("hall not found", { cause: 404 }));
        res.status(404).json({ message: "hall not found" })
    } else {
        let reservations = await find({model: reservationModel , condition: {hallId}})
        for (let i = 0; i < reservations.length; i++) {
            const element = reservations[i];
            await findByIdAndDelete({model: reservationModel , condition: element._id})
        }
        res.status(200).json({ message: "deleted" })
    }
})

export const getHalls = asyncHandler(async (req, res, next) => {
    const halls = await find({ model: hallModel, populate: [...reservationsPopulate] })
    if (halls) {
        res.status(200).json({ message: "halls", halls })

    } else {
        // next(new Error("halls not found", { cause: 404 }))
        res.status(404).json({ message: "halls not found" })
    }
})
