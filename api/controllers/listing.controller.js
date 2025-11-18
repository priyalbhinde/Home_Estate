import Listing from '../models/listing.model.js'
import path from 'path';
import fs from 'fs';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try {
        const images = req.files.map(file => ({
            file: path.relative('api', file.path),
            filename: file.originalname,
            contentType: file.mimetype
        }));
        const listing = await Listing.create({
            "title": req.body.title,
            "description": req.body.description,
            "address": req.body.address,
            "city": req.body.city,
            "state": req.body.state,
            "price": req.body.price,
            "brokerage": req.body.brokerage,
            "bathrooms": req.body.bathrooms,
            "bedrooms": req.body.bedrooms,
            "furnished": req.body.furnished,
            "parking": req.body.parking,
            "type": req.body.type,
            "available": true,
            "listedFor": req.body.listedFor,
            "user": req.body.user,
            "images": images
        });
        return res.status(201).json({ message: "Property Listed Successfully", data: listing });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return next(errorHandler(404, "Property not found"));
        }
        if (req.user.id != listing.user) {
            return next(errorHandler(401, "You can only update your own listings!"));
        }
        listing.images.forEach((image) => {
            const imagePath = path.join('api', image.file);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    return next(errorHandler(500, "Error Updating Property Try again"))
                }
            });
        });
        const images = req.files.map(file => ({
            file: path.relative('api', file.path),
            filename: file.originalname,
            contentType: file.mimetype
        }));
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                price: req.body.price,
                brokerage: req.body.brokerage,
                bathrooms: req.body.bathrooms,
                bedrooms: req.body.bedrooms,
                furnished: req.body.furnished,
                parking: req.body.parking,
                type: req.body.type,
                available: req.body.available,
                listedFor: req.body.listedFor,
                user: req.body.user[0],
                images: images
            }
        },
            { new: true });
        return res.status(200).json({ message: "Property Updated Successfully", data: updatedListing });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return next(errorHandler(404, "Property not found"));
        }
        if (req.user.id != listing.user) {
            return next(errorHandler(401, "You can only delete your own listings!"));
        }
        listing.images.forEach((image) => {
            const imagePath = path.join('api', image.file);
            fs.unlink(imagePath, async (err) => {
                if (err) {
                    return next(errorHandler(500, "Error Deleting Property Try again"))
                }
            });
        });
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Property Deleted");
    } catch (error) {
        next(error)
    }
}

export const getListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Property not found"));
        }
        res.status(200).json(listing);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);

    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let brokerage = req.query.brokerage;
        let furnished = req.query.furnished;
        if (furnished === undefined || furnished == 'all') {
            furnished = { $in: ['Unfurnished', 'Furnished', 'Semi-Furnished'] }
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [true, false] }
        }
        let city = req.query.city || 'None';
        if (city === undefined || city === 'None') {
            city = 'None'
        }
        let listedFor = req.query.listedFor;
        if (listedFor === undefined) {
            listedFor = { $in: ['Rent', 'Sale'] }
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['Apartment', 'Commercial', 'House'] }
        }
        let bedrooms = Number(req.query.beds) || 0;
        if (bedrooms === undefined || bedrooms === 0) {
            bedrooms = { $gte: 0 }
        }
        const minPrice = Number(req.query.minPrice) || 1000;
        let maxPrice = Number(req.query.maxPrice) || 100000000;
        if (maxPrice === 1000)
            maxPrice = 100000000
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt'
        const order = req.query.order || 'desc';
        let filteredListings;
        if (JSON.stringify(req.query) === '{}') {
            filteredListings = await Listing.find().sort({ ['createdAt']: 'desc' }).skip(0).limit(9)
        }
        else if (Object.keys(req.query).length === 2 && req.query.city && req.query.limit) {
            if (city === 'None') {
                filteredListings = await Listing.find({brokerage:{$gte:0}}).sort({ ['createdAt']: 'desc' }).limit(limit)
            }
            else
            {
                filteredListings = await Listing.find({ city: city }).sort({ ['createdAt']: 'desc' }).limit(limit)
            }
            
        }
        else {
            const listings = await Listing.find({
                title: { $regex: searchTerm, $options: 'i' },
                furnished,
                bedrooms,
                parking,
                type,
                listedFor
            }).sort({ [sort]: order }).limit(limit).skip(startIndex)
            filteredListings = listings.filter(listing => {
                return listing.price >= minPrice && listing.price <= maxPrice && (brokerage === 'true' ? listing.brokerage === 0 : true) && (city === 'None' ? true : listing.city === city);
            });
        }
        return res.status(200).json(filteredListings)
    } catch (error) {
        next(error)

    }
}
