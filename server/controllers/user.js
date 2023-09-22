import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import user from "../models/user.js";
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.SECRET
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid crediential" });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }

};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if( password !== confirmPassword){
            return res.status(400).json({ message: "Password do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await user.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });
        res.status(200).json({ result: result, token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }

};
 

