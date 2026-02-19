const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
    const { name, type, password } = req.body;
    try {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, type, password: hashedPassword });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { name, type, password } = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        if (user.type !== type) {
            return res.status(400).json({ error: "Invalid type" });
        }
        console.log(bcrypt.decodeBase64(user.password));
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
