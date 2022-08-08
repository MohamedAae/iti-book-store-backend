const   helpers = require("../../helpers/api.js"),
        mongoose = require("mongoose"),
        Reviews = require("../reviews/reviews.model");


const Controller ={
    get:async (req,res,next)=>{
        try{
            const reviews=await Reviews.find()
            return res.status(201).json({
                success: true,
                code: 201,
                reviews: reviews
      });
        }catch(err){
          return  helpers.handleError(err,res)
        }
    }

}

module.exports=Controller