import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        brokerage: {
            type: Number,
            required: false
        },
        bathrooms: {
            type: Number,
            required: true
        },
        bedrooms: {
            type: Number,
            required: true
        },
        furnished: {
            type: String,
            enum: ['Unfurnished', 'Semi-Furnished', 'Furnished'],
            required: true
        },
        parking: {
            type: Boolean,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['Apartment', 'House', 'Commercial']
        },
        available: {
            type: Boolean,
            required: true
        },
        listedFor: {
            type: String,
            required: true,
            enum: ['Rent', 'Sale']
        },
        images: {
            type:Array,
            file: { type: Buffer, required: true },
            filename: { type: String, required: true },
            contentType: { type: String, required: true },
        },
        user: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;