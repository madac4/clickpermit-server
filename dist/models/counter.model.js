"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSequence = void 0;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});
const Counter = (0, mongoose_1.model)('Counter', counterSchema);
const getNextSequence = async (name) => {
    const counter = await Counter.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};
exports.getNextSequence = getNextSequence;
exports.default = Counter;
