import { Request, Response, NextFunction } from 'express';
import { Message } from '../models/Message';
import { User } from '../models/User';

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { receiverId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { receiverId, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({ message: 'Alıcı bulunamadı' });
      return;
    }

    const message = new Message({
      sender: userId,
      receiver: receiverId,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { senderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    await Message.updateMany(
      { sender: senderId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'Mesajlar okundu olarak işaretlendi' });
  } catch (error) {
    next(error);
  }
}; 