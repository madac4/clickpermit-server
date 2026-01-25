"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const order_types_1 = require("../types/order.types");
const counter_model_1 = require("./counter.model");
const orderSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true, ref: 'User' },
    orderNumber: { type: String, unique: true, sparse: true },
    contact: { type: String, required: true },
    permitStartDate: { type: Date, required: true },
    truckId: { type: String, required: true, ref: 'Truck' },
    trailerId: { type: String, required: true, ref: 'Trailer' },
    moderatorId: { type: String, ref: 'User' },
    commodity: { type: String, required: true },
    loadDims: { type: String, required: true },
    lengthFt: { type: Number, required: true },
    lengthIn: { type: Number, required: true },
    widthFt: { type: Number, required: true },
    widthIn: { type: Number, required: true },
    heightFt: { type: Number, required: true },
    heightIn: { type: Number, required: true },
    rearOverhangFt: { type: Number, required: true },
    rearOverhangIn: { type: Number, required: true },
    makeModel: { type: String },
    serial: { type: String },
    singleMultiple: { type: String },
    legalWeight: { type: String, enum: ['yes', 'no'], required: true },
    originAddress: { type: String, required: true },
    destinationAddress: { type: String, required: true },
    stops: { type: [String], required: true },
    files: [
        {
            filename: { type: String, required: true },
            originalname: { type: String, required: true },
            contentType: { type: String, required: true },
            size: { type: Number, required: true },
        },
    ],
    status: {
        type: String,
        enum: Object.values(order_types_1.OrderStatus),
        default: order_types_1.OrderStatus.PENDING,
    },
    axleConfigs: {
        type: [
            {
                tires: { type: Number, required: true },
                tireWidth: { type: Number, required: true },
                weight: { type: Number, required: true },
                spacing: { type: String, required: false },
            },
        ],
    },
}, {
    timestamps: true,
});
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        try {
            const nextNumber = await (0, counter_model_1.getNextSequence)('orderNumber');
            const orderNumber = `ORD-${nextNumber.toString().padStart(6, '0')}`;
            this.orderNumber = orderNumber;
            next();
        }
        catch (error) {
            return next(new Error('Unable to generate order number: ' + error));
        }
    }
    else {
        next();
    }
});
const Order = (0, mongoose_1.model)('Order', orderSchema);
exports.default = Order;
