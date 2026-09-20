const dotenv = require("dotenv");
dotenv.config();
const nodeMailer = require("nodemailer");


const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Account Verification"
        : "Event Booking";

    const msg =
      type === "account_verification"
        ? "Use the OTP below to verify your BookMyEvent account."
        : "Use the OTP below to confirm your event booking.";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: title,
      html: `
        <div style="
          margin: 0;
          padding: 40px 20px;
          background-color: #f5f7fb;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <div style="
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            padding: 40px 35px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          ">

            <h1 style="
              margin: 0;
              color: #4f46e5;
              font-size: 28px;
            ">
              BookMyEvent
            </h1>

            <h2 style="
              margin: 25px 0 10px;
              color: #1f2937;
              font-size: 23px;
            ">
              ${title}
            </h2>

            <p style="
              margin: 0 0 25px;
              color: #6b7280;
              font-size: 15px;
              line-height: 1.6;
            ">
              ${msg}
            </p>

            <div style="
              background-color: #eef2ff;
              border: 1px solid #c7d2fe;
              border-radius: 12px;
              padding: 22px;
              margin-bottom: 25px;
            ">

              <p style="
                margin: 0 0 10px;
                color: #6b7280;
                font-size: 13px;
              ">
                Your One-Time Password
              </p>

              <div style="
                color: #4f46e5;
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 10px;
              ">
                ${otp}
              </div>

            </div>

            <p style="
              margin: 0;
              color: #6b7280;
              font-size: 14px;
              line-height: 1.6;
            ">
              This OTP is valid for
              <strong style="color: #374151;">5 minutes</strong>.
            </p>

            <p style="
              margin: 10px 0 0;
              color: #6b7280;
              font-size: 14px;
            ">
              Please do not share this code with anyone.
            </p>

            <div style="
              height: 1px;
              background-color: #e5e7eb;
              margin: 30px 0;
            "></div>

            <p style="
              margin: 0;
              color: #9ca3af;
              font-size: 12px;
              line-height: 1.5;
            ">
              If you didn't request this OTP, you can safely ignore this email.
            </p>

            <p style="
              margin-top: 25px;
              color: #d1d5db;
              font-size: 11px;
            ">
              © 2026 BookMyEvent. All rights reserved.
            </p>

          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,

      html: `
        <div style="
          margin: 0;
          padding: 40px 20px;
          background-color: #f5f7fb;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <div style="
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            padding: 40px 35px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          ">

            <!-- Brand -->
            <h1 style="
              margin: 0;
              color: #4f46e5;
              font-size: 28px;
            ">
              BookMyEvent
            </h1>

            <!-- Success Icon -->
            <div style="
              width: 60px;
              height: 60px;
              line-height: 60px;
              margin: 25px auto 15px;
              background-color: #dcfce7;
              color: #16a34a;
              border-radius: 50%;
              font-size: 30px;
              font-weight: bold;
            ">
              ✓
            </div>

            <!-- Title -->
            <h2 style="
              margin: 10px 0;
              color: #1f2937;
              font-size: 24px;
            ">
              Booking Confirmed!
            </h2>

            <!-- Greeting -->
            <p style="
              margin: 15px 0;
              color: #374151;
              font-size: 16px;
              line-height: 1.6;
            ">
              Hi <strong>${userName}</strong>,
            </p>

            <p style="
              margin: 0 0 25px;
              color: #6b7280;
              font-size: 15px;
              line-height: 1.6;
            ">
              Your booking for the following event has been successfully confirmed.
            </p>

            <!-- Event Box -->
            <div style="
              background-color: #eef2ff;
              border: 1px solid #c7d2fe;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 25px;
            ">

              <p style="
                margin: 0 0 8px;
                color: #6b7280;
                font-size: 13px;
              ">
                EVENT
              </p>

              <h3 style="
                margin: 0;
                color: #4f46e5;
                font-size: 20px;
              ">
                ${eventTitle}
              </h3>

            </div>

            <p style="
              margin: 0;
              color: #6b7280;
              font-size: 14px;
              line-height: 1.6;
            ">
              Thank you for choosing <strong>BookMyEvent</strong>.
              We hope you have a great experience!
            </p>

            <!-- Divider -->
            <div style="
              height: 1px;
              background-color: #e5e7eb;
              margin: 30px 0;
            "></div>

            <p style="
              margin: 0;
              color: #9ca3af;
              font-size: 12px;
              line-height: 1.5;
            ">
              If you have any questions regarding your booking,
              please contact our support team.
            </p>

            <p style="
              margin-top: 25px;
              color: #d1d5db;
              font-size: 11px;
            ">
              © 2026 BookMyEvent. All rights reserved.
            </p>

          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully to", userEmail);

  } catch (error) {
    console.error("Error sending booking email:", error);
  }
};


module.exports = {
  sendOtpEmail,
  sendBookingEmail
};