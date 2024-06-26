import express from 'express'
import { signup, signin, googleAuth, signOut, confirmEmail } from '../controllers/auth.controller.js'
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.get('/signout', signOut);
router.get('/confirmation/:token', confirmEmail);
export default router;