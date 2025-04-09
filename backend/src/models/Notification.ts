import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'appointment' | 'message' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: {
    appointmentId?: mongoose.Types.ObjectId;
    messageId?: mongoose.Types.ObjectId;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['appointment', 'message', 'system'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Bildirimleri kullanıcıya göre indeksle
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema); 