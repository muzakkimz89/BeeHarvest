import bcrypt from 'bcryptjs';
import jwt  from "jsonwebtoken";
import User from "../models/userModel.js" 

export const register = async (req, res,next) => {
    try {
        console.log("masuk")
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: 'User with same email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).send({message: "User Created Successfully"});
    } catch (error) {
        res.status(500).send({
            message: "Error creating user",
            error,
        });
    }
}

export const login = async (req, res, next) => {
    try {
      console.log("masuk login")
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: 'Email not found' });
      }
      //console.log(user.email)
      if (await bcrypt.compare(password, user.password)) {
        //console.log("jwt")
        const token = jwt.sign(
          {
            userId: user._id,
            userEmail: user.email,
          },
          process.env['TOKEN_JWT'],
          { expiresIn: "24h" }
        );
        return res.status(200).send({ message: 'Login Successful',userId: user._id, email: user.email, token });
      } else {
        return res.status(400).send({ message: 'Passwords do not match' });
      }
    } catch(error) {
        res.status(500).send({ message: 'Error logging in', error });
    }
}