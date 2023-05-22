
import reservationModel from '../../../../DB/model/reservation.model.js';
import userModel from '../../../../DB/model/user.model.js';
import { asyncHandler } from '../../../services/asyncHandler.js';
import cloudinary from "../../../services/cloudinary.js";
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';
import hallModel from '../../../../DB/model/hall.model.js';
import { sendEmail } from '../../../services/email.js'

const reservationsPopulate = [
  {
    path: "hallId",

  },
];
const userPopulate = [
  {
    path: "createdBy",

  },
];
export const addReservation = asyncHandler(async (req, res, next) => {
  let needs
  if (req.body.whatDoYouNeed) {
    needs = req.body.whatDoYouNeed.split(',')

  }
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: "reservation"
    })
    req.body.reservationFile = secure_url
    req.body.reservationFileId = public_id
  }

  let { email, AdministrationName, members, date, encounterType, hallId, encounterTime, whatDoYouNeed, reservationFile, reservationFileId } = req.body;

  const newReservation = new reservationModel({ AdministrationName, members, date, encounterType, hallId, encounterTime, needs, reservationFile, reservationFileId, createdBy: req.user._id });

  const addReservation = await newReservation.save();
  if (addReservation) {

    let updatedUser = await findByIdAndUpdate({
      model: userModel,
      condition: req.user._id,
      data: {
        $addToSet: { reservations: addReservation._id },
      },
      options: { new: true },
    });
    if (updatedUser) {
      let updatedHall = await findByIdAndUpdate({
        model: hallModel,
        condition: hallId,
        data: {
          $addToSet: { reservations: addReservation._id },
        },
        options: { new: true },
      });
      if (updatedHall) {

        let message = `

          <p>
          اسم الادارة :
          <span>${AdministrationName}</span>
        </p>
        <br>
        <p>
          التاريخ :
          <span>${date}</span>
        </p>
        <br>
        <p class="">
          الوقت :
          <span>${encounterTime}</span>
        </p>
        <br>
        <p>
          عدد الحاضرين :
          <span>${members}</span>
        </p>
        <br>
        <p>
          المناسبة :
          <span>${encounterType}</span>
        </p>
        <br>
        <p>
        جار مراجعة طلبك وسيتم الرد عليك في اقرب وقت
        </p>

                            `
        let emailRes = await sendEmail(email, "Saudi Ministry of Education", message);
        res.status(200).json({ message: "Reservation added" })
      }
    }

  }

})

export const getAllReservation = asyncHandler(async (req, res, next) => {
  let allReservation = await find({ model: reservationModel, populate: [...reservationsPopulate] })

  if (allReservation) {
    res.status(200).json({ allReservations: allReservation })
  }
})
export const UnapprovedReservation = asyncHandler(async (req, res, next) => {
  let { _id } = req.params
  let ApprovedReservation = await findByIdAndUpdate({ model: reservationModel, condition: { _id }, data: { status: 'Unapproved' }, options: { new: true } })
  if (ApprovedReservation) {
    res.status(200).json({ message: 'Unapproved' })
  }
})
export const ApprovedReservation = asyncHandler(async (req, res, next) => {
  let { _id } = req.params

  let ApprovedReservation = await findByIdAndUpdate({ model: reservationModel, condition: { _id }, data: { status: 'Approved' }, options: { new: true } })
  if (ApprovedReservation) {
    res.status(200).json({ message: 'Approved' })
  }
})
export const OnHoldReservation = asyncHandler(async (req, res, next) => {
  let { _id } = req.params
  let ApprovedReservation = await findByIdAndUpdate({ model: reservationModel, condition: { _id }, data: { status: 'On hold' }, options: { new: true } })
  if (ApprovedReservation) {
    res.status(200).json({ message: 'on hold' })
  }
})
export const CancelReservation = asyncHandler(async (req, res, next) => {
  let { _id } = req.params
  let removeReservation = await findByIdAndDelete({ model: reservationModel, condition: { _id } })
  if (removeReservation) {
    let updatedHall = await findByIdAndUpdate({
      model: hallModel,
      condition: removeReservation.hallId,
      data: {
        $pull: { reservations: removeReservation._id },
      },
      options: { new: true },
    });
    if (updatedHall) {
      let updatedUser = await findByIdAndUpdate({
        model: userModel,
        condition: req.user._id,
        data: {
          $pull: { reservations: removeReservation._id },
        },
        options: { new: true },
      });
      if (updatedUser) {
        res.status(200).json({ message: 'Canceled' })

      }
    }
  }
})



export const sendUnapproved = asyncHandler(async (req, res, next) => {
  let { id } = req.body
  let reservation = await findById({ model: reservationModel, condition: { _id: id }, populate: [...userPopulate] })
  let email = reservation.createdBy.email


  let message = `Your Reservation Is Unapproved`
  // let message = `please verify your email <a href="${link}" > here </a>
  //                         <br/>
  //                         to resend please click <a href="${refreshLink}" > here </a>
  //                         `
  let emailRes = await sendEmail(email, "Saudi Ministry of Education", message);
  if (emailRes.accepted.length) {

    res.status(201).json({ message: "sended" })
  } else {
    next(new Error("invalid email", { cause: 404 }))
  }
})
export const sendApproved = asyncHandler(async (req, res, next) => {
  let { id } = req.body
  let reservation = await findById({ model: reservationModel, condition: { _id: id }, populate: [...userPopulate] })
  let email = reservation.createdBy.email

  let message = `Your Reservation Is Approved`

  // let message = `please verify your email <a href="${link}" > here </a>
  //                         <br/>
  //                         to resend please click <a href="${refreshLink}" > here </a>
  //                         `
  let emailRes = await sendEmail(email, "Saudi Ministry of Education", message);
  if (emailRes.accepted.length) {

    res.status(201).json({ message: "sended" })
  } else {
    next(new Error("invalid email", { cause: 404 }))
  }
})

