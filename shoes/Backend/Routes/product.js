const express = require('express');
const Product  =  require('../Model/Product')
const router = express.Router();


router.post('/uploadProduct',async(req , res)=>{
   try{
    const{name , brand , category , sellingPrice , currentPrice   , details} = req.body;

    if (!name || !brand || !category || !sellingPrice || !currentPrice ) {
        return res.status(400).json({ success: false, message: 'All required fields must be provided' });
      }

    const product = new Product({
        name,
        brand,
        currentPrice,
        sellingPrice,
        category,
        details,
      });

      await product.save();
      res.status(201).json(product);
   }catch(error){
     res.status(500).json({error: error.message})
   }
} )


router.put("/updateProduct/:id",async(req , res)=>{
    try{
        const{name , brand , category , sellingPrice , currentPrice   , details} = req.body;
         const product =  await Product.findById(req.params.id)

         if (!product) {
             return res.status(404).json({ success: false, message: 'Product not found' });
         }

         product.name = name;
         product.brand = brand;
         product.currentPrice = currentPrice;
         product.sellingPrice = sellingPrice;
         product.category = category;
         product.details = details;

         await product.save();
         res.status(200).json(product);
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

router.delete('/deleteProduct/:id',async(req,res)=>{
    try{
      const product = await Product.findById(req.params.id)

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      await Product.deleteOne({_id: req.params.id})
      res.status(200).json({message:'Product delete successfully'})
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

router.get('/',async(req,res)=>{
    try{
        const products = await Product.find()
        res.json(products)
    }catch(error){
        res.status(500).json({error: error.message})
    }
})
module.exports = router;



