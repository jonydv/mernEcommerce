import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@ Desc fetch All products
//@route Get /api/products
//@acces Public route

const getProducts = asyncHandler(async(req, res) => {
    
    const pageSize = 10;

    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({...keyword})
    const products = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page-1));

    res.json({products, page, pages: Math.ceil(count / pageSize)});
});

   //@ Desc fetch single product
//@route Get /api/products/:id
//@acces Public route
const getProductsById = asyncHandler(async(req, res) => {

    const product = await Product.findById(req.params.id);

    if(product) {
        res.json(product);
        
    } else{
        
        res.status(404)
        throw new Error('Product not found');
    }
});

//@ Desc Delete a product
//@route DELETE /api/products/:id
//@acces Private admin route
const deleteProduct = asyncHandler(async(req, res) => {

    const product = await Product.findById(req.params.id);

    if(product) {
        await product.remove();
        res.json({message: 'Product removed'});
        
    } else{
        
        res.status(404)
        throw new Error('Product not found');
    }
});

//@ Desc Create a product
//@route POST /api/products
//@acces Private admin route
const createProduct = asyncHandler(async(req, res) => {

 const product = new Product ({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
 });

 const createdProduct = await product.save();
 res.status(201).json(createdProduct)

});

//@ Desc Update a product
//@route PUT /api/products/:id
//@acces Private admin route
const updateProduct = asyncHandler(async(req, res) => {
    const {
            name, 
            price, 
            description, 
            image, 
            brand, 
            category, 
            countInStock} = req.body;
    
    const product = await Product.findById(req.params.id);

    if(product){
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct)
    }else{
        res.status(404);
        throw new Error ('Product not found')
    }

   
   });

//@ Desc Create a new review
//@route POST /api/products/:id/reviews
//@acces Private route
   const createProductReview = asyncHandler(async(req, res) => {
    const {
            rating,
            comment
            } = req.body;
    
    const product = await Product.findById(req.params.id);

    if(product){
       const alreadyReviewed = product.reviews.find(
           r => r.user.toString() === req.user._id.toString());
        if(alreadyReviewed){
            res.status(400);
            throw new Error('Productr already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review); 

        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, item) => Number(item.rating) + Number(acc), 0) / product.reviews.length;
        console.log(product.rating);
        await product.save();
        res.status(201).json({message: 'Review added'});
    }else{
        res.status(404);
        throw new Error ('Product not found')
    }

   
   });

   //@ Desc Get top rated products
   //@route POST /api/products/top
    //@acces Public
const getTopProducts = asyncHandler(async(req, res) => {
  
    const products = await Product.find({}).sort({rating: -1}).limit(3);

    res.json(products);

   
   });

export {
    getProducts, 
    getProductsById, 
    deleteProduct, 
    createProduct, 
    updateProduct, 
    createProductReview,
    getTopProducts
};