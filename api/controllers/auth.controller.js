import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

const signUp = async (req, res, next) => {
    const { username, email, phone, password1 } = req.body;
    const hashedPassword = bcryptjs.hashSync(password1, 14);
    const newUser = new User({ username, email, phone, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ 'message': "User Created Successfully" });
    }
    catch (error) {
        next(error);
    }
}

const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User Not Found'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Invalid Password"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        res.cookie('access_token', token, { httpOnly: true }).status(200).json({ '_id': validUser._id, 'username': validUser.username, 'email': validUser.email, 'phone': validUser.phone });
    }
    catch (error){
        next(error);
    }
}

const signOut = (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json("Logged Out");
    } catch (error) {
        next(error);
    }
}

export { signUp, signIn, signOut }