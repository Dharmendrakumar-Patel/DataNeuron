import { Request, Response } from 'express';
import ProductModel, { IProduct } from '../model/product';
import { uploadProductImage } from '../middleware/multer';
import { removeImages } from '../utils/removeImage';
import CountModel from '../model/count';

export const getProduct = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find();
        const count = await CountModel.findOne()

        res.status(200).json({ message: 'Products fetched successfully', data: products, count: count });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        uploadProductImage.any()(req, res, async (err: any) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            const { name, description }: IProduct = req.body;

            if (!name || !description) {
                return res.status(400).json({ error: 'Name and Description are required.' });
            }

            let product: IProduct | null;
            //@ts-ignore
            const imagePath = req.files?.length ? (req.files[0].path.replace(/\\/g, '/')) : '';

            product = await ProductModel.create({
                ...req.body,
                image: imagePath,
            });

            if (product) {
                const oldCount = await CountModel.findOne();
                if (oldCount) {
                    await CountModel.findByIdAndUpdate(oldCount._id, { $inc: { create: 1 } });
                } else {
                    await CountModel.create({ create: 1 });
                }
            }

            res.status(201).json({ message: 'Product created successfully', data: product });
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        uploadProductImage.any()(req, res, async (err: any) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            const productId = req.params.id;
            const oldProduct = await ProductModel.findById(productId);

            if (!oldProduct) {
                return res.status(404).json({ error: 'Product not found.' });
            }

            let imagePath = oldProduct.image;
            if (req.files?.length) {
                //@ts-ignore
                imagePath = req.files[0].path.replace(/\\/g, '/');
                if (oldProduct.image) {
                    await removeImages(oldProduct.image);
                }
            }

            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {
                ...req.body,
                image: imagePath,
            }, { new: true });

            if (updatedProduct) {
                const oldCount = await CountModel.findOne();
                if (oldCount) {
                    await CountModel.findByIdAndUpdate(oldCount._id, { $inc: { update: 1 } });
                }
            }

            res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const oldProduct = await ProductModel.findById(productId);

        if (!oldProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        if (oldProduct.image && oldProduct.image !== 'https://res.cloudinary.com/dvgp7oeov/image/upload/v1715855052/Images/product.png') {
            await removeImages(oldProduct.image);
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(productId);

        if (deletedProduct) {
            const oldCount = await CountModel.findOne();
            if (oldCount) {
                await CountModel.findByIdAndUpdate(oldCount._id, { $inc: { delete: 1 } });
            }
        }

        res.status(200).json({ message: 'Product deleted successfully', data: deletedProduct});
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};
