import express from 'express';
import { createListing,deleteListing,updateListing,getListing,getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.resolve(__dirname, '../public/images') });
const router = express.Router();
router.post('/create', upload.array('images', 6), verifyToken, createListing);
router.post('/update/:id', upload.array('images', 6), verifyToken, updateListing);
router.delete('/delete/:id',verifyToken, deleteListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router