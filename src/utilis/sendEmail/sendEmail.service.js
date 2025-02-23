import nodemailer from 'nodemailer';

export const sendEmails = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
 
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html,
    });
    return info.rejected.length == 0 ? true : false;
  };
 