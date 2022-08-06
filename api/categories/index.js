const express = require("express"),
  router = express.Router(),
  Category = require("./category.model"),
  helpers = require("../../helpers/api.js"),
  {ObjectId} = require('mongodb');
  

  router.get("/", async (req, res, next) => {
    let categories;
    try {
      categories = await Category.find();
      return res.status(201).json({
        success: true,
        code: 201,
        categories: categories,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  });

  router.post("/", async (req, res, next) => {
    const data = req.body,
      category = new Category(data);
  
    try {
      const saved = await category.save();
      return res.status(201).json({
        success: true,
        code: 201,
        category: saved,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  });

  router.get("/:id",async(req,res,next)=>{
    const id = req.params.id
    try{
        const category = await Category.findById(id);
        return res.status(201).json({
            success: true,
        code: 201,
        category: category,
        })
    }catch(err){
        return helpers.handleError(err, res);
    }
  })

  router.get("/category-products/:id",async(req,res,next)=>{
    const id = req.params.id
    try{
        const category = await Category.aggregate(
          [
            {
              '$match': {
                '_id': new ObjectId(id)
              }
            }, {
              '$lookup': {
                'from': 'products', 
                'localField': '_id', 
                'foreignField': 'categoryId', 
                'as': 'category'
              }
            }
          ]
        
        )
        return res.status(201).json({
        success: true,
        code: 201,
        category: category[0].category,
        })
    }catch(err){
        return helpers.handleError(err, res);
    }
  })


module.exports = router;

