const User = require("../models/User");
const Student = require("../models/StudentSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { encrypt } = require("../utils/crypto");

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
    const { name, email, type, password } = req.body;
    try {
        if (type === "student") {
            const searchEmail = email || name;
            const student = await Student.findOne({ email: searchEmail });
            console.log();
            if (!student) {
                return res.status(400).json({ error: "Student not found" });
            }
            if (student.password != password) {
                return res.status(400).json({ error: "Invalid password" });
            }
            if (student.isFirstLogin) {
                return res.status(403).json({ error: "Password change required", needsPasswordChange: true, email: student.email });
            }
            
            const token = jwt.sign({ name: student.email, type: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({ token });
        }

        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        if (user.type !== type) {
            return res.status(400).json({ error: "Invalid type" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Update last login timestamp
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, lastLogin: user.lastLogin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Change Password for Student
exports.studentChangePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ error: "Student not found" });
        }
        if (student.password != oldPassword) {
            return res.status(400).json({ error: "Invalid old password" });
        }
        
        student.password = newPassword;
        student.isFirstLogin = false;
        await student.save();

        const token = jwt.sign({ name: student.email, type: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
