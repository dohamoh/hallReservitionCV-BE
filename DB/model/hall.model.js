import { model, Schema } from "mongoose";

const hallSchema = new Schema({
    hallName: { type: String, required: [true, 'hallName is required'], max: [50, 'max length 50 char'] },
    hallDesc: {type:String},
    hallImg: {type:String},
    hallImgId: {type:String},
    hallAttendees: {type:Number}
})

const hallModel = model('hall' , hallSchema);
export default hallModel