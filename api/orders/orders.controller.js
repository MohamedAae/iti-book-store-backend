const mongoose = require("mongoose");
const Order = require("./orders.model");
const Product = require("../products/proudcts.model");
const stripe = require("stripe")('sk_test_51LXfVgKUWh2HHgQz865R6dTUCxRzvZAiDmaAp620Cmv600iW3MS6EBBKsbFOBUL5mKI3fyIMzy13e7UjXyunf4Hs00oj09k3Rp');
const helpers = require("../../helpers/api.js");
const DOMAIN = process.env.DOMAIN;

const Controller = {
    createPaymentIntent: async (req, res) => {
        const {items} = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    },

    get: async (req, res, next) => {
        let orders, count;

        const options = {},
            categoryId = req.query.categoryId ? options["categoryId"] = {$in: req.query.categoryId} : false,
            discountRate = Number(req.query.dr) ? options["discountrate"] = req.query.dr / 100 : false,
            filterBase = req.query.filter ? req.query.filter : "",
            filterDirection = req.query.dir ? req.query.dir : "",
            filterOptions = filterBase ? {[filterBase]: filterDirection} : {},
            limit = req.query.pageSize, page = req.query.page - 1,
            skip = limit * page;

        try {
            orders = await Order.find(options).sort(filterOptions).limit(limit).skip(skip).populate('items').populate('userId');
            count = await Order.count(options);
            return res.status(201).json({
                success: true, code: 201, orders: orders, count: count,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    create: async (req, res, next) => {
        console.log(req);
        const data = req.body;
        data.date = new Date();
        data.items = getOrderObjectIds(JSON.parse(data.items));

        const order = new Order(data);
        try {
            const saved = await order.save();

            return res.status(201).json({
                success: true, code: 201, orderId: saved._id,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    // getById: async (req, res, next) => {
    //     const id = req.params.id;
    //     try {
    //         const product = await Product.findById(id).populate("categoryId");
    //         return res.status(201).json({
    //             success: true,
    //             code: 201,
    //             product,
    //         });
    //     } catch (err) {
    //         return helpers.handleError(err, res);
    //     }
    // },
    //
    // edit: async (req, res, next) => {
    //     const id = req.params.id,
    //         update = req.body;
    //
    //     try {
    //         const updated = await Product.findOneAndUpdate({ _id: id }, update);
    //         return res.status(201).json({
    //             success: true,
    //             code: 201,
    //             product: updated,
    //         });
    //     } catch (err) {
    //         return helpers.handleError(err, res);
    //     }
    // },
    //
    // fillter: async (req, res, next) => {
    //     let bestSellerBooks;
    //     try {
    //         bestSellerBooks = await Product.find()
    //             .sort({ rating: -1 })
    //             .limit(9)
    //             .populate("categoryId");
    //         return res.status(201).json({
    //             success: true,
    //             code: 201,
    //             bestSellerBooks: bestSellerBooks,
    //         });
    //     } catch (err) {
    //         return helpers.handleError(err, res);
    //     }
    // },
    //
    // discount: async (req, res, next) => {
    //     const rate = req.params.rate;
    //     let discontbook;
    //     try {
    //         discontbook = await Product.find({ discountrate: rate / 100 }).limit(14);
    //         return res.status(201).json({
    //             success: true,
    //             code: 201,
    //             discontbook: discontbook,
    //         });
    //     } catch (err) {
    //         return helpers.handleError(err, res);
    //     }
    // },
    //
    // delete: async (req, res, next) => {
    //     const id = req.params.id;
    //
    //     try {
    //         const deleted = await Product.deleteOne({_id: id});
    //         return res.status(201).json({
    //             success: true,
    //             code: 201,
    //             id: id,
    //         });
    //     } catch (err) {
    //         return helpers.handleError(err, res);
    //     }
    // },
};

const calculateOrderAmount = (items, totalPrice) => {
    let total = 0;
    items.map((item) => {
        const itemPrice = +item.price * +item.quantity;
        total += Math.ceil(itemPrice);
    });
    // console.log(total === +totalPrice);
    console.log(total);
    return total ? total * 100 : 1400;
};

const getOrderObjectIds = (items) => {
    const itemsIds = [];
    items.map(async item => {
        try {
            await reduceStock(item._id, item.quantity);
            itemsIds.push(item._id);
        } catch (err) {
            return helpers.handleError(err, res);
        }
    })

    return itemsIds;
}

const reduceStock = async (productId, quantity) => {
    try {
        const product = await Product.updateOne({_id: productId}, {$inc: {"stock": -quantity}});
        return;
    } catch (err) {
        return helpers.handleError(err, res);
    }
}

module.exports = Controller;