const express = require('express')
const Order  = require('../Model/Order')
const Caert = require('../Model/Cart')
const Address = require('../Model/Address')
const {auth , adminAuth} = require('../middleware/auth')
const Cart = require('../Model/Cart')
const router = express.Router()

router.post('/', auth , async(req,res)=>{
    try {
         const cart = await Cart.findOne({user: req.user._id}).populate('products.product')

         if(!cart){
            return res.status(400).json({message: 'Cart is empty'})
        }

        const address = req.body.addressId
         ?await Address.findOne({_id: req.body.addressId , user: req.user._id})
         :await Address.findOne({user:req.user._id})

         if(!address){
            return res.status(400).json({message: 'Address not found'})
        }

        const orderProducts = cart.products.map(item =>({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            sellingPrice: item.product.sellingPrice,
             brand: item.product.brand,
            imageUrls: item.product.imageUrls, // Pass the array of image URLs
             name: item.product.name,
            features: item.product.features,
             details: item.product.details
        }))


        const totalAmount = orderProducts.reduce(
            (total,item) => total +(item.sellingPrice * item.quantity),0
        )

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        const order  = new Order({
            user:req.user._id,
            products:orderProducts,
            totalAmount,
            deliveryDate,
            shippingAddress:{
                houseNo:address.houseNo,
                landmark:address.landmark,
                areaPin:address.areaPin,
                name:address.name,
                state:address.state,
                phone:address.phone
            }
        })

        await order.save()
        cart.products = []
        await cart.save()
        res.json(order)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/user',auth,async(req,res)=>{
    try{
     const orders = await Order.find({user:req.user._id}).populate('products.product')
     res.status(200).json(orders)
    }catch(error){
        res.status(400).json({error: error.message})
    }
})


module.exports = router;