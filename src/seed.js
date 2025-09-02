const fs = require('fs');
const path = require('path');
const Contact = require('./db/Contact');
const { initMongoConnection } = require('./db/initMongoConnection');
require('dotenv').config();

async function seedContacts() {
  try {
    await initMongoConnection();

    const contactsPath = path.join(__dirname, '..', 'contacts.json');
    const contactsData = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));

    await Contact.insertMany(contactsData);
    console.log('Contacts seeded successfully!');
  } catch (error) {
    console.error('Error seeding contacts:', error);
  } finally {
    process.exit();
  }
}

seedContacts();