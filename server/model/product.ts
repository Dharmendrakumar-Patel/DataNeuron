import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    image?: string;
    quantity?: number;
    published?: boolean;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: "https://res.cloudinary.com/dvgp7oeov/image/upload/v1715855052/Images/product.png"
    },
    quantity: {
        type: Number,
        required: false,
        default: 0
    },
    published: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
})

const ProductModel = model<IProduct>('Product', productSchema);

export default ProductModel;