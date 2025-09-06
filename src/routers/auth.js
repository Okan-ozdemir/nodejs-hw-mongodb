const express = require('express');
const { registerController, loginController, refreshController, logoutController } = require('../controllers/auth');
const ctrlWrapper = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody');
const authenticate = require('../middlewares/authenticate');
const { registerSchema, loginSchema } = require('../schemas/auth');

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', ctrlWrapper(refreshController));
router.post('/logout', authenticate, ctrlWrapper(logoutController));

module.exports = router;