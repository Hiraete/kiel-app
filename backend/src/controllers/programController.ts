import { Request, Response } from 'express';
import { Program } from '../models/Program';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
    _id?: string;
  };
}

// Program oluştur
export const createProgram = async (req: AuthRequest, res: Response) => {
  try {
    const program = new Program({
      ...req.body,
      createdBy: req.user?.id,
    });
    await program.save();
    res.status(201).json(program);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Tüm programları getir
export const getPrograms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const programs = await Program.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    res.json(programs);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Tek bir programı getir
export const getProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('activities.activityId');
    
    if (!program) {
      res.status(404).json({ message: 'Program bulunamadı' });
      return;
    }
    res.json(program);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Programı güncelle
export const updateProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      res.status(404).json({ message: 'Program bulunamadı' });
      return;
    }

    if (program.createdBy.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      return;
    }

    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedProgram);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Programı sil
export const deleteProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      res.status(404).json({ message: 'Program bulunamadı' });
      return;
    }

    if (program.createdBy.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      return;
    }

    await program.deleteOne();
    res.json({ message: 'Program başarıyla silindi' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Program ilerlemesini güncelle
export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      res.status(404).json({ message: 'Program bulunamadı' });
      return;
    }

    if (!req.user?.id) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const { activityId, completed, notes } = req.body;

    const activityExists = program.activities.some(
      (activity) => activity.activityId.toString() === activityId
    );

    if (!activityExists) {
      res.status(404).json({ message: 'Aktivite bulunamadı' });
      return;
    }

    const existingProgress = program.progress.find(
      (p) => p.activityId.toString() === activityId &&
      p.date.toDateString() === new Date().toDateString()
    );

    if (existingProgress) {
      existingProgress.completed = completed;
      existingProgress.notes = notes;
    } else {
      program.progress.push({
        activityId: new mongoose.Types.ObjectId(activityId),
        date: new Date(),
        completed,
        notes,
      });
    }

    await program.save();
    res.json(program);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
}; 