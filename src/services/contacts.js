const Contact = require('../db/Contact');

async function getAllContacts() {
  return await Contact.find();
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

async function createContact(data) {
  return await Contact.create(data);
}

async function updateContact(contactId, data) {
  return await Contact.findByIdAndUpdate(contactId, data, { new: true });
}

async function deleteContact(contactId) {
  return await Contact.findByIdAndDelete(contactId);
}

module.exports = { getAllContacts, getContactById, createContact, updateContact, deleteContact };