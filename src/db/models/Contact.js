const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  isFavourite: {
    type: Boolean,
    default: false
  },
  contactType: {
    type: String,
    required: [true, 'Contact type is required'],
    enum: ['work', 'home', 'personal'],
    default: 'personal'
  }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;