const Contact = require('../db/Contact');

async function getAllContacts({ page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite, userId }) {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  let filter = { userId };
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const contacts = await Contact.find(filter).sort(sort).skip(skip).limit(limit);
  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page: parseInt(page),
    perPage: parseInt(perPage),
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
}

async function getContactById(contactId, userId) {
  return await Contact.findOne({ _id: contactId, userId });
}

async function createContact(data) {
  return await Contact.create(data);
}

async function updateContact(contactId, data, userId) {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, data, { new: true });
}

async function deleteContact(contactId, userId) {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
}

module.exports = { getAllContacts, getContactById, createContact, updateContact, deleteContact };