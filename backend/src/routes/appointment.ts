import express, { Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { Appointment } from '../models/Appointment';
import { User } from '../models/User';

const router = express.Router();

// Randevuları getir
router.get('/', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { 'client.id': req.user?.id },
        { 'expert.id': req.user?.id }
      ]
    }).sort({ date: -1, startTime: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Randevular alınamadı' });
  }
});

// Randevu oluştur
router.post('/', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    const appointment = new Appointment({
      expert: req.body.expert,
      client: {
        id: user._id,
        name: user.profile.fullName
      },
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      notes: req.body.notes,
      status: 'pending'
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Randevu oluşturulamadı' });
  }
});

// Randevu durumunu güncelle
router.patch('/:id/status', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ message: 'Randevu bulunamadı' });
      return;
    }

    if (appointment.expert.id.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      return;
    }

    appointment.status = req.body.status;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Randevu durumu güncellenemedi' });
  }
});

// Randevuyu iptal et
router.delete('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ message: 'Randevu bulunamadı' });
      return;
    }

    if (appointment.client.id.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      return;
    }

    await appointment.deleteOne();
    res.json({ message: 'Randevu iptal edildi' });
  } catch (error) {
    res.status(500).json({ message: 'Randevu iptal edilemedi' });
  }
});

export default router; 