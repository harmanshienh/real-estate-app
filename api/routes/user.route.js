import express from 'express';
import { test, updateUser, deleteUser, getListings, getUser, getUserListings, getUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getListings);
router.get('/profile/:id', verifyToken, getUser);
router.get('/get', getUsers);
router.get('/:id', getUser);
router.get('/userListings/:id', getUserListings);


export default router;