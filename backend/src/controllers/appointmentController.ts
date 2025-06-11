import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
    _id?: string;
  };
}

interface AvailabilitySlot {
  start: string;
  end: string;
}

interface ExpertAvailability {
  monday: AvailabilitySlot[];
  tuesday: AvailabilitySlot[];
  wednesday: AvailabilitySlot[];
  thursday: AvailabilitySlot[];
  friday: AvailabilitySlot[];
  saturday: AvailabilitySlot[];
  sunday: AvailabilitySlot[];
}

export class AppointmentController {
  // Randevu oluşturma
  async createAppointment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { expertId, date, startTime, endTime, notes } = req.body;
      const clientId = req.user?.id;

      // Uzmanın müsaitlik durumunu kontrol et
      const expert = await User.findById(expertId);
      if (!expert || expert.role !== 'uzman') {
        res.status(404).json({ message: 'Uzman bulunamadı' });
        return;
      }

      const appointmentDate = new Date(date);
      const dayOfWeek = appointmentDate.toLocaleDateString('tr-TR', { weekday: 'long' });
      
      // Uzmanın o gün için müsaitlik durumunu kontrol et
      const availability = expert.profile?.expertProfile?.availability as ExpertAvailability | undefined;
      const isAvailable = availability?.[dayOfWeek as keyof ExpertAvailability]?.some(
        (slot: AvailabilitySlot) => slot.start <= startTime && slot.end >= endTime
      );

      if (!isAvailable) {
        res.status(400).json({ message: 'Seçilen saatte uzman müsait değil' });
        return;
      }

      // Randevu çakışmasını kontrol et
      const existingAppointment = await Appointment.findOne({
        expert: expertId,
        date: appointmentDate,
        startTime,
        status: { $ne: 'cancelled' },
      });

      if (existingAppointment) {
        res.status(400).json({ message: 'Bu saatte başka bir randevu var' });
        return;
      }

      const appointment = new Appointment({
        expert: expertId,
        client: clientId,
        date: appointmentDate,
        startTime,
        endTime,
        notes,
      });

      await appointment.save();

      res.status(201).json({
        message: 'Randevu başarıyla oluşturuldu',
        appointment,
      });
    } catch (error) {
      console.error('Randevu oluşturma hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }

  // Randevuları listeleme
  async getAppointments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { role } = req.user || {};

      let query = {};
      if (role === 'uzman') {
        query = { expert: userId };
      } else {
        query = { client: userId };
      }

      const appointments = await Appointment.find(query)
        .populate('expert', 'fullName profile')
        .populate('client', 'fullName profile')
        .sort({ date: 1, startTime: 1 });

      res.json({ appointments });
    } catch (error) {
      console.error('Randevu listeleme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }

  // Randevu durumunu güncelleme
  async updateAppointmentStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { appointmentId } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        res.status(404).json({ message: 'Randevu bulunamadı' });
        return;
      }

      // Sadece randevu sahibi veya uzman durumu güncelleyebilir
      if (appointment.expert.toString() !== userId && appointment.client.toString() !== userId) {
        res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
        return;
      }

      appointment.status = status;
      await appointment.save();

      res.json({
        message: 'Randevu durumu güncellendi',
        appointment,
      });
    } catch (error) {
      console.error('Randevu güncelleme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }

  // Randevu değerlendirme
  async rateAppointment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { appointmentId } = req.params;
      const { rating, review } = req.body;
      const userId = req.user?.id;

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        res.status(404).json({ message: 'Randevu bulunamadı' });
        return;
      }

      // Sadece randevu sahibi değerlendirme yapabilir
      if (appointment.client.toString() !== userId) {
        res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
        return;
      }

      // Sadece tamamlanmış randevular değerlendirilebilir
      if (appointment.status !== 'completed') {
        res.status(400).json({ message: 'Sadece tamamlanmış randevular değerlendirilebilir' });
        return;
      }

      appointment.rating = rating;
      appointment.review = review;
      await appointment.save();

      // Uzmanın ortalama puanını güncelle
      const expert = await User.findById(appointment.expert);
      if (expert && expert.profile?.expertProfile) {
        const appointments = await Appointment.find({
          expert: appointment.expert,
          rating: { $exists: true },
        });
        
        const totalRating = appointments.reduce((sum, app) => sum + (app.rating || 0), 0);
        expert.profile.expertProfile.rating = totalRating / appointments.length;
        expert.profile.expertProfile.totalReviews = appointments.length;
        await expert.save();
      }

      res.json({
        message: 'Değerlendirme başarıyla kaydedildi',
        appointment,
      });
    } catch (error) {
      console.error('Değerlendirme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }
}

export const appointmentController = new AppointmentController(); 