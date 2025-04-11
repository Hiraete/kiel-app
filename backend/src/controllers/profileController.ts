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
  id: string;
  name: string;
  birthDate: string;
  gender: 'erkek' | 'kiz';
  autismLevel: 'hafif' | 'orta' | 'agir';
  interests: string[];
  developmentAreas: string[];
}

// Profil bilgilerini getir
export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Profil bilgilerini güncelle
export const updateProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    return res.json(user);
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Çocuk profili ekle
export const addChildProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (!user.profile.childProfiles) {
      user.profile.childProfiles = [];
    }

    const childData: ChildProfile = {
      id: new Date().getTime().toString(),
      name: req.body.name,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      autismLevel: req.body.autismLevel,
      interests: req.body.interests || [],
      developmentAreas: req.body.developmentAreas || [],
    };

    user.profile.childProfiles.push(childData);
    await user.save();

    return res.json(user.profile.childProfiles);
  } catch (error) {
    console.error('Çocuk profili ekleme hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Çocuk profili güncelle
export const updateChildProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const { childId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (!user.profile.childProfiles) {
      return res.status(404).json({ message: 'Çocuk profili bulunamadı' });
    }

    const childIndex = user.profile.childProfiles.findIndex(
      (child: ChildProfile) => child.id === childId
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

    user.profile.childProfiles[childIndex] = {
      ...user.profile.childProfiles[childIndex],
      ...updatedChildData,
    } as ChildProfile;

    await user.save();
    return res.json(user.profile.childProfiles[childIndex]);
  } catch (error) {
    console.error('Çocuk profili güncelleme hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Çocuk profili sil
export const deleteChildProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const { childId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (!user.profile.childProfiles) {
      return res.status(404).json({ message: 'Çocuk profili bulunamadı' });
    }

    user.profile.childProfiles = user.profile.childProfiles.filter(
      (child: ChildProfile) => child.id !== childId
    );

    await user.save();
    return res.json({ message: 'Çocuk profili silindi' });
  } catch (error) {
    console.error('Çocuk profili silme hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 