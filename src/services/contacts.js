const Contact = require('../db/models/Contact');

const getAllContacts = async () => {
  return await Contact.find();
};

const getContactById = async (id) => {
  return await Contact.findById(id);
};

const createContact = async (data) => {
  return await Contact.create(data);
};

const updateContact = async (id, data) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    return null;
  }
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

const deleteContact = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    return null;
  }
  return await Contact.findByIdAndDelete(id);
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
