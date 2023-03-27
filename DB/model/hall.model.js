import { model, Schema,Types } from "mongoose";

const hallSchema = new Schema({
    hallName: { type: String, required: [true, 'hallName is required'], max: [50, 'max length 50 char'] },
    hallDesc: {type:String},
    hallImg: {type:String},
    hallImgId: {type:String},
    hallAttendees: {type:String},
    reservations: [{
      type: Types.ObjectId,
      ref: "Reservation",
  }]
})

const hallModel = model('hall' , hallSchema);
export default hallModel
