const express = require('express');
const { getContactsController, getContactController, createContactController, updateContactController, deleteContactController } = require('../controllers/contacts');
const ctrlWrapper = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const authenticate = require('../middlewares/authenticate');
const { createContactSchema, updateContactSchema } = require('../schemas/contact');

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(getContactsController));
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactController));
router.post('/', authenticate, validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId', authenticate, isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContactController));

module.exports = router;