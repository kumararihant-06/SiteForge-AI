import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendVerificationEmail(email, verificationToken){
    const verificationUrl = `${process.env.TRUSTED_ORIGINS}/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
        from:`"SiteForge AI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Email Verification for SiteForge AI",
        html:`
        <h2>Email verification</h2>
        <p>Thank you for registering with SiteForge AI! Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link expires in 24 Hrs.</p>
        <p>If you did not create an account, please ignore this email.</p>
        `
    })
}