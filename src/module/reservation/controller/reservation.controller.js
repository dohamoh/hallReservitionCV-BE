
import reservationModel from '../../../../DB/model/reservation.model.js';
import userModel from '../../../../DB/model/user.model.js';
import { asyncHandler } from '../../../services/asyncHandler.js';
import cloudinary from "../../../services/cloudinary.js";
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';
const reservationsPopulate = [
  {
      path: "hallId",

  },
];
export const addReservation = asyncHandler(async (req, res, next) => {
  console.log('g');
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: "reservation"
    })
    req.body.reservationFile = secure_url
    req.body.reservationFileId = public_id
  }

  let { AdministrationName, members, date, encounterType, hallId, encounterTime, whatDoYouNeed, reservationFile, reservationFileId } = req.body;

  const newReservation = new reservationModel({ AdministrationName, members, date, encounterType, hallId, encounterTime, whatDoYouNeed, reservationFile, reservationFileId, createdBy: req.user._id });

  const addReservation = await newReservation.save();
  if (addReservation) {

    let updated = await findByIdAndUpdate({
      model: userModel,
      condition: req.user._id,
      data: {
        $addToSet: { reservations: addReservation._id },
      },
      options: { new: true },
    });
    res.status(200).json({ message: "Reservation added" })
  }

})

export const getAllReservation = asyncHandler(async (req, res, next) => {
  let allReservation = await find({ model: reservationModel,populate:[...reservationsPopulate] })

  if (allReservation) {
    res.status(200).json({ allReservations:allReservation })
  }
})
export const UnapprovedReservation = asyncHandler(async (req, res, next) => {
  let { _id } = req.params
  let ApprovedReservation = await findByIdAndUpdate({ model: reservationModel, condition: { _id },data:{status:'Unapproved'},options:{new:true} })
  if (ApprovedReservation) {
      res.status(200).json({ message: 'Unapproved' })
  }
})
export const ApprovedReservation = asyncHandler(async (req, res, next) => {
  let { _id } = req.params
  let ApprovedReservation = await findByIdAndUpdate({ model: reservationModel, condition: { _id },data:{status:'Approved'},options:{new:true} })
  if (ApprovedReservation) {
      res.status(200).json({ message: 'Approved' })
  }
})
export const OnHoldReservation = asyncHandler(async (req, res, next) => {
  let { _id } = req.params
  let ApprovedReservation = await findByIdAndUpdate({ model: reservationModel, condition: { _id },data:{status:'On hold'},options:{new:true} })
  if (ApprovedReservation) {
      res.status(200).json({ message: 'on hold' })
  }
})
