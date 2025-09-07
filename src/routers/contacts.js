const express = require('express');
const multer = require('multer');
const { getContactsController, getContactController, createContactController, updateContactController, deleteContactController } = require('../controllers/contacts');
const ctrlWrapper = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const authenticate = require('../middlewares/authenticate');
const { createContactSchema, updateContactSchema } = require('../schemas/contact');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get('/', authenticate, ctrlWrapper(getContactsController));
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactController));
router.post('/', authenticate, upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId', authenticate, isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContactController));

module.exports = router;