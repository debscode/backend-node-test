import { Router } from 'express';
import { getProducts, createProduct, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { checkToken } from "../middlewares/authentication";

const router = Router();

router.get('/products', checkToken, getProducts);
router.get('/products/:id', checkToken, getProduct);
router.post('/products', checkToken, createProduct);
router.put('/products/:id', checkToken, updateProduct);
router.delete('/products/:id', checkToken, deleteProduct);

export default router;