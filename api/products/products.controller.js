const    Product         = require("./proudcts.model"),
         helpers         = require("../../helpers/api.js"),
         mongoose        = require("mongoose");

const Controller = {
    get: async (req, res, next) => {
        let products;
        try {
            products = await Product.find();
            return res.status(201).json({
                success: true,
                code: 201,
                products: products,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    create: async (req, res, next) => {
        const data = req.body,
            product = new Product(data);
    
    
        try {
            const saved = await product.save();
            return res.status(201).json({
                success: true,
                code: 201,
                product: saved,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    getById:  async (req, res, next) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id).populate('categoryId');
            return res.status(201).json({
                success: true,
                code: 201,
                product,
            })
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    fillter :async (req, res, next) => {
        let bestSellerBooks;
        try {
            bestSellerBooks = await Product.find().sort({rating:-1}).limit(9);
            return res.status(201).json({
                success: true,
                code: 201,
                bestSellerBooks: bestSellerBooks,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    }
}



module.exports = Controller;
