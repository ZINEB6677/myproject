// ============================================================
// Order Model - MongoDB Schema
// ============================================================

import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOrderBook {
    bookId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
}

export interface IShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    books: IOrderBook[];
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentIntentId: string;
    shippingAddress: IShippingAddress;
    createdAt: Date;
    updatedAt: Date;
}

const OrderBookSchema = new Schema<IOrderBook>({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        books: [OrderBookSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        paymentIntentId: {
            type: String,
            required: true,
        },
        shippingAddress: {
            type: ShippingAddressSchema,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ paymentStatus: 1 });

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
