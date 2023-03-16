import { Schema, model, Types } from "mongoose";
import bcrypt from 'bcrypt'
import { string } from "joi";

const reservationSchema = new Schema({

    AdministrationName: {
        type: String,
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char'],
        required: [true, ' Administration Name is required'],

    },
    members: {
        type: Number,
        required: [true, ' Members is required'],

    },
    date: {
        type: Date,
        required: [true, 'Date is required'],

    },
    encounterType: {
        type: String,
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char'],
        required: [true, ' Type is required'],

    },
    hallId: {
        type:Types.ObjectId,
        ref:"Hall",
        required: [true, ' hallId is required'],
    },
    encounterTime: {
        type: String,
        required: [true, ' Encounter Time is required'],

    },
    file: {
        type: String,
    },
}, {
    timestamps: true
})

const reservationModel = model('Reservation', reservationSchema);
export default reservationModel