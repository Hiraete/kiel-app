import { Request, Response } from 'express';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
    _id?: string;
  };
}

interface ChildProfile {
  name: string;
  birthDate: string;
  gender: 'erkek' | 'kiz';
  autismLevel: string;
  interests: string[];
  developmentAreas: string[];
}

// Profil bilgilerini getir
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Profil bilgilerini güncelle
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const { name, email } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Çocuk profili ekle
export const addChildProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const childData: ChildProfile = {
      name: req.body.name,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      autismLevel: req.body.autismLevel,
      interests: req.body.interests || [],
      developmentAreas: req.body.developmentAreas || [],
    };

    if (!user.childProfiles) {
      user.childProfiles = [];
    }

    user.childProfiles.push(childData);
    await user.save();

    res.json(user.childProfiles);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Çocuk profili güncelle
export const updateChildProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (!user.childProfiles) {
      return res.status(404).json({ message: 'Çocuk profili bulunamadı' });
    }

    const childIndex = user.childProfiles.findIndex(
      (child) => child.name === req.params.childName
    );

    if (childIndex === -1) {
      return res.status(404).json({ message: 'Çocuk profili bulunamadı' });
    }

    const updatedChildData: Partial<ChildProfile> = {
      name: req.body.name,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      autismLevel: req.body.autismLevel,
      interests: req.body.interests,
      developmentAreas: req.body.developmentAreas,
    };

    user.childProfiles[childIndex] = {
      ...user.childProfiles[childIndex],
      ...updatedChildData,
    } as ChildProfile;

    await user.save();
    res.json(user.childProfiles[childIndex]);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Çocuk profili sil
export const deleteChildProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (!user.childProfiles) {
      return res.status(404).json({ message: 'Çocuk profili bulunamadı' });
    }

    user.childProfiles = user.childProfiles.filter(
      (child) => child.name !== req.params.childName
    );

    await user.save();
    res.json({ message: 'Çocuk profili başarıyla silindi' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
}; 