
import reservationModel from '../../../../DB/model/reservation.model.js';
import userModel from '../../../../DB/model/user.model.js';
import { asyncHandler } from '../../../services/asyncHandler.js';
import cloudinary from "../../../services/cloudinary.js";
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';

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
  let allReservation = await find({ model: reservationModel })
  if (allReservation) {
    res.status(200).json({ allReservation })
  }
})
export const cancelReservation = asyncHandler(async (req, res, next) => {
  let { _id } = req.params
  let cancelReservation = await findByIdAndDelete({ model: reservationModel, condition: { _id } })
  if (cancelReservation) {
    let updateUserReservations = await findByIdAndUpdate({ model: userModel, condition: { _id: cancelReservation.createdBy }, data: { $pull: { reservations: _id }, }, options: { new: true } })
    if (updateUserReservations) {
      res.status(200).json({ message: 'canceled' })
    }
  }
})
