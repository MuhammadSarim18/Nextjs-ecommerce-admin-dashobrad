const { Schema, model, models } = require("mongoose");

const orderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    postalCode: String,
    city: String,
    streetAddress: String,
    contry: String,
    paid: Boolean,
}, {
    timestamps: true,
});

export const Order = models?.Order || model('Order', orderSchema)