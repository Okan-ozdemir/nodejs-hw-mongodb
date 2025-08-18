const contactsService = require('../services/contacts');
const createError = require('http-errors');

// GET /contacts
const getContacts = async (req, res) => {
  const contacts = await contactsService.getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// GET /contacts/:contactId
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// POST /contacts
const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields');
  }
  
  // Email doğrulaması
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError(400, 'Invalid email format');
  }
  
  // Telefon numarası doğrulaması
  if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
    throw createError(400, 'Invalid phone number format');
  }
  
  const newContact = await contactsService.createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH /contacts/:contactId
const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await contactsService.updateContact(contactId, req.body);
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// DELETE /contacts/:contactId
const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await contactsService.deleteContact(contactId);
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};