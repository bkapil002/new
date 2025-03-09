const express = require('express');
const Product  =  require('../Model/Product')
const router = express.Router();
const cloudinary = require('../config/cloudinary')
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() });

router.post('/uploadProduct',upload.array('images', 5),async(req , res)=>{
   try{
    const{name , brand ,features, category , sellingPrice , price   , details, size} = req.body;

    const parsedFeatures = JSON.parse(features);
    const parsedSize = JSON.parse(size);

    if (!name || !brand || !category || !sellingPrice || !price ) {
        return res.status(400).json({ success: false, message: 'All required fields must be provided' });
      }
 
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Images are required' });
      }

      const imageUrls = [];
      for (const file of req.files) {
        try {
          const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          const result = await cloudinary.uploader.upload(base64Image, { folder: 'products' });
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          return res.status(500).json({ error: 'Failed to upload image' });
        }
      }
    const product = new Product({
        name,
        brand,
        price,
        sellingPrice,
        category,
        details,
        features:parsedFeatures,
        imageUrls,
        size: parsedSize,
      });

      await product.save();
      res.status(201).json(product);
   }catch(error){
     res.status(500).json({error: error.message})
   }
} )


router.put("/updateProduct/:id", upload.array('images', 5),async(req , res)=>{
    try{
        const{name , brand , category , sellingPrice , price, features, details,size} = req.body;
         const product =  await Product.findById(req.params.id)

         if (!product) {
             return res.status(404).json({ success: false, message: 'Product not found' });
         }

         product.name = name;
         product.brand = brand;
         product.price = price;
         product.sellingPrice = sellingPrice;
         product.category = category;
         product.details = details;
         product.features =  JSON.parse(features);
         product.size = JSON.parse(features);

         if (req.files && req.files.length > 0) {
          const newImageUrls = [];
          for (const file of req.files) {
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(base64Image, { folder: 'products' });
            newImageUrls.push(result.secure_url);
          }
          product.imageUrls = newImageUrls;
        }

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



