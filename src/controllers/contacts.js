const { getAllContacts, getContactById, createContact, updateContact, deleteContact } = require('../services/contacts');
const createHttpError = require('http-errors');

async function getContactsController(req, res) {
  const { page = 1, perPage = 10, sortBy, sortOrder, type, isFavourite } = req.query;
  const userId = req.user._id;
  const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, type, isFavourite, userId });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

async function getContactController(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

async function createContactController(req, res) {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const userId = req.user._id;
  const contact = await createContact({ name, phoneNumber, email, isFavourite, contactType, userId });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
}

async function updateContactController(req, res) {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const userId = req.user._id;

  const contact = await updateContact(contactId, { name, phoneNumber, email, isFavourite, contactType }, userId);
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contact,
  });
}

async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }
  res.status(204).send();
}

module.exports = { getContactsController, getContactController, createContactController, updateContactController, deleteContactController };