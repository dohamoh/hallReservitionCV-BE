
import { Schema, model, Types } from "mongoose";

const reservationSchema = new Schema({

  AdministrationName: {
    type: String,
    min: [2, 'minimum length 2 char'],
    max: [20, 'max length 20 char'],
    required: [true, ' Administration Name is required'],
  },
  reservationFile: {
    type: String,
  },

  reservationFileId: {
    type: String,
  },

  members: {
    type: Number,
    required: [true, ' Members is required'],
  },

  date: {
    type: String,
    required: [true, 'Date is required'],
  },

  encounterType: {
    type: String,
    min: [2, 'minimum length 2 char'],
    max: [20, 'max length 20 char'],
    required: [true, ' Type is required'],
  },

  hallId: {
    type: Types.ObjectId,
    ref: "hall",
    required: [true, ' hallId is required'],
  },

  encounterTime: {
    type: String,
    required: [true, ' Encounter Time is required'],
  },

  status: {
    type: String,
    required: true,
    default:'On hold',
    enum: ['Approved','On hold','Unapproved']
},

createdBy: {
  type: Types.ObjectId,
  ref: "User"
},
needs: {
  type: [String],
},
}, {
  timestamps: true
})

const reservationModel = model('Reservation', reservationSchema);
export default reservationModel
