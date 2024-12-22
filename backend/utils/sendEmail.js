const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        // service: process.env.SMPT_SERVICE,
        // auth: {
        //     user: process.env.SMPT_MAIL,
        //     pass :process.env.SMPT_PASSWORD,
        // }
        host : "smtp.gmail.com",
        port: 465,
        service: "gmail",
        auth: {
            user: "deyabhranil1033@gmail.com",
            pass : "dustmczwtvmblhvp",
        }
    })

    const mailOptions = {
        from: "deyabhranil1033@gmail.com",
        to: options.email,
        subject:options.subject,
        text:options.message,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;