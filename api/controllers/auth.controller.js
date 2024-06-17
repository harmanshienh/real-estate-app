import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import emailTransporter from '../utils/emailTransporter.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username or email already exists' 
            });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();

        jwt.sign(
            { id: newUser._id },
            process.env.EMAIL_SECRET,
            { expiresIn: '1d' },
            async (err, emailToken) => {
                if (err) {
                    return res.status(500)
                    .json({ 
                        success: false, 
                        message: 'Error creating email verification token' 
                    });
                }
                const url = `${process.env.CLIENT_URL}/verify/${emailToken}`;

                try {
                    await emailTransporter.sendMail({
                        to: newUser.email,
                        subject: 'Confirm Email',
                        html: `Verify your account through the following link:
                        <a href="${url}">Verify your account</a>`,
                    });
                    res.status(201).json({ 
                        success: true, 
                        message: `An email has been sent to ${newUser.email}. You have 24 hours to verify your account`,
                        token: emailToken
                    });
                } catch (emailError) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error sending email', 
                        error: emailError.message 
                    });
                }
            }
        );
    } catch (error) {
        next(error);
    }
};

export const confirmUser = async (req, res, next) => {
    try {
        const { id } = jwt.verify(req.params.emailToken, process.env.EMAIL_SECRET);
        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: {
                verified: true
            },
        }, { new: true })
        if (updatedUser) {
            return res.status(200).json({ 
                message: 'User confirmed successfully.', 
                updated: updatedUser 
            });
        } else {
            return res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { emailOrUsername, password } = req.body;

    try {
        const validUser = await User.findOne({
            $or: [{ email: emailOrUsername, verified: true }, 
                  { username: emailOrUsername, verified: true }]
          });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, 'Incorrect email or password'));
        }
        const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('token', token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.cookie('token', token, { httpOnly: true }).status(200).json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + 
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({ username: req.body.name.split(" ").join("").
                toLowerCase() + Math.random().toString(36).slice(-4), 
            email: req.body.email, 
            password: hashedPassword,
            avatar: req.body.photo });
            
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('token', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('token'); 
        res.status(200).json('User has been logged out.');
    } catch (error) {
        next(error)
    }
}