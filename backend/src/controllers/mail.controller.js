import { createTransport } from "nodemailer";
import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

let transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'classco.official@gmail.com',
        pass: 'idenxewiadnxwuoiadx'
    }
});

const sendMail = expressAsyncHandler(async (req, res) => {
    const { email, subject, message } = req.body;

    const mailOptions = {
        from: 'beras5170@gmail.com',
        to: email,
        subject:"Hi there",
        text:"ha ha ha"
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ' + error.message);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }

        console.log('Email sent successfully: ' + info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    });
});

export { sendMail };
