import express from 'express';
import { createMessage, getAllMessages, deleteMessage } from '../../controller/message/messageController.js';
import { requireAuth } from '../../middleware/auth-middleware.js';

const router = express.Router();

// Public: Send a message
router.post('/send', createMessage);

// Admin: View all messages
router.get('/notifications', requireAuth, getAllMessages);

// Admin: Delete a message
router.delete('/:id', requireAuth, deleteMessage);

export default router; 