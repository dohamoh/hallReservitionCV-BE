import { asyncHandler } from '../../../services/asyncHandler.js';
import cloudinary from "../../../services/cloudinary.js";

export const addReservation = asyncHandler(async (req, res, next) => {
console.log(res.file);
console.log(res.download(req.file.originalname));
//    const fileURL =res.download("uploads/Resume.pdf");
//    console.log(fileURL);
    // if (req.file) {
    //     let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    //         folder: "reservation"
    //     })
    //     console.log(secure_url, public_id );
    //     req.body.storeImage = secure_url
    //     req.body.storeImageId = public_id
    // }
})