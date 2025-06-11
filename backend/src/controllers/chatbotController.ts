import { Request, Response } from 'express';
import ChatbotService from '../services/chatbotService';

const chatbotService = ChatbotService.getInstance();

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Chatbot mesajı alındı:', req.body);
    const { message } = req.body;

    if (!message) {
      console.error('Mesaj boş');
      res.status(400).json({
        success: false,
        message: 'Mesaj boş olamaz'
      });
      return;
    }

    const response = await chatbotService.processMessage(message);
    console.log('Chatbot yanıtı:', response);

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chatbot mesaj işleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj işlenirken bir hata oluştu'
    });
  }
}; 