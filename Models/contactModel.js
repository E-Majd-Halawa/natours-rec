const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address.'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address.'],
    },
    subject: {
      type: String,
      required: [true, 'Please provide a message subject.'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please write your message.'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
