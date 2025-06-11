import { Request, Response } from 'express';
import { User, ChildProfile } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
    _id?: string;
  };
}

// Profil bilgilerini getir
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Profil bilgilerini güncelle
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }
    const { name, email } = req.body;
    if (name) (user as any).name = name;
    if (email) (user as any).email = email;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Çocuk profili ekle
export const addChildProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const { name, birthDate, gender, autismLevel, interests, developmentAreas } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    const newChildProfile: ChildProfile = {
      id: new Date().getTime().toString(),
      name,
      birthDate,
      gender,
      autismLevel,
      interests: interests || [],
      developmentAreas: developmentAreas || [],
    };

    user.childProfiles.push(newChildProfile);
    await user.save();

    res.status(201).json(newChildProfile);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
};

// Çocuk profili güncelle
export const updateChildProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const { childId } = req.params;
    const { name, birthDate, gender, autismLevel, interests, developmentAreas } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    const childProfile = user.childProfiles.find(child => child.id === childId);
    if (!childProfile) {
      res.status(404).json({ message: 'Çocuk profili bulunamadı' });
      return;
    }

    childProfile.name = name || childProfile.name;
    childProfile.birthDate = birthDate || childProfile.birthDate;
    childProfile.gender = gender || childProfile.gender;
    childProfile.autismLevel = autismLevel || childProfile.autismLevel;
    childProfile.interests = interests || childProfile.interests;
    childProfile.developmentAreas = developmentAreas || childProfile.developmentAreas;

    await user.save();
    res.json(childProfile);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
};

// Çocuk profili sil
export const deleteChildProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const { childId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    const childProfileIndex = user.childProfiles.findIndex(child => child.id === childId);
    if (childProfileIndex === -1) {
      res.status(404).json({ message: 'Çocuk profili bulunamadı' });
      return;
    }

    user.childProfiles.splice(childProfileIndex, 1);
    await user.save();

    res.json({ message: 'Çocuk profili başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
};

export const getChildProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    res.json(user.childProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
}; 