import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from '../entity/Product';
import { validate } from "class-validator";

/**
 * Get all products
 * @param req Request
 * @param res Response
 */
export const getProducts = async (req: any, res: Response): Promise<void> => {

    return req.redis.get('products', async (error, dataRedis) => {
        console.log(error);
        console.log(dataRedis);
        if (dataRedis) {
            console.log("redis!!");
            const objRedis = JSON.parse(dataRedis);
            return res.json({
                status: "success",
                data: objRedis,
                count: objRedis.length
            });
        }
        const [data, count] = await getRepository(Product).findAndCount();
        if (data.length) {
            console.log("postgres!!");
            req.redis.set('products', JSON.stringify(data));
            return res.json({
                status: "success",
                data,
                count
            });
        }
        return res.status(404).json({
            status: "error",
            message: "Products not found"
        });
    });
};

/**
 * Get product by id
 * @param req Request
 * @param res Response
 */
export const getProduct = async (req: any, res: Response): Promise<Response> => {
    return req.redis.get(`product_${req.params.id}`, async (error, dataRedis) => {
        console.log(error);
        console.log(dataRedis);
        if (dataRedis) {
            console.log("redis!!");
            const objRedis = JSON.parse(dataRedis);
            return res.json({
                status: "success",
                data: objRedis,                
            });
        }
        const data = await getRepository(Product).findOne(req.params.id);
        if (data) {
            console.log("postgres!!");
            req.redis.set(`product_${req.params.id}`, JSON.stringify(data));
            return res.json({
                status: "success",
                data
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "Product not found"
            });
        }
    });
};

/**
 * Create a product
 * @param req Request
 * @param res Response
 */
export const createProduct = async (req: any, res: Response): Promise<Response> => {
    let product = new Product();
    getRepository(Product).merge(product, req.body);
    validate(product).then(errors => {
        if (errors.length > 0) {
            return res.status(400).json({
                status: "error",
                message: `${errors}`
            });
        }
    });
    let data;
    try {
        const newProduct = getRepository(Product).create(req.body);
        data = await getRepository(Product).save(newProduct);
        req.redis.set('products', '');
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error
        });
    }
    return res.status(201).json({
        status: "success",
        data
    });
};

/**
 * Update a product
 * @param req Request
 * @param res Response
 */
export const updateProduct = async (req: any, res: Response): Promise<Response> => {
    const product = await getRepository(Product).findOne(req.params.id);
    if (product) {
        try {
            validate(product).then(errors => {
                if (errors.length > 0) {
                    return res.status(400).json({
                        status: "error",
                        message: `${errors}`
                    });
                }
            });
            getRepository(Product).merge(product, req.body);
            const data = await getRepository(Product).save(product);
            req.redis.set('products', '');
            req.redis.set(`product_${data.id}`, '');
            return res.json({
                status: "success",
                data
            });
        } catch (error) {
            return res.status(400).json({
                status: "error",
                message: `${error}`
            });
        }
    }
    return res.status(404).json({
        status: "error",
        message: "Product not found"
    });
};

/**
 * Delete a product
 * @param req Request
 * @param res Response
 */
export const deleteProduct = async (req: any, res: Response): Promise<Response> => {
    const productRepository = getRepository(Product);
    let product: Product;
    try {
        product = await productRepository.findOneOrFail(req.params.id);
    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: "Product not found"
        });
    }
    const data = productRepository.delete(req.params.id);
    req.redis.set('products', '');
    req.redis.set(`product_${req.params.id}`, '');
    return res.json({
        status: "success",
        data
    });
};