import { GeneralMessage } from '../../models/GeneralMessage.js';
import { validationResult } from 'express-validator';

// POST /api/message/send
export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }
    const newMessage = await GeneralMessage.create({ name, email, message });
    res.status(201).json({ data: newMessage, message: 'Message sent successfully.' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to send message.' });
  }
};

// GET /api/message/notifications (admin only)
export const getAllMessages = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only.' });
    }
    const messages = await GeneralMessage.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json({ data: messages });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};

// DELETE /api/message/:id (admin only)
export const deleteMessage = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only.' });
    }
    const { id } = req.params;
    const deleted = await GeneralMessage.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete message.' });
  }
}; 