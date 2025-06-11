import { Request, Response } from 'express';
import twilio from 'twilio';
import { config } from '../config';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export const generateToken = async (req: Request, res: Response) => {
  try {
    const { appointmentId, userId } = req.body;

    // Twilio kimlik bilgileri
    const accountSid = config.twilio.accountSid;
    const apiKey = config.twilio.apiKey;
    const apiSecret = config.twilio.apiSecret;

    // Token oluştur
    if (!accountSid || !apiKey || !apiSecret || !userId) {
      throw new Error('Gerekli Twilio kimlik bilgileri veya kullanıcı kimliği eksik');
    }
    const accessToken = new AccessToken(
      accountSid,
      apiKey,
      apiSecret,
      { identity: userId }
    );

    // Video izni ekle
    const videoGrant = new VideoGrant({
      room: appointmentId,
    });
    accessToken.addGrant(videoGrant);

    // Token'ı döndür
    res.json({
      token: accessToken.toJwt(),
    });
  } catch (error) {
    console.error('Token oluşturulurken hata:', error);
    res.status(500).json({
      error: 'Token oluşturulurken bir hata oluştu',
    });
  }
}; 