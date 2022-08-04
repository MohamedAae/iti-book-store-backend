const express = require("express"),
  router = express.Router(),
  Category = require("./category.model"),
  helpers = require("../../helpers/api.js");


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

module.exports = router;

