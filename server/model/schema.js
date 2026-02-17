import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PriceRecordSchema = new mongoose.Schema({
    storeId: { type: Schema.Types.ObjectId, ref: "storeId", required: true, index: true },
    sku: { type: String, required: true, index: true },
    productName: String,
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    country: String
});

module.exports = mongoose.model('PriceRecord', PriceRecordSchema);