import { Schema, model, Document } from 'mongoose';

export interface ICount extends Document {
    create: number,
    update: number,
    delete: number
}

const countSchema = new Schema<ICount>({
    create: {
        type: Number,
        required: false,
        default: 0
    },
    update: {
        type: Number,
        required: false,
        default: 0
    },
    delete: {
        type: Number,
        required: false,
        default: 0
    },
})

const CountModel = model<ICount>('Count', countSchema);

export default CountModel;