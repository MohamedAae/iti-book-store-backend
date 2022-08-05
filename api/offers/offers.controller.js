const Offer = require("./offers.model"),
    helpers = require("../../helpers/api.js");

const Controller = {
    get: async (req, res, next) => {
        try {
            const offers = await Offer.find();
            return res.status(201).json({
                success : true,
                code    : 201,
                offers,
            })
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    create: async (req, res, next) => {
        const data  = req.body,
            offer   = new Offer(data);
        try {
            const saved = await offer.save();
            return res.status(201).json({
                success : true,
                code    : 201,
                offer   : saved,
            })
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    edit: async (req, res, next) => {
        const id    = req.params.id,
            update  = req.body;

        try {
            const updated = await Offer.findOneAndUpdate({_id: id}, update);
            return res.status(201).json({
                success : true,
                code    : 201,
                offer   : updated,
            })
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },
}

module.exports = Controller;
