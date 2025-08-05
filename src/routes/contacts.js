const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  getContactById,
} = require('../services/contacts');

router.get('/', getAllContacts);
router.get('/:contactId', getContactById);

module.exports = router;
