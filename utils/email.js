const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Majd Halawa <${process.env.EMAIL_FROM}>`;
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      { firstName: this.firstName, url: this.url, subject },
    );

    const text = htmlToText.convert(html);

    if (process.env.NODE_ENV === 'production') {
      // Production: SendGrid via HTTPS API (works on Render)
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to: this.to,
        from: this.from,
        subject,
        html,
        text,
      });
    } else {
      // Development: local SMTP (mailtrap etc.)
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      await transporter.sendMail({
        from: this.from,
        to: this.to,
        subject,
        html,
        text,
      });
    }
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to natours family!');
  }
  async sendResetPassword() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
