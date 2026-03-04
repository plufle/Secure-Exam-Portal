const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const Student = require("./models/StudentSchema");
const { encrypt } = require("./utils/crypto");
const connectDB = require("./config/db");

async function testQuery() {
    await connectDB();
    
    // Attempt basic query to see what it translates to
    const rawEmail = "test1@example.com";
    const encryptedEmail = encrypt(rawEmail);
    
    console.log("Raw Email:", rawEmail);
    console.log("Encrypted Email (manual):", encryptedEmail);
    
    // Mongoose debugging
    mongoose.set('debug', true);
    
    // 1. Query with raw email
    console.log("--- Querying with raw email ---");
    const s1 = await Student.findOne({ email: rawEmail });
    console.log("Result S1:", s1 ? s1.email : "Not found");
    
    // 2. Query with encrypted email
    console.log("--- Querying with encrypted email ---");
    const s2 = await Student.findOne({ email: encryptedEmail });
    console.log("Result S2:", s2 ? s2.email : "Not found");
    
    process.exit(0);
}

testQuery();
