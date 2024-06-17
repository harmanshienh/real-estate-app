import express from 'express';
import { 
    signup,
    confirmUser, 
    signin, 
    google, 
    signout 
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.get("/confirmation/:emailToken", confirmUser);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout); 

export default router;