import express from 'express';
import { getAllReplies, createReply } from './../controllers/maintainReplyController.js'; // Adjust the import path as necessary

export const router = express.Router();

// Route to get all replies
router.get('/get-reply', getAllReplies);

// Route to create a new reply
router.post('/create-reply', createReply);

