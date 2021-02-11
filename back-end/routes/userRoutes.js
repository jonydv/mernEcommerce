import express from 'express';

import {
    authUser, 
    getUserProfile, 
    getUsers, 
    registerUser,
    updateUserProfile,
    deleteUser,
    getUsersById,
    updateUser
} from '../controllers/userController.js'

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);
router
.route('/:id')
.delete(protect, admin, deleteUser)
.get(protect, admin, getUsersById)
.put(protect, admin, updateUser);

export default router;