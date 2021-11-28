import express from 'express';
import products from './api/products/productsController';
const router = express.Router();

router.use('/products', products);

export default router;