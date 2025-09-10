

import express from 'express';
import { loginUser, regitserUser } from '../controllers/user.controller.js';


const router = express.Router();

router.post("/register",regitserUser);
// /auth/register
router.post("/login",loginUser);

export default router;




