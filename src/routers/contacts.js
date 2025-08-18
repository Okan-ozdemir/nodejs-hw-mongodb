const express = require('express');
const router = express.Router();
const ctrlWrapper = require('../utils/ctrlWrapper');
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} = require('../controllers/contacts');

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', ctrlWrapper(updateContact));
router.delete('/:contactId', ctrlWrapper(deleteContact));

// Diğer route'lar buraya eklenecek

module.exports = router;