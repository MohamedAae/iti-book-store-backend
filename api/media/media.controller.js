const cloudinary = require("cloudinary");
const CLOUDINARY = process.env.CLOUDINARY;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const helpers = require("../../helpers/api.js");

cloudinary.config({
    cloud_name: CLOUDINARY,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET
});

const Controller = {
    upload: async (req, res, next) => {
        let imageUrl;
        const image = req.file;
        try {
            await cloudinary.v2.uploader.upload(image.path, {public_id: image.originalname.replace(/\.[^/.]+$/, "")}, function (error, result) {
                imageUrl = result.secure_url;
            });

            return res.status(201).json({
                success: true, code: 201, imageUrl
            });
        } catch (e) {
            return helpers.handleError(`Error uploading the image`, res);
        }
    },
}

module.exports = Controller;
