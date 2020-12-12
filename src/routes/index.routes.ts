import express from 'express';
import productRoutes from './product.routes';
import userRoutes from './user.routes';

const app = express();

app.use(productRoutes);
app.use(userRoutes);


export default app;