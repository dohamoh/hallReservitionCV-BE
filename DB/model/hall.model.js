import { Schema } from "mongoose";

const hallSchema = new Schema({
    title: { type: String, required: [true, 'userName is required'], max: [50, 'max length 50 char'] },
    desc: {type:String},
    hallImg: {}
})