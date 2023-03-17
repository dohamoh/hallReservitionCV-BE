import cloudinary from "../../../services/cloudinary.js";
import hallModel from "../../../../DB/model/hall.model.js"
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';

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
    console.log(hallExist);
    if (!hallExist) {
        const newHall = new hallModel({ hallName, hallDesc, hallImg, hallImgId, hallAttendees });
        if (newHall) {
            const addHall = await newHall.save();
            res.status(200).json({ message: "hall added" })
        }
    } else {
        next(new Error("hall already exists", { cause: 404 }));
    }
})
export const updateHall = asyncHandler(async (req, res, next) => {
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
        let updateHall = await findByIdAndUpdate({ model: hallModel, condition: hallId, data: { title:newName, desc:newDesc , hallImg:hallImg, hallImgId:hallImgId,attendeesNum: attendees } } = {})
        // if (updateHall) {
            res.status(200).json({ message: "hall Updated" })
        // }
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

export const getHalls = asyncHandler(async (req, res, next) => {
  console.log('g');
  const halls = await find({ model: hallModel })
  console.log(halls);
  if (halls) {
      res.status(200).json({ message: "halls", halls })

  } else {
      next(new Error("halls not found", { cause: 404 }))

  }
})
