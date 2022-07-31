const express   = require('express'),
    router      = express.Router(),
    Product     = require('./proudcts.model');

router.get('/', (req, res, next) => {
    return res.status(201).json({
        success : true,
        code    : 201,
        message : `Success`,
    })
})

router.post('/', async (req, res, next) => {
    const data = req.body,
        product = new Product(data);

    try {
        const saved = await product.save();
        return res.status(201).json({
            success : true,
            code    : 201,
            product : saved,
        });
    } catch(err) {
        return res.status(500).json({
            success : false,
            code    : 500,
            error   : `${err.toString()}`,
        });
    }
})

module.exports = router;
