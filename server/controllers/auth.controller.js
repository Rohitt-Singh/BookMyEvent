const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../utils/email.util");
const jwt = require("jsonwebtoken");
const otpModel = require("../models/otp.model");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

async function registerUser(req, res) {
  const { name, email, password } = req.body;

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email}: ${otp}`);

    await otpModel.create({
      email,
      otp,
      action: "account_verification",
    });

    await sendOtpEmail(email, otp, "account_verification");

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for the OTP to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid credentials, Please sign up first" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified && user.role === "user") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpModel.deleteMany({ email, action: "account_verification" });

    await otpModel.create({
      email,
      otp,
      action: "account_verification",
    });

    await sendOtpEmail(email, otp, "account_verification");

    return res.status(400).json({
      error:
        "Account not verified. Please check your email for the OTP to verify your account.",
    });
  }

  res.json({
    message: "Login successful",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  const otpRecord = await otpModel.findOne({
    email,
    otp,
    action: "account_verification",
  });
  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const user = await userModel.findOneAndUpdate(
    { email },
    { isVerified: true },
  );
  await otpModel.deleteMany({ email, action: "account_verification" });
  res.json({
    message: "Account verified successfully. You can now log in.",
    _id: user._id,
    name: user.name, 
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
}

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
};
