import multer from "multer";

export const fileValidation = {
    type: ['image/png', 'image/jpeg', 'image/jif', 'image/webp', 'application/pdf'],
}
export const HME = (err, req, res, next) => {
    if (err) {
        res.json({ message: "multer error message", err: err });
    } else {
        next();
    }
};

export function myMulter(customValidation = fileValidation.type) {

    const storage = multer.diskStorage({})


    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {

            cb(null, true)
        } else {
            cb('invalid format', false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}
