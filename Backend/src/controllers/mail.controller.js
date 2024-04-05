import { createTransport } from "nodemailer";

async function sendMail(callback) {
    let transporter;
    try {
        transporter = createTransport({
            service: 'gmail',
            auth: {
                user: 'beras5170@gmail.com',
                pass: 'btyntcsngnwaohmc'
            }
        });

        const mailOptions = {
            from: 'beras5170@gmail.com',
            to: 'berasaikat729@gmail.com,pinakib075@gmail.com',
            subject: 'oisncoiednifc',
            text: 'this email nodejs'
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully' + result);

        transporter.close();

        callback(null, 'Email sent successfully');
    } catch (error) {
        console.log('error' + error);

        if (transporter) {
            transporter.close();
        }

        callback(error);
    }
}

export { sendMail };
