const express = require('express');
const { registerController, loginController, refreshController, logoutController, sendResetEmailController, resetPasswordController } = require('../controllers/auth');
const ctrlWrapper = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody');
const authenticate = require('../middlewares/authenticate');
const { registerSchema, loginSchema, sendResetEmailSchema, resetPasswordSchema } = require('../schemas/auth');

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', ctrlWrapper(refreshController));
router.post('/logout', authenticate, ctrlWrapper(logoutController));
router.post('/send-reset-email', validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmailController));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

module.exports = router;