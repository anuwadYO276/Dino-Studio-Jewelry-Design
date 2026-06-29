import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendOtpEmailParams {
  to: string;
  otp: string;
}

export async function sendOtpEmail({ to, otp }: SendOtpEmailParams) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "Dino Studio <noreply@dinostudio.com>",
    to,
    subject: "Your Dino Studio Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a1a; margin-bottom: 16px;">Dino Studio</h2>
        <p style="color: #444; font-size: 16px; line-height: 1.5;">
          Your verification code is:
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">
            ${otp}
          </span>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.5;">
          This code expires in 5 minutes. Do not share it with anyone.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
